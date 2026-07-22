// ============================================================================
// Price list importer
// Flow: drop .xlsx → detect supplier (importer-profiles.js) → parse rows →
// diff against the database → admin approves → publish:
//   1. insert new products            4. recompute display prices site-wide
//   2. upsert supplier offers         5. record the import batch
//   3. hide offers missing from file
// Nothing changes in the database until "Approve & publish" is clicked.
// ============================================================================

let pendingImport = null; // { profile, fileName, records, plan, supplier }

document.addEventListener("DOMContentLoaded", () => {
    // ---- tab switching ----
    document.querySelectorAll(".tab-bar .tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab-bar .tab").forEach(t => t.classList.toggle("active", t === tab));
            const view = tab.getAttribute("data-view");
            document.getElementById("view-orders").classList.toggle("hidden", view !== "orders");
            document.getElementById("view-import").classList.toggle("hidden", view !== "import");
        });
    });

    // ---- dropzone ----
    const dz = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");

    dz.addEventListener("click", () => fileInput.click());
    dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("dragover"); });
    dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
    dz.addEventListener("drop", (e) => {
        e.preventDefault();
        dz.classList.remove("dragover");
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length) handleFile(fileInput.files[0]);
        fileInput.value = "";
    });

    document.getElementById("import-cancel").addEventListener("click", resetImportView);
    document.getElementById("import-again").addEventListener("click", resetImportView);
    document.getElementById("import-apply").addEventListener("click", applyImport);
});

function importError(msg) {
    const el = document.getElementById("import-error");
    el.innerText = msg;
    el.classList.remove("hidden");
}

function resetImportView() {
    pendingImport = null;
    document.getElementById("import-error").classList.add("hidden");
    document.getElementById("import-preview").classList.add("hidden");
    document.getElementById("import-progress").classList.add("hidden");
    document.getElementById("import-done").classList.add("hidden");
    document.getElementById("dropzone").classList.remove("hidden");
}

function setProgress(text) {
    document.getElementById("progress-text").innerText = text;
}

// ---------------------------------------------------------------------------
// 1. Parse the file and build the change plan (no DB writes here)
// ---------------------------------------------------------------------------
async function handleFile(file) {
    resetImportView();

    if (!/\.xlsx?$/i.test(file.name)) {
        importError("This does not look like an Excel file (.xlsx expected).");
        return;
    }

    let wb;
    try {
        wb = XLSX.read(await file.arrayBuffer());
    } catch (err) {
        importError("Could not read this Excel file: " + err.message);
        return;
    }

    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const headerRow = (XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null })[0] || []).map(c => String(c || ""));
    const profile = detectSupplier(wb.SheetNames, headerRow);
    if (!profile) {
        importError("Could not recognize the supplier of this file. Expected an Elit Electronics workbook (sheet 'ელიტი') or a Kontakt workbook (sheet 'გათბობა-გაგრილება').");
        return;
    }

    const ws = wb.Sheets[profile.pickSheet(wb.SheetNames)];
    const rawRows = XLSX.utils.sheet_to_json(ws, { defval: null });

    // Parse + dedupe by supplier item code (keep the first occurrence)
    const seenCodes = new Set();
    const records = [];
    for (const raw of rawRows) {
        let rec;
        try { rec = profile.parseRow(raw); } catch (err) { rec = null; }
        if (!rec || !rec.supplierItemCode) continue;
        if (seenCodes.has(rec.supplierItemCode)) continue;
        seenCodes.add(rec.supplierItemCode);
        records.push(rec);
    }

    if (records.length === 0) {
        importError("Recognized the file as " + profile.name + ", but found no climate products in it.");
        return;
    }

    await buildPlan(profile, file.name, records);
}

async function buildPlan(profile, fileName, records) {
    document.getElementById("dropzone").classList.add("hidden");
    document.getElementById("import-progress").classList.remove("hidden");
    setProgress("Comparing " + records.length + " products with the database…");

    try {
        const { data: supplier, error: supErr } = await sbClient
            .from("suppliers").select("*").eq("slug", profile.slug).single();
        if (supErr || !supplier) throw new Error("Supplier '" + profile.slug + "' is missing from the suppliers table.");

        const { data: dbProducts, error: prodErr } = await sbClient.from("products").select("*");
        if (prodErr) throw new Error(prodErr.message);
        const { data: dbOffers, error: offErr } = await sbClient
            .from("supplier_offers").select("*").eq("supplier_id", supplier.id);
        if (offErr) throw new Error(offErr.message);

        const prodByKey = {};
        dbProducts.forEach(p => { prodByKey[p.brand + "|" + p.model] = p; });
        const offerByCode = {};
        dbOffers.forEach(o => { offerByCode[o.supplier_item_code] = o; });

        const plan = { newProducts: [], newOffers: [], updates: [], unchanged: [], review: [], missing: [] };
        const newProductKeys = new Set();
        const fileCodes = new Set();

        for (const rec of records) {
            const disp = computeDisplayPrices(rec);
            if (!rec.brand || !rec.model) { plan.review.push({ rec, reason: "no brand/model" }); continue; }
            if (!disp.displayPrice) { plan.review.push({ rec, reason: "no usable price" }); continue; }

            fileCodes.add(rec.supplierItemCode);
            const key = rec.brand + "|" + rec.model;
            const existingOffer = offerByCode[rec.supplierItemCode];

            if (!prodByKey[key] && !newProductKeys.has(key)) {
                newProductKeys.add(key);
                plan.newProducts.push(rec);
            }

            if (!existingOffer) {
                if (!plan.newProducts.includes(rec)) plan.newOffers.push(rec);
            } else {
                const changed =
                    Number(existingOffer.retail_price || 0) !== (rec.retailPrice || 0) ||
                    Number(existingOffer.action_price || 0) !== (rec.actionPrice || 0) ||
                    Number(existingOffer.dealer_price || 0) !== (rec.dealerPrice || 0) ||
                    existingOffer.in_stock !== rec.inStock;
                if (changed) {
                    plan.updates.push({ rec, old: existingOffer });
                } else {
                    plan.unchanged.push(rec);
                }
            }
        }

        // offers of this supplier that today's file no longer contains → hide
        plan.missing = dbOffers.filter(o => o.in_stock && !fileCodes.has(o.supplier_item_code));

        pendingImport = { profile, fileName, records, plan, supplier };
        renderPreview();
    } catch (err) {
        resetImportView();
        importError("Could not prepare the import: " + err.message);
    }
}

// ---------------------------------------------------------------------------
// 2. Preview
// ---------------------------------------------------------------------------
function fmtMoney(n) {
    return n == null ? "—" : Number(n).toLocaleString() + " ₾";
}

function renderPreview() {
    const { profile, fileName, plan } = pendingImport;

    document.getElementById("import-progress").classList.add("hidden");
    document.getElementById("import-preview").classList.remove("hidden");
    document.getElementById("preview-file").innerText = fileName;
    document.getElementById("preview-supplier").innerText = profile.name;

    const counts = [
        { n: plan.newProducts.length, label: "new products", cls: "cc-new" },
        { n: plan.newOffers.length, label: "new offers", cls: "cc-new" },
        { n: plan.updates.length, label: "price/stock updates", cls: "cc-price" },
        { n: plan.missing.length, label: "gone from file → hidden", cls: "cc-missing" },
        { n: plan.review.length, label: "need review (skipped)", cls: "cc-review" },
        { n: plan.unchanged.length, label: "unchanged", cls: "cc-same" },
    ].filter(c => c.n > 0);

    document.getElementById("count-row").innerHTML = counts.map(c =>
        `<span class="count-chip ${c.cls}">${c.n} ${c.label}</span>`
    ).join("") || '<span class="count-chip cc-same">Nothing to do — the database already matches this file.</span>';

    const rows = [];
    const pushRec = (badgeCls, badgeText, rec, oldOffer) => {
        const disp = computeDisplayPrices(rec);
        rows.push(`<tr>
            <td><span class="diff-badge ${badgeCls}">${badgeText}</span></td>
            <td class="prod-cell"><div class="prod-title"><strong>${esc(rec.brand)}</strong> ${esc(rec.model)}</div></td>
            <td>${rec.btu ? rec.btu.toLocaleString() : "—"}</td>
            <td class="num amount-cell">${fmtMoney(disp.displayPrice)}${oldOffer ? `<div class="old-note">was ${fmtMoney(computeDisplayPrices({ retailPrice: Number(oldOffer.retail_price) || null, actionPrice: Number(oldOffer.action_price) || null }).displayPrice)}</div>` : ""}</td>
            <td class="num">${disp.displayOldPrice ? fmtMoney(disp.displayOldPrice) : "—"}</td>
            <td class="num">${fmtMoney(rec.dealerPrice)}</td>
            <td>${rec.inStock ? "in stock" : "out of stock"}</td>
        </tr>`);
    };

    pendingImport.plan.newProducts.forEach(rec => pushRec("db-new", "new", rec));
    pendingImport.plan.newOffers.forEach(rec => pushRec("db-offer", "new offer", rec));
    pendingImport.plan.updates.forEach(u => pushRec("db-price", "update", u.rec, u.old));
    pendingImport.plan.missing.forEach(o => {
        rows.push(`<tr>
            <td><span class="diff-badge db-missing">hide</span></td>
            <td class="prod-cell"><div class="prod-title">${o.supplier_item_code}</div></td>
            <td colspan="4" class="muted-cell">not in today's file — will be marked out of stock</td>
            <td>hidden</td>
        </tr>`);
    });
    pendingImport.plan.review.forEach(r => {
        rows.push(`<tr>
            <td><span class="diff-badge db-review">review</span></td>
            <td class="prod-cell"><div class="prod-title"><strong>${esc(r.rec.brand || "?")}</strong> ${esc(r.rec.model || r.rec.supplierItemCode)}</div></td>
            <td colspan="4" class="muted-cell">skipped — ${r.reason}</td>
            <td>—</td>
        </tr>`);
    });

    document.getElementById("diff-body").innerHTML = rows.join("");
    document.getElementById("import-apply").disabled =
        plan.newProducts.length + plan.newOffers.length + plan.updates.length + plan.missing.length === 0;
}

// ---------------------------------------------------------------------------
// 3. Apply (the only place that writes to the database)
// ---------------------------------------------------------------------------
async function applyImport() {
    if (!pendingImport) return;
    const { profile, fileName, plan, supplier, records } = pendingImport;

    document.getElementById("import-preview").classList.add("hidden");
    document.getElementById("import-progress").classList.remove("hidden");

    try {
        const nowIso = new Date().toISOString();

        // -- 1. new products ------------------------------------------------
        setProgress("Creating " + plan.newProducts.length + " new products…");
        const prodByKey = {};
        if (plan.newProducts.length) {
            const rows = plan.newProducts.map(rec => ({
                brand: rec.brand,
                model: rec.model,
                category: rec.category,
                subtype: rec.subtype,
                btu: rec.btu,
                area_sqm: rec.areaSqm,
                description_ka: rec.descriptionKa || null,
                reference_url: rec.referenceUrl,
                is_published: false,          // published in the display-price step
                needs_review: !rec.btu
            }));
            const { data, error } = await sbClient.from("products")
                .upsert(rows, { onConflict: "brand,model" }).select("*");
            if (error) throw new Error("creating products: " + error.message);
            data.forEach(p => { prodByKey[p.brand + "|" + p.model] = p; });
        }

        // existing products too (for offer→product linking)
        const { data: allProducts, error: apErr } = await sbClient.from("products").select("*");
        if (apErr) throw new Error(apErr.message);
        allProducts.forEach(p => { prodByKey[p.brand + "|" + p.model] = p; });

        // -- 2. upsert offers ----------------------------------------------
        const sellable = records.filter(rec => {
            if (!rec.brand || !rec.model) return false;
            return !!computeDisplayPrices(rec).displayPrice;
        });
        setProgress("Saving " + sellable.length + " supplier offers…");
        const offerRows = sellable.map(rec => ({
            supplier_id: supplier.id,
            product_id: prodByKey[rec.brand + "|" + rec.model].id,
            supplier_item_code: rec.supplierItemCode,
            retail_price: rec.retailPrice,
            action_price: rec.actionPrice,
            dealer_price: rec.dealerPrice,
            dealer_promo_price: rec.dealerPromoPrice,
            stock_hint: rec.stockHint || null,
            in_stock: rec.inStock,
            source_row: rec.sourceRow || null,
            last_seen_at: nowIso
        }));
        for (let i = 0; i < offerRows.length; i += 100) {
            const { error } = await sbClient.from("supplier_offers")
                .upsert(offerRows.slice(i, i + 100), { onConflict: "supplier_id,supplier_item_code" });
            if (error) throw new Error("saving offers: " + error.message);
        }

        // -- 3. hide offers missing from today's file -----------------------
        if (plan.missing.length) {
            setProgress("Hiding " + plan.missing.length + " products missing from the file…");
            const { error } = await sbClient.from("supplier_offers")
                .update({ in_stock: false })
                .in("id", plan.missing.map(o => o.id));
            if (error) throw new Error("hiding missing offers: " + error.message);
        }

        // -- 4. recompute display prices across ALL suppliers ---------------
        setProgress("Recomputing shop prices…");
        const recByKey = {};
        records.forEach(rec => { if (rec.brand && rec.model) recByKey[rec.brand + "|" + rec.model] = rec; });

        const { data: freshProducts, error: fpErr } = await sbClient.from("products").select("*");
        if (fpErr) throw new Error(fpErr.message);
        const { data: freshOffers, error: foErr } = await sbClient.from("supplier_offers").select("*");
        if (foErr) throw new Error(foErr.message);

        const offersByProduct = {};
        freshOffers.forEach(o => {
            (offersByProduct[o.product_id] = offersByProduct[o.product_id] || []).push(o);
        });

        const productUpserts = [];
        for (const prod of freshProducts) {
            const candidates = (offersByProduct[prod.id] || []).filter(o => o.in_stock);
            let best = null;
            for (const o of candidates) {
                const d = computeDisplayPrices({
                    retailPrice: o.retail_price != null ? Number(o.retail_price) : null,
                    actionPrice: o.action_price != null ? Number(o.action_price) : null
                });
                if (d.displayPrice && (!best || d.displayPrice < best.displayPrice)) best = d;
            }

            const next = { ...prod };
            next.display_price = best ? best.displayPrice : null;
            next.display_old_price = best && best.displayOldPrice ? best.displayOldPrice : null;
            next.is_published = !!best;

            // fill missing spec fields from today's parsed data
            const rec = recByKey[prod.brand + "|" + prod.model];
            if (rec) {
                if (!next.btu && rec.btu) next.btu = rec.btu;
                if (!next.area_sqm && rec.areaSqm) next.area_sqm = rec.areaSqm;
                if (!next.subtype && rec.subtype) next.subtype = rec.subtype;
                if (!next.description_ka && rec.descriptionKa) next.description_ka = rec.descriptionKa;
                if (!next.reference_url && rec.referenceUrl) next.reference_url = rec.referenceUrl;
                next.needs_review = !next.btu && next.category === "ac";
            }

            const changed =
                Number(prod.display_price || 0) !== Number(next.display_price || 0) ||
                Number(prod.display_old_price || 0) !== Number(next.display_old_price || 0) ||
                prod.is_published !== next.is_published ||
                prod.btu !== next.btu || prod.area_sqm !== next.area_sqm ||
                prod.subtype !== next.subtype || prod.needs_review !== next.needs_review ||
                prod.description_ka !== next.description_ka || prod.reference_url !== next.reference_url;
            if (changed) productUpserts.push(next);
        }

        for (let i = 0; i < productUpserts.length; i += 100) {
            const { error } = await sbClient.from("products").upsert(productUpserts.slice(i, i + 100));
            if (error) throw new Error("updating shop prices: " + error.message);
        }

        // -- 5. record the batch --------------------------------------------
        const { data: { user } } = await sbClient.auth.getUser();
        const stats = {
            new_products: plan.newProducts.length,
            new_offers: plan.newOffers.length,
            updates: plan.updates.length,
            hidden: plan.missing.length,
            review_skipped: plan.review.length,
            unchanged: plan.unchanged.length
        };
        await sbClient.from("import_batches").insert({
            supplier_id: supplier.id,
            file_name: fileName,
            imported_by: user ? user.email : null,
            stats
        });

        // -- done -----------------------------------------------------------
        document.getElementById("import-progress").classList.add("hidden");
        document.getElementById("import-done").classList.remove("hidden");
        const published = freshProducts.length ? productUpserts.filter(p => p.is_published).length : 0;
        document.getElementById("done-text").innerText =
            `${profile.name}: ${stats.new_products} new products, ${stats.new_offers} new offers, ` +
            `${stats.updates} updated, ${stats.hidden} hidden, ${stats.review_skipped} skipped for review. ` +
            `The shop is now selling the updated catalog — open the storefront to see it.`;
        pendingImport = null;
    } catch (err) {
        document.getElementById("import-progress").classList.add("hidden");
        document.getElementById("import-preview").classList.remove("hidden");
        importError("Import failed at one of the steps: " + err.message +
            " — it is safe to drop the same file and approve again; re-running an import never duplicates data.");
    }
}

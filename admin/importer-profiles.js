// ============================================================================
// Supplier import profiles
// One profile per supplier price list. The admin importer reads the uploaded
// Excel with SheetJS, auto-detects the supplier via detect(), then uses the
// profile to turn each row into a normalized record:
//
//   {
//     supplierItemCode, brand, model, category, subtype, btu, areaSqm,
//     retailPrice, actionPrice, dealerPrice, dealerPromoPrice,
//     stockHint, inStock, descriptionKa, referenceUrl, sourceRow
//   }
//
// Profiles are data + tiny functions, so adding supplier #3 later means
// adding one more entry here — no importer code changes.
// ============================================================================

// ---- shared helpers --------------------------------------------------------

// '#N/A', '', null, 0-as-"no sale" → null; otherwise a number
function cleanPrice(v, { zeroMeansNull = false } = {}) {
    if (v === null || v === undefined) return null;
    if (typeof v === "string") {
        const s = v.trim();
        if (!s || s === "#N/A" || s.toUpperCase() === "N/A") return null;
        const n = Number(s.replace(/[^\d.,-]/g, "").replace(",", "."));
        return Number.isFinite(n) ? n : null;
    }
    if (typeof v !== "number" || !Number.isFinite(v)) return null;
    if (v === 0 && zeroMeansNull) return null;
    return v;
}

function cleanText(v) {
    return v === null || v === undefined ? "" : String(v).trim();
}

// '9000 BTU' / '...12000BTU...' → 9000 / 12000
function extractBtu(text) {
    const m = /([\d][\d.,]*)\s*BTU/i.exec(String(text || ""));
    if (!m) return null;
    const n = parseInt(m[1].replace(/[.,]/g, ""), 10);
    return Number.isFinite(n) && n >= 5000 && n <= 100000 ? n : null;
}

// '28KW' / '28 კვ' → 28 (central boiler power; stored in the btu column)
function extractKw(text) {
    const m = /(\d{1,3})\s*(?:KW|კვ)/i.exec(String(text || ""));
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return Number.isFinite(n) && n >= 5 && n <= 200 ? n : null;
}

// '25-30 კვ/მ' or '35-40m²' → '25-30'
function extractAreaSqm(text) {
    const m = /(\d+\s*-\s*\d+)\s*(?:კვ\/?მ|m²|m2)/i.exec(String(text || ""));
    return m ? m[1].replace(/\s/g, "") : null;
}

// ---- profiles --------------------------------------------------------------

const SUPPLIER_PROFILES = {

    // ------------------------------------------------------------------------
    // Elit Electronics — single sheet ('ელიტი'), English headers, whole store
    // inventory (1200+ rows, ~35 categories). We import only climate categories.
    // Stock: 'Tbilisi WH' is '>5' / '<5' / blank (blank → treat as out of stock).
    // ------------------------------------------------------------------------
    elit: {
        slug: "elit",
        name: "Elit Electronics",
        headerRow: 0, // 0-based; headers are on the first row

        detect(sheetNames, headerCells) {
            return sheetNames.includes("ელიტი")
                || headerCells.includes("Manufacturer Code");
        },

        pickSheet(sheetNames) {
            return sheetNames.includes("ელიტი") ? "ელიტი" : sheetNames[0];
        },

        // Item Category Code → site category (rows with other codes are skipped)
        // Shop scope decided 2026-07-22: ACs and central heating boilers ONLY —
        // gas/electric heaters, water heaters and air treatment are not sold.
        categoryMap: {
            "AC":         "ac",
            "CEN.BOILER": "boiler",
        },

        parseRow(row) {
            // row is an object keyed by header text (SheetJS sheet_to_json)
            const category = this.categoryMap[cleanText(row["Item Category Code"])];
            if (!category) return null; // not a climate product — skip

            const group = cleanText(row["Product Group Code"]).toUpperCase();
            const subtype =
                group === "AC INV"    ? "inverter" :
                group === "AC ON/OFF" ? "on_off"   : null;

            const stockHint = cleanText(row["Tbilisi WH"]);

            return {
                supplierItemCode: cleanText(row["No "] ?? row["No"]),
                brand:  cleanText(row["Manufacturer Code"]).toUpperCase(),
                model:  cleanText(row["Description"]).toUpperCase(),
                category,
                subtype,
                // ACs carry BTU in 'Product Group Code 2'; boilers carry kW in
                // 'Product Group Code' (e.g. '28KW') or the Georgian description
                btu: category === "boiler"
                    ? (extractKw(row["Product Group Code"]) || extractKw(row["Full Description"]))
                    : extractBtu(row["Product Group Code 2"]),
                areaSqm: null,
                retailPrice:      cleanPrice(row["Retail Unit Price"]),
                actionPrice:      cleanPrice(row["Action Unit Price"], { zeroMeansNull: true }),
                dealerPrice:      cleanPrice(row["Dealer Unit Price"]),
                dealerPromoPrice: cleanPrice(row["Dealer Unit promo Price"], { zeroMeansNull: true }),
                stockHint,
                inStock: stockHint === ">5" || stockHint === "<5",
                descriptionKa: cleanText(row["Full Description"]),
                referenceUrl: cleanText(row["EE LINK"]) || null,
                sourceRow: row,
            };
        },
    },

    // ------------------------------------------------------------------------
    // Kontakt — multi-sheet workbook, Georgian headers. Climate products live
    // on the 'გათბობა-გაგრილება' (heating-cooling) sheet. BTU/area are inside
    // the free-text 'აღწერა' description. Known dirt: '#N/A' strings in price
    // and quantity cells, SALE=0 meaning "no sale", category typos
    // ('კოდიციონერი inventer').
    // ------------------------------------------------------------------------
    kontakt: {
        slug: "kontakt",
        name: "Kontakt",
        headerRow: 0,

        detect(sheetNames) {
            return sheetNames.includes("გათბობა-გაგრილება");
        },

        pickSheet(sheetNames) {
            return "გათბობა-გაგრილება";
        },

        parseRow(row) {
            const rawCat = cleanText(row["კატეგორია"]).toLowerCase();
            if (!rawCat) return null; // blank spacer row

            // typo-tolerant: 'კონდიციონერი'/'კოდიციონერი' + 'inverter'/'inventer'
            const isAc = rawCat.includes("კონდიციონერ") || rawCat.includes("კოდიციონერ");
            if (!isAc) return null; // this sheet may later carry heaters etc. — extend then

            const subtype =
                /invert|invent/.test(rawCat) ? "inverter" :
                /on\s*\/?\s*off/.test(rawCat) ? "on_off" : null;

            const desc = cleanText(row["აღწერა"]);
            const qty = cleanText(row["Q-ty"]);
            const qtyNum = parseInt(qty, 10);

            return {
                supplierItemCode: cleanText(row["TM COde"] ?? row["TM Code"]),
                brand:  cleanText(row["ბრენდი"]).toUpperCase(),
                model:  cleanText(row["მოდელი"]).toUpperCase(),
                category: "ac",
                subtype,
                btu: extractBtu(desc),
                areaSqm: extractAreaSqm(desc),
                retailPrice:      cleanPrice(row["RRP"]),
                actionPrice:      cleanPrice(row["SALE"], { zeroMeansNull: true }),
                dealerPrice:      cleanPrice(row["RDP"]),
                dealerPromoPrice: cleanPrice(row["PROMO"], { zeroMeansNull: true }),
                stockHint: qty,
                inStock: qty === "10+" || (Number.isFinite(qtyNum) && qtyNum > 0),
                descriptionKa: desc,
                referenceUrl: null,
                sourceRow: row,
            };
        },
    },
};

// ---- pricing rule ----------------------------------------------------------
// Decided 2026-07-22: the site sells at the supplier's action/sale price and
// shows the retail price crossed out. No action price → sell at retail, no
// crossed-out price. (Rows with neither price are unsellable → review queue.)
function computeDisplayPrices(rec) {
    if (rec.actionPrice) {
        return { displayPrice: rec.actionPrice, displayOldPrice: rec.retailPrice || null };
    }
    return { displayPrice: rec.retailPrice || null, displayOldPrice: null };
}

// Auto-detect which supplier a workbook belongs to
function detectSupplier(sheetNames, headerCells) {
    for (const key of Object.keys(SUPPLIER_PROFILES)) {
        if (SUPPLIER_PROFILES[key].detect(sheetNames, headerCells || [])) {
            return SUPPLIER_PROFILES[key];
        }
    }
    return null;
}

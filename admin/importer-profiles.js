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

// '9000 BTU' / '...12000BTU...' / '9 000 BTU' (space-grouped thousands) → 9000
function extractBtu(text) {
    const m = /([\d][\d.,\s]*)\s*BTU/i.exec(String(text || ""));
    if (!m) return null;
    const n = parseInt(m[1].replace(/[.,\s]/g, ""), 10);
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

// A cell can carry a link two ways: a real OOXML hyperlink (cell.l.Target) or
// an =HYPERLINK("url","label") formula (cell.f). Try both.
function extractCellLink(cell) {
    if (!cell) return null;
    if (cell.l && cell.l.Target) return cell.l.Target;
    if (cell.f) {
        const m = /HYPERLINK\(\s*"([^"]+)"/i.exec(cell.f);
        if (m) return m[1];
    }
    return null;
}

// Reads the hyperlink (not just the display text) out of specific columns and
// stashes it on each row object as row["__link:<header name>"], so profiles
// whose "product page" link lives inside a text column (e.g. Kontakt's
// 'მოდელი') can still recover the real URL. Call before parseRow().
function attachColumnLinks(ws, rows, headerRowIdx, columnNames) {
    if (!columnNames || !columnNames.length) return;
    const range = XLSX.utils.decode_range(ws["!ref"]);
    const colIndexByName = {};
    for (let c = range.s.c; c <= range.e.c; c++) {
        const header = ws[XLSX.utils.encode_cell({ r: headerRowIdx, c })];
        const name = header ? String(header.v || "").trim() : "";
        if (columnNames.includes(name)) colIndexByName[name] = c;
    }
    rows.forEach((row, i) => {
        const r = headerRowIdx + 1 + i;
        for (const name of columnNames) {
            const c = colIndexByName[name];
            if (c === undefined) continue;
            row["__link:" + name] = extractCellLink(ws[XLSX.utils.encode_cell({ r, c })]);
        }
    });
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
        // The 'მოდელი' cell carries a hyperlink to the product's page on
        // kontakt.ge — importer.js reads it into row["__link:მოდელი"].
        linkColumns: ["მოდელი"],

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
                referenceUrl: row["__link:მოდელი"] || null,
                sourceRow: row,
            };
        },
    },

    // ------------------------------------------------------------------------
    // Chigo — single-brand price list, one sheet ('კონდიციონერი'). No brand
    // column (always CHIGO) and no separate model-vs-BTU columns: BTU/subtype
    // live in a column literally headed 'ON/OFF' that holds either a BTU value
    // (data row) or a bare section label ('ON/OFF' / 'INVERTER' / 'პორტატული'
    // / 'კოლონური' / 'ჭერი-იატაკი  INVERTER') that applies to the rows below
    // it until the next label. preprocess() walks the sheet once to stamp
    // each data row with its section before parseRow() runs on it.
    // ------------------------------------------------------------------------
    chigo: {
        slug: "chigo",
        name: "Chigo",
        headerRow: 0,

        detect(sheetNames, headerCells) {
            return sheetNames.includes("კონდიციონერი") && headerCells.includes("DRP");
        },

        pickSheet() {
            return "კონდიციონერი";
        },

        preprocess(rows) {
            let section = "ON/OFF"; // the sheet's first block has no label of its own
            rows.forEach(row => {
                const marker = cleanText(row["ON/OFF"]);
                const hasModel = !!cleanText(row["მოდელი"]);
                if (marker && !hasModel) {
                    section = marker;
                    row.__sectionHeader = true;
                } else {
                    row.__section = section;
                }
            });
            return rows;
        },

        parseRow(row) {
            if (row.__sectionHeader) return null; // section-label row, not a product
            const model = cleanText(row["მოდელი"]);
            if (!model) return null;

            const section = row.__section || "";
            const subtype = /invert/i.test(section) ? "inverter" : /on\s*\/?\s*off/i.test(section) ? "on_off" : null;
            const btuText = cleanText(row["ON/OFF"]);
            const qty = cleanText(row["რაოდენობა"]);
            const qtyNum = parseInt(qty, 10);

            return {
                supplierItemCode: model,
                brand: "CHIGO",
                model: model.toUpperCase(),
                category: "ac",
                subtype,
                btu: extractBtu(btuText),
                areaSqm: null,
                retailPrice:      cleanPrice(row["RRP"]),
                actionPrice:      cleanPrice(row[" საცალო სააქციო ფასი"], { zeroMeansNull: true }),
                dealerPrice:      cleanPrice(row["DRP"]),
                dealerPromoPrice: cleanPrice(row["სპეციალური სადილერო ფასი"], { zeroMeansNull: true }),
                stockHint: qty,
                inStock: qty === "10+" || (Number.isFinite(qtyNum) && qtyNum > 0),
                descriptionKa: [btuText, cleanText(row["ფრეონი"]), cleanText(row["კომპლექტაცია"])].filter(Boolean).join(", "),
                referenceUrl: null, // Chigo's own list has no product-page link — enrichment falls back to Kontakt search
                sourceRow: row,
            };
        },
    },

    // ------------------------------------------------------------------------
    // Alneo.ge — sells its own house brand ('ALNEO') and distributes 'Konka'.
    // Real headers sit on row 2 (row 1 is a banner/contact line), so
    // headerRow: 1. There is no separate brand/model column: both are buried
    // in one free-text description ('MODEL'); a bare internal 'კოდი' is the
    // only clean identifier, so it's used as supplierItemCode and as the
    // model fallback when the description can't be parsed into one.
    // ------------------------------------------------------------------------
    alneo: {
        slug: "alneo",
        name: "Alneo.ge",
        headerRow: 1,

        detect(sheetNames) {
            return sheetNames.some(n => n.includes("ALNEOKONKA"));
        },

        pickSheet(sheetNames) {
            return sheetNames.find(n => n.includes("ALNEOKONKA")) || sheetNames[0];
        },

        // 'Konka Kac 9000W Inventor...' → 'KAC 9000W' / 'ALNEO 09CHSA/XAC1(...)' → '09CHSA/XAC1'
        extractModel(desc) {
            let m = /konka\s+([a-z0-9]+\s+\d+w)/i.exec(desc);
            if (m) return m[1].toUpperCase().replace(/\s+/g, " ").trim();
            m = /alneo\s+([a-z0-9/]+)/i.exec(desc);
            if (m) return m[1].toUpperCase();
            return null;
        },

        extractBtu(desc, modelPart) {
            let m = /(\d{4,5})\s*W\b/i.exec(desc);
            if (m) return parseInt(m[1], 10);
            m = modelPart && /^(\d{2})/.exec(modelPart);
            return m ? parseInt(m[1], 10) * 1000 : null;
        },

        parseRow(row) {
            const desc = cleanText(row["MODEL"]);
            const code = cleanText(row["კოდი"]);
            if (!desc || !code) return null;

            const brand = /konka/i.test(desc) ? "KONKA" : "ALNEO";
            const modelPart = this.extractModel(desc);
            const model = modelPart || code;
            const subtype = /invent|inverter/i.test(desc) ? "inverter" : "on_off";
            const areaMatch = /(\d+\s*-\s*\d+)\s*კვადრატი/i.exec(desc);
            const qty = cleanText(row["IN STOCK"]);
            const qtyNum = parseInt(qty, 10);

            return {
                supplierItemCode: code,
                brand,
                model: model.toUpperCase(),
                category: "ac",
                subtype,
                btu: this.extractBtu(desc, modelPart),
                areaSqm: areaMatch ? areaMatch[1].replace(/\s/g, "") : null,
                retailPrice:      cleanPrice(row["RRP"]),
                actionPrice:      cleanPrice(row["სააქციო RRP"], { zeroMeansNull: true }),
                dealerPrice:      cleanPrice(row[" DRP"]),
                dealerPromoPrice: cleanPrice(row["სააქციო DRP"], { zeroMeansNull: true }),
                stockHint: qty,
                inStock: qty === "10+" || (Number.isFinite(qtyNum) && qtyNum > 0),
                descriptionKa: desc,
                referenceUrl: null, // no product-page link in this file — enrichment falls back to Kontakt search
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

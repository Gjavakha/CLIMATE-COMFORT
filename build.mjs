#!/usr/bin/env node
// ============================================================================
// Climate Comfort — site build (Node 18+, no dependencies)
//
//   node build.mjs          → ./dist, ready for Cloudflare Pages
//
// What it does, in order:
//   1. copies the browser files (never the Edge Function sources, the schema,
//      the README, supplier spreadsheets or local tooling) into ./dist;
//   2. fetches the published catalog from Supabase with the public anon key
//      (the same read the storefront does — RLS only exposes published rows);
//   3. embeds that catalog into index.html as JSON, so the first paint and a
//      search engine's crawl show real products instead of the demo set;
//   4. pre-renders one HTML page per product (/product/<slug>) with its own
//      <title>, description, Open Graph tags, Product + Breadcrumb schema and
//      the product content already in the HTML — app.js takes over on load;
//   5. pre-renders /catalog/<category>, /brand/<brand>, /guide/<slug> and the
//      legal pages with their own <head>, plus 404.html;
//   6. writes sitemap.xml and copies the Cloudflare _redirects / _headers files.
//
// If the catalog cannot be fetched the build FAILS on purpose: Cloudflare then
// keeps the previous deployment live instead of publishing a site without
// product pages. Set ALLOW_EMPTY_CATALOG=1 to build without it (local dev).
//
// Markup produced here mirrors what app.js renders for the same route
// (renderProductDetailPage, renderGuidePage, renderGuidesSection, railCard,
// generatedDescription) so the hand-over from HTML to app is invisible.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const SITE = "https://climate-comfort.ge";
const SITE_NAME = "Climate Comfort";
const GUIDES = createRequire(import.meta.url)("./guides.js");

// ---------------------------------------------------------------------------
// 1. Static files
// ---------------------------------------------------------------------------
rmSync(DIST, { recursive: true, force: true });
for (const d of ["admin", "assets", "product", "catalog", "brand", "guide"]) mkdirSync(join(DIST, d), { recursive: true });

for (const f of ["app.js", "guides.js", "analytics.js", "styles.css", "supabase-config.js", "robots.txt", "llms.txt", "_headers", "_redirects"]) {
    cpSync(join(ROOT, f), join(DIST, f));
}
for (const f of ["index.html", "admin.css", "admin.js", "importer.js", "importer-profiles.js"]) {
    cpSync(join(ROOT, "admin", f), join(DIST, "admin", f));
}
cpSync(join(ROOT, "assets"), join(DIST, "assets"), { recursive: true });

// ---------------------------------------------------------------------------
// 2. Catalog
// ---------------------------------------------------------------------------
const cfg = readFileSync(join(ROOT, "supabase-config.js"), "utf8");
const SUPABASE_URL = (cfg.match(/SUPABASE_URL\s*=\s*"([^"]+)"/) || [])[1];
const SUPABASE_ANON_KEY = (cfg.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/) || [])[1];
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("supabase-config.js: SUPABASE_URL / SUPABASE_ANON_KEY not found");

async function fetchCatalog() {
    const url = `${SUPABASE_URL}/rest/v1/products?is_published=eq.true&order=created_at.desc&select=*`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
    if (!res.ok) throw new Error(`catalog fetch failed: HTTP ${res.status} ${await res.text()}`);
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error("catalog fetch: unexpected response");
    return rows;
}

let rows = [];
try {
    rows = await fetchCatalog();
} catch (err) {
    if (!process.env.ALLOW_EMPTY_CATALOG) throw err;
    console.warn(`WARNING: ${err.message} — building without a catalog (ALLOW_EMPTY_CATALOG is set)`);
}

// Same rules as productSlug() / brandSlug() in app.js — keep them in step.
const slugOf = (r) => `${r.brand || ""}-${r.model || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || String(r.id);
const brandSlug = (b) => String(b || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const titleOf = (r) => r.title_ka || `${r.brand} ${r.model}`;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => Number(n).toLocaleString("en-US");
const imagesOf = (r) => Array.isArray(r.images) && r.images.length ? r.images : (r.image_url ? [r.image_url] : []);
const capOf = (r) => r.btu ? `${r.btu}${r.category === "boiler" ? " kW" : " BTU"}` : "";
// JSON inside <script>: "</script" and "<!--" must not appear literally, and
// U+2028/2029 are line terminators for old JS parsers. All three become escapes.
const BACKSLASH = String.fromCharCode(92);
const jsonForScript = (v) => JSON.stringify(v)
    .split("<").join(BACKSLASH + "u003c")
    .split(String.fromCharCode(0x2028)).join(BACKSLASH + "u2028")
    .split(String.fromCharCode(0x2029)).join(BACKSLASH + "u2029");

// Columns the catalog grid needs (specs, galleries and descriptions stay on
// the individual product pages — 149 products with specs would be 600 KB).
const slim = rows.map(({ specs, images, description_ka, description_en, reference_url, ...r }) => r);

const CATEGORY = {
    ac: { ka: "კონდიციონერი", plural: "კონდიციონერები", path: "/catalog/ac" },
    boiler: { ka: "გათბობის ქვაბი", plural: "გათბობის ქვაბები", path: "/catalog/boiler" }
};
const catOf = (r) => CATEGORY[r.category] || CATEGORY.ac;

// ---------------------------------------------------------------------------
// 3. index.html template helpers
// ---------------------------------------------------------------------------
const template = readFileSync(join(ROOT, "index.html"), "utf8");
for (const marker of ['<script src="/app.js"></script>', 'id="product-detail-content"></div>', 'id="legal-content"></div>', 'id="guides-grid"></div>']) {
    if (!template.includes(marker)) throw new Error(`index.html: marker not found: ${marker}`);
}

function setHead(html, { title, description, path, ogType = "website", image = null, ldJson = null, bodyClass = null, keepFaq = false, noindex = false }) {
    const url = SITE + path;
    // The FAQ section is part of the home layout; pages that hide it (product,
    // legal) must not carry its FAQPage schema — Google treats markup for
    // content the visitor cannot see as spam.
    if (!keepFaq) html = html.replace(/\s*<!-- FAQ rich result[\s\S]*?<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, "");
    html = html.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    // The <head> carries this page's wording: stop applyLanguage() from
    // overwriting it with the generic home text on load.
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}">`);
    html = html.replace(/<link rel="canonical" href="[^"]*">/, noindex ? "" : `<link rel="canonical" href="${esc(url)}">`);
    if (noindex) html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
    const og = {
        "og:type": ogType, "og:url": url, "og:title": title, "og:description": description,
        ...(image ? { "og:image": image } : {})
    };
    for (const [prop, val] of Object.entries(og)) {
        html = html.replace(new RegExp(`<meta property="${prop}" content="[^"]*">`), `<meta property="${prop}" content="${esc(val)}">`);
    }
    if (image) {
        // Dimensions belong to the site's own share image, not to supplier photos
        html = html.replace(/\s*<meta property="og:image:(width|height|alt)" content="[^"]*">/g, "");
        html = html.replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${esc(image)}">`);
    }
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(description)}">`);
    if (ldJson) html = html.replace("</head>", `    <script type="application/ld+json">${jsonForScript(ldJson)}</script>\n</head>`);
    if (bodyClass) html = html.replace("<body>", `<body class="${bodyClass}">`);
    return html;
}

function embed(html, id, value) {
    return html.replace('<script src="/app.js"></script>', `<script id="${id}" type="application/json">${jsonForScript(value)}</script>\n    <script src="/app.js"></script>`);
}

const breadcrumb = (parts) => `
        <nav class="breadcrumb" aria-label="breadcrumb">
            ${parts.map((p, i) => (i < parts.length - 1 ? `<a href="${esc(p.href)}">${esc(p.name)}</a><span class="bc-sep">›</span>` : `<span>${esc(p.name)}</span>`)).join("\n            ")}
        </nav>`;

// Same markup as railCard() in app.js
function railCard(r) {
    const title = titleOf(r);
    const img = imagesOf(r)[0];
    const onSale = r.display_old_price && Number(r.display_old_price) > Number(r.display_price);
    const visual = img
        ? `<img class="product-photo" src="${esc(img)}" alt="${esc(title)}" loading="lazy" decoding="async">`
        : `<div class="photo-placeholder"><i class="fa-regular fa-image"></i><span>ფოტო მალე დაემატება</span></div>`;
    return `
        <a class="rail-card" href="/product/${slugOf(r)}">
            <div class="rail-card-img">
                ${visual}
                ${onSale ? `<span class="rail-sale">-${Math.round((1 - r.display_price / r.display_old_price) * 100)}%</span>` : ""}
            </div>
            <span class="product-brand">${esc(r.brand)}</span>
            <p class="rail-card-title">${esc(title)}</p>
            <div class="rail-card-price">
                ${onSale ? `<span class="rail-old-price">${money(r.display_old_price)} ₾</span>` : ""}
                <strong>${money(r.display_price || 0)} ₾</strong>
            </div>
        </a>`;
}

// Same markup as renderGuidesSection() in app.js
const guideCards = Object.entries(GUIDES).map(([slug, g]) => `
        <a class="guide-card" href="/guide/${slug}">
            <h3>${esc(g.title)}</h3>
            <p>${esc(g.description)}</p>
            <span class="guide-more">წაკითხვა <i class="fa-solid fa-arrow-right"></i></span>
        </a>`).join("");

// Home layout with the live catalog and the guide cards in place
const withCatalog = embed(template, "catalog-data", slim).replace('id="guides-grid"></div>', `id="guides-grid">${guideCards}</div>`);

// ---------------------------------------------------------------------------
// 4. Home
// ---------------------------------------------------------------------------
// The source file carries the English <title> (app.js swaps it per language);
// the served home page must open with the Georgian one crawlers index.
writeFileSync(join(DIST, "index.html"), setHead(withCatalog, {
    title: "Climate Comfort | პრემიუმ გათბობა & კონდიცირება",
    description: "კონდიციონერები და ცენტრალური გათბობის ქვაბები საქართველოში — Samsung, LG, Midea, Bosch, Gree და სხვა. ოფიციალური გარანტია, პროფესიონალური მონტაჟი, 0%-იანი განვადება და უფასო მიწოდება თბილისში.",
    path: "/",
    keepFaq: true
}).replace(/<meta name="description" content=/, '<meta name="description" data-i18n-meta="meta-description" content='));

// ---------------------------------------------------------------------------
// 5. Product pages — /product/<slug>  (served from product/<slug>.html)
// ---------------------------------------------------------------------------
function productTitle(r) {
    const cap = r.btu ? ` ${capOf(r)}` : "";
    return `${titleOf(r)} — ${catOf(r).ka}${cap} | ${SITE_NAME}`;
}

function productDescription(r) {
    const own = (r.description_ka || "").replace(/\s+/g, " ").trim();
    if (own.length > 60) return own.length > 160 ? own.slice(0, 157).trimEnd() + "…" : own;
    const area = r.area_sqm ? `, ${r.area_sqm} მ²` : "";
    const price = r.display_price ? `, ფასი ${money(r.display_price)} ₾` : "";
    return `${titleOf(r)}${area}${price}. ოფიციალური გარანტია, მონტაჟი, 0%-იანი განვადება და უფასო მიწოდება თბილისში.`;
}

// Same paragraph as generatedDescription() in app.js (Georgian)
function generatedDescription(r) {
    const items = (Array.isArray(r.specs) ? r.specs : []).flatMap(g => g.items || []);
    const find = (re) => { const it = items.find(i => re.test(i.name)); return it ? String(it.value).trim() : null; };
    const refrigerant = find(/ფრეონ|refrigerant/i);
    const energy = find(/ენერგო.*კლას|energy class/i);
    const noise = find(/ხმაურ|noise/i);
    const boiler = r.category === "boiler";
    const inverter = r.subtype === "inverter";
    const kind = boiler ? (inverter ? "კონდენსაციური გაზის ქვაბი" : "გაზის ქვაბი") : (inverter ? "ინვერტორული კონდიციონერი" : "ON/OFF კონდიციონერი");
    const cap = r.btu ? ` ${capOf(r)} სიმძლავრით` : "";
    const area = r.area_sqm ? `, რეკომენდებული ${r.area_sqm} მ² ფართობისთვის` : "";
    const extra = [refrigerant ? `ფრეონი ${refrigerant}` : null, energy ? `ენერგოკლასი ${energy}` : null, noise ? `ხმაური ${noise}` : null].filter(Boolean).join(", ");
    return `${titleOf(r)} — ${r.brand}-ის ${kind}${cap}${area}.${extra ? ` ${extra}.` : ""} მოყვება მწარმოებლის ოფიციალური გარანტია; მონტაჟს ჩვენი სერტიფიცირებული ტექნიკოსები ასრულებენ (${boiler ? "ფასი შეთანხმებით" : "150 ₾-დან"}, სამუშაოზე 12-თვიანი გარანტია). თბილისში მიწოდება უფასოა, შესაძლებელია 0%-იანი განვადება 6 თვემდე.`;
}

// Same selection as relatedProducts() in app.js
function relatedProducts(r, limit = 6) {
    const same = rows.filter(o => o.id !== r.id && o.category === r.category);
    return [...same.filter(o => o.brand === r.brand), ...same.filter(o => o.brand !== r.brand)].slice(0, limit);
}

function productLd(r, url) {
    const images = imagesOf(r);
    const cat = catOf(r);
    return [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${url}#product`,
            "name": titleOf(r),
            "sku": r.model,
            "brand": { "@type": "Brand", "name": r.brand },
            "category": cat.plural,
            ...(images.length ? { "image": images } : {}),
            "description": productDescription(r),
            "url": url,
            "offers": {
                "@type": "Offer",
                "url": url,
                "price": String(Number(r.display_price || 0).toFixed(2)),
                "priceCurrency": "GEL",
                "availability": r.stock_status === "low" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": { "@id": `${SITE}/#organization` }
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "მთავარი", "item": `${SITE}/` },
                { "@type": "ListItem", "position": 2, "name": cat.plural, "item": SITE + cat.path },
                { "@type": "ListItem", "position": 3, "name": r.brand, "item": `${SITE}/brand/${brandSlug(r.brand)}` },
                { "@type": "ListItem", "position": 4, "name": titleOf(r), "item": url }
            ]
        }
    ];
}

// The same markup renderProductDetailPage() in app.js produces (Georgian),
// so the page looks finished before app.js runs and the swap is invisible.
function productBody(r) {
    const title = titleOf(r);
    const images = imagesOf(r);
    const cat = catOf(r);
    const visual = images.length
        ? `<img class="product-photo" src="${esc(images[0])}" alt="${esc(title)}" fetchpriority="high">`
        : `<div class="photo-placeholder"><i class="fa-regular fa-image"></i><span>ფოტო მალე დაემატება</span></div>`;
    const gallery = images.length > 1 ? `
                <div class="detail-gallery">
                    <div class="detail-gallery-thumbs">
                        ${images.map((img, i) => `<button class="gallery-thumb ${i === 0 ? "active" : ""}" data-img="${esc(img)}" aria-label="${esc(title)} ${i + 1}"><img src="${esc(img)}" alt="${esc(title)} — ${i + 1}" loading="lazy" width="80" height="80"></button>`).join("")}
                    </div>
                    <div class="detail-gallery-main"><img id="detail-main-image" src="${esc(images[0])}" alt="${esc(title)}" fetchpriority="high"></div>
                </div>` : visual;
    const old = r.display_old_price && Number(r.display_old_price) > Number(r.display_price)
        ? `<span class="old-price">${money(r.display_old_price)} ₾</span>` : "";
    const badges = [
        r.subtype === "inverter" ? `<span class="badge badge-inverter">${r.category === "boiler" ? "კონდენსაციური" : "ინვერტორი"}</span>` : "",
        r.stock_status === "low" ? `<span class="badge badge-stock-low">ბოლო ერთეულები</span>` : (r.stock_status === "in" ? `<span class="badge badge-stock-in">მარაგშია</span>` : "")
    ].join("");
    const specs = Array.isArray(r.specs) && r.specs.length
        ? r.specs.map(g => `${r.specs.length > 1 ? `<tr class="spec-group-row"><td colspan="2">${esc(g.group)}</td></tr>` : ""}${(g.items || []).map(it => `<tr><td>${esc(it.name)}</td><td>${esc(it.value)}</td></tr>`).join("")}`).join("")
        : [
            `<tr><td>ბრენდი</td><td>${esc(r.brand)}</td></tr>`,
            r.btu ? `<tr><td>${r.category === "boiler" ? "სიმძლავრე" : "BTU"}</td><td>${esc(capOf(r))}</td></tr>` : "",
            r.area_sqm ? `<tr><td>რეკომენდებული ფართობი</td><td>${esc(r.area_sqm)} მ²</td></tr>` : "",
            `<tr><td>ტექნოლოგია</td><td>${r.subtype === "inverter" ? (r.category === "boiler" ? "კონდენსაციური" : "ინვერტორი") : (r.category === "boiler" ? "სტანდარტული" : "ON/OFF")}</td></tr>`
        ].join("");
    const own = (r.description_ka || "").trim();
    const related = relatedProducts(r);

    return `${breadcrumb([
            { name: "მთავარი", href: "/" },
            { name: cat.plural, href: cat.path },
            { name: r.brand, href: `/brand/${brandSlug(r.brand)}` },
            { name: title }
        ])}
        <a href="/#catalog" class="back-link"><i class="fa-solid fa-arrow-left"></i> კატალოგში დაბრუნება</a>
        <div class="detail-layout">
            <div class="detail-visual ${images.length > 1 ? "has-gallery" : ""}">
                <div class="card-badges">${badges}</div>
                ${gallery}
            </div>
            <div class="detail-info">
                <span class="product-brand">${esc(r.brand)}</span>
                <h1 class="detail-title">${esc(title)}</h1>
                ${own ? `<p class="detail-description">${esc(own)}</p>` : ""}
                ${own.length < 200 ? `<p class="detail-description detail-summary">${esc(generatedDescription(r))}</p>` : ""}
                <div class="detail-price-row">
                    <div class="price-tag">${old}${money(r.display_price || 0)}</div>
                </div>
            </div>
        </div>
        <div class="detail-sections">
            <div class="detail-panel">
                <h3>მახასიათებლები</h3>
                <table class="spec-table">${specs}</table>
            </div>
        </div>
        ${related.length ? `
        <div class="rail detail-related">
            <div class="rail-head"><h2 class="rail-title"><i class="fa-solid fa-layer-group rail-ico"></i> <span>მსგავსი პროდუქტები</span></h2></div>
            <div class="rail-track">${related.map(railCard).join("")}</div>
        </div>` : ""}
    `;
}

const sitemapUrls = [];
const today = new Date().toISOString().slice(0, 10);
const add = (path, changefreq, priority, lastmod = today) => sitemapUrls.push({ loc: SITE + path, lastmod, changefreq, priority });

add("/", "daily", "1.0");

for (const r of rows) {
    const slug = slugOf(r);
    const path = `/product/${slug}`;
    const url = SITE + path;
    let html = setHead(withCatalog, {
        title: productTitle(r),
        description: productDescription(r),
        path,
        ogType: "product",
        image: imagesOf(r)[0] || null,
        ldJson: productLd(r, url),
        bodyClass: "product-view"
    });
    html = html.replace('id="product-detail-content"></div>', `id="product-detail-content">${productBody(r)}</div>`);
    html = embed(html, "product-data", r);
    writeFileSync(join(DIST, "product", `${slug}.html`), html);
    add(path, "weekly", "0.8", (r.updated_at || r.created_at || today).slice(0, 10));
}

// ---------------------------------------------------------------------------
// 6. Category, brand, guide, legal and 404 pages
// ---------------------------------------------------------------------------
const itemList = (name, list) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "itemListElement": list.slice(0, 50).map((r, i) => ({ "@type": "ListItem", "position": i + 1, "url": `${SITE}/product/${slugOf(r)}` }))
});

const CATEGORY_PAGES = {
    ac: {
        title: "კონდიციონერები — ფასები, მონტაჟი, განვადება | Climate Comfort",
        description: "ინვერტორული და ON/OFF კონდიციონერები 9000-დან 24000 BTU-მდე: Midea, LG, Samsung, Haier, Daikin და სხვა. ოფიციალური გარანტია, პროფესიონალური მონტაჟი, 0%-იანი განვადება, უფასო მიწოდება თბილისში."
    },
    boiler: {
        title: "გათბობის ქვაბები — ცენტრალური გათბობა, მონტაჟი | Climate Comfort",
        description: "კონდენსაციური და სტანდარტული გაზის ქვაბები ცენტრალური გათბობისთვის: Bosch, Gorenje და სხვა. ოფიციალური გარანტია, მონტაჟი, 0%-იანი განვადება და უფასო მიწოდება თბილისში."
    }
};
for (const [cat, meta] of Object.entries(CATEGORY_PAGES)) {
    const path = `/catalog/${cat}`;
    const ld = itemList(meta.title.split(" — ")[0], rows.filter(r => r.category === cat));
    writeFileSync(join(DIST, "catalog", `${cat}.html`), setHead(withCatalog, { ...meta, path, ldJson: ld, keepFaq: true }));
    add(path, "daily", "0.9");
}

// Brand pages — same wording as brandPageTitle()/brandPageDescription() in app.js
const brands = [...new Set(rows.map(r => r.brand).filter(Boolean))].sort();
for (const brand of brands) {
    const list = rows.filter(r => r.brand === brand);
    const path = `/brand/${brandSlug(brand)}`;
    const meta = {
        title: `${brand} — კონდიციონერები და გათბობის ქვაბები, ფასები | Climate Comfort`,
        description: `${brand}-ის ${list.length} მოდელი ფასებით: ინვერტორული და ON/OFF კონდიციონერები, გათბობის ქვაბები. ოფიციალური გარანტია, მონტაჟი, 0%-იანი განვადება, უფასო მიწოდება თბილისში.`
    };
    writeFileSync(join(DIST, "brand", `${brandSlug(brand)}.html`), setHead(withCatalog, { ...meta, path, ldJson: itemList(brand, list), keepFaq: true }));
    add(path, "weekly", "0.7");
}

// Guides — same markup as renderGuidePage() in app.js (Georgian)
for (const [slug, g] of Object.entries(GUIDES)) {
    const path = `/guide/${slug}`;
    const others = Object.entries(GUIDES).filter(([s]) => s !== slug).map(([s, o]) => `<a href="/guide/${s}">${esc(o.title)}</a>`).join("");
    const body = `${breadcrumb([{ name: "მთავარი", href: "/" }, { name: "სასარგებლო სტატიები", href: "/#guides" }, { name: g.title }])}
        <h1 class="legal-title">${esc(g.title)}</h1>
        <p class="legal-updated">განახლებულია: ${esc(g.updated)}</p>
        <div class="legal-body">${g.html}</div>
        <nav class="legal-other">${others}</nav>`;
    const ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": g.title,
        "description": g.description,
        "inLanguage": "ka",
        "dateModified": g.updated,
        "mainEntityOfPage": SITE + path,
        "author": { "@id": `${SITE}/#organization` },
        "publisher": { "@id": `${SITE}/#organization` }
    };
    let html = setHead(withCatalog, { title: `${g.title} | Climate Comfort`, description: g.description, ogType: "article", path, ldJson: ld, bodyClass: "legal-view" });
    html = html.replace('id="legal-content"></div>', `id="legal-content">${body}</div>`);
    writeFileSync(join(DIST, "guide", `${slug}.html`), html);
    add(path, "monthly", "0.6", g.updated);
}

const LEGAL_PAGES = {
    terms: { title: "წესები და პირობები | Climate Comfort", description: "Climate Comfort-ის ონლაინ მაღაზიის წესები და პირობები: შეკვეთა, მიწოდება, გადახდა, გარანტია." },
    privacy: { title: "კონფიდენციალურობის პოლიტიკა | Climate Comfort", description: "როგორ ამუშავებს და იცავს Climate Comfort თქვენს პერსონალურ მონაცემებს." },
    returns: { title: "დაბრუნება და გარანტია | Climate Comfort", description: "პროდუქციის დაბრუნების, გაცვლისა და საგარანტიო მომსახურების პირობები." }
};
for (const [slug, meta] of Object.entries(LEGAL_PAGES)) {
    writeFileSync(join(DIST, `${slug}.html`), setHead(withCatalog, { ...meta, path: `/${slug}`, bodyClass: "legal-view" }));
    add(`/${slug}`, "monthly", "0.3");
}

// 404 — Cloudflare Pages serves this (with a 404 status) for any path that is
// not a file and not rewritten in _redirects. It is the app shell too, so
// app.js still renders the "not found" view with the site's header and footer.
{
    const body = `
        <h1 class="legal-title">გვერდი ვერ მოიძებნა</h1>
        <div class="legal-body"><p class="legal-lead">ეს პროდუქტი ან გვერდი აღარ არსებობს, ან მისამართი არასწორადაა აკრეფილი. კატალოგში იპოვით ყველა აქტუალურ მოდელს.</p></div>
        <nav class="legal-other"><a href="/#catalog">კატალოგში დაბრუნება</a><a href="/">მთავარი</a></nav>`;
    let html = setHead(withCatalog, { title: "გვერდი ვერ მოიძებნა | Climate Comfort", description: "გვერდი ვერ მოიძებნა.", path: "/404", bodyClass: "legal-view", noindex: true });
    html = html.replace('id="legal-content"></div>', `id="legal-content">${body}</div>`);
    writeFileSync(join(DIST, "404.html"), html);
}

// ---------------------------------------------------------------------------
// 7. sitemap.xml
// ---------------------------------------------------------------------------
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `    <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

// ---------------------------------------------------------------------------
const count = (dir) => readdirSync(dir, { withFileTypes: true, recursive: true }).filter(e => e.isFile()).length;
console.log(`dist ready: ${count(DIST)} files, ${rows.length} products, ${brands.length} brands, ${Object.keys(GUIDES).length} guides, ${sitemapUrls.length} sitemap URLs`);

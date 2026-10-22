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
//   5. pre-renders /catalog/ac, /catalog/boiler and the legal pages with
//      their own <head>;
//   6. writes sitemap.xml and the Cloudflare _redirects / _headers files.
//
// If the catalog cannot be fetched the build FAILS on purpose: Cloudflare then
// keeps the previous deployment live instead of publishing a site without
// product pages. Set ALLOW_EMPTY_CATALOG=1 to build without it (local dev).
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const SITE = "https://climate-comfort.ge";
const SITE_NAME = "Climate Comfort";

// ---------------------------------------------------------------------------
// 1. Static files
// ---------------------------------------------------------------------------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, "admin"), { recursive: true });
mkdirSync(join(DIST, "assets"), { recursive: true });
mkdirSync(join(DIST, "product"), { recursive: true });
mkdirSync(join(DIST, "catalog"), { recursive: true });

for (const f of ["app.js", "analytics.js", "styles.css", "supabase-config.js", "robots.txt", "llms.txt", "_headers", "_redirects"]) {
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

// Same rule as productSlug() in app.js — keep the two in step.
const slugOf = (r) => `${r.brand || ""}-${r.model || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || String(r.id);
const titleOf = (r) => r.title_ka || `${r.brand} ${r.model}`;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => Number(n).toLocaleString("en-US");
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

// ---------------------------------------------------------------------------
// 3. index.html template helpers
// ---------------------------------------------------------------------------
const template = readFileSync(join(ROOT, "index.html"), "utf8");
if (!template.includes('<script src="/app.js"></script>')) throw new Error("index.html: app.js script tag not found");
if (!template.includes('id="product-detail-content"></div>')) throw new Error("index.html: product container not found");

function setHead(html, { title, description, path, ogType = "website", image = null, ldJson = null, bodyClass = null, keepFaq = false }) {
    const url = SITE + path;
    // The FAQ section is part of the home layout; pages that hide it (product,
    // legal) must not carry its FAQPage schema — Google treats markup for
    // content the visitor cannot see as spam.
    if (!keepFaq) html = html.replace(/\s*<!-- FAQ rich result[\s\S]*?<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, "");
    html = html.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}">`);
    html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(url)}">`);
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

const withCatalog = embed(template, "catalog-data", slim);

// ---------------------------------------------------------------------------
// 4. Home
// ---------------------------------------------------------------------------
writeFileSync(join(DIST, "index.html"), withCatalog);

// ---------------------------------------------------------------------------
// 5. Product pages — /product/<slug>  (served from product/<slug>.html)
// ---------------------------------------------------------------------------
const CATEGORY = {
    ac: { ka: "კონდიციონერი", plural: "კონდიციონერები", path: "/catalog/ac" },
    boiler: { ka: "გათბობის ქვაბი", plural: "გათბობის ქვაბები", path: "/catalog/boiler" }
};

function productTitle(r) {
    const kind = (CATEGORY[r.category] || CATEGORY.ac).ka;
    const cap = r.btu ? ` ${r.btu}${r.category === "boiler" ? " kW" : " BTU"}` : "";
    return `${titleOf(r)} — ${kind}${cap} | ${SITE_NAME}`;
}

function productDescription(r) {
    const own = (r.description_ka || "").replace(/\s+/g, " ").trim();
    if (own.length > 60) return own.length > 160 ? own.slice(0, 157).trimEnd() + "…" : own;
    const area = r.area_sqm ? `, ${r.area_sqm} მ²` : "";
    const price = r.display_price ? `, ფასი ${money(r.display_price)} ₾` : "";
    return `${titleOf(r)}${area}${price}. ოფიციალური გარანტია, მონტაჟი, 0%-იანი განვადება და უფასო მიწოდება თბილისში.`;
}

function productLd(r, url) {
    const images = Array.isArray(r.images) && r.images.length ? r.images : (r.image_url ? [r.image_url] : []);
    const cat = CATEGORY[r.category] || CATEGORY.ac;
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
                { "@type": "ListItem", "position": 3, "name": titleOf(r), "item": url }
            ]
        }
    ];
}

// The same markup renderProductDetailPage() in app.js produces (Georgian),
// so the page looks finished before app.js runs and the swap is invisible.
function productBody(r) {
    const title = titleOf(r);
    const images = Array.isArray(r.images) && r.images.length ? r.images : (r.image_url ? [r.image_url] : []);
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
            r.btu ? `<tr><td>${r.category === "boiler" ? "სიმძლავრე" : "BTU"}</td><td>${esc(r.btu)}${r.category === "boiler" ? " kW" : " BTU"}</td></tr>` : "",
            r.area_sqm ? `<tr><td>რეკომენდებული ფართობი</td><td>${esc(r.area_sqm)} მ²</td></tr>` : "",
            `<tr><td>ტექნოლოგია</td><td>${r.subtype === "inverter" ? (r.category === "boiler" ? "კონდენსაციური" : "ინვერტორი") : (r.category === "boiler" ? "სტანდარტული" : "ON/OFF")}</td></tr>`
        ].join("");

    return `
        <a href="/#catalog" class="back-link"><i class="fa-solid fa-arrow-left"></i> კატალოგში დაბრუნება</a>
        <div class="detail-layout">
            <div class="detail-visual ${images.length > 1 ? "has-gallery" : ""}">
                <div class="card-badges">${badges}</div>
                ${gallery}
            </div>
            <div class="detail-info">
                <span class="product-brand">${esc(r.brand)}</span>
                <h1 class="detail-title">${esc(title)}</h1>
                <p class="detail-description">${esc(r.description_ka || "")}</p>
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
    `;
}

const productUrls = [];
for (const r of rows) {
    const slug = slugOf(r);
    const path = `/product/${slug}`;
    const url = SITE + path;
    const images = Array.isArray(r.images) && r.images.length ? r.images : (r.image_url ? [r.image_url] : []);
    let html = setHead(withCatalog, {
        title: productTitle(r),
        description: productDescription(r),
        path,
        ogType: "product",
        image: images[0] || null,
        ldJson: productLd(r, url),
        bodyClass: "product-view"
    });
    // The <head> already carries the product wording: stop applyLanguage()
    // from overwriting it with the generic home text on load.
    html = html.replace(/<meta name="description" data-i18n-meta="[^"]*"/, '<meta name="description"');
    html = html.replace('id="product-detail-content"></div>', `id="product-detail-content">${productBody(r)}</div>`);
    html = embed(html, "product-data", r);
    writeFileSync(join(DIST, "product", `${slug}.html`), html);
    productUrls.push({ loc: url, lastmod: (r.updated_at || r.created_at || "").slice(0, 10), changefreq: "weekly", priority: "0.8" });
}

// ---------------------------------------------------------------------------
// 6. Category + legal pages
// ---------------------------------------------------------------------------
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
    const ld = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": meta.title.split(" — ")[0],
        "itemListElement": rows.filter(r => r.category === cat).slice(0, 50).map((r, i) => ({
            "@type": "ListItem", "position": i + 1, "url": `${SITE}/product/${slugOf(r)}`
        }))
    };
    writeFileSync(join(DIST, "catalog", `${cat}.html`), setHead(withCatalog, { ...meta, path, ldJson: ld, keepFaq: true }));
}

const LEGAL_PAGES = {
    terms: { title: "წესები და პირობები | Climate Comfort", description: "Climate Comfort-ის ონლაინ მაღაზიის წესები და პირობები: შეკვეთა, მიწოდება, გადახდა, გარანტია." },
    privacy: { title: "კონფიდენციალურობის პოლიტიკა | Climate Comfort", description: "როგორ ამუშავებს და იცავს Climate Comfort თქვენს პერსონალურ მონაცემებს." },
    returns: { title: "დაბრუნება და გარანტია | Climate Comfort", description: "პროდუქციის დაბრუნების, გაცვლისა და საგარანტიო მომსახურების პირობები." }
};
for (const [slug, meta] of Object.entries(LEGAL_PAGES)) {
    writeFileSync(join(DIST, `${slug}.html`), setHead(withCatalog, { ...meta, path: `/${slug}`, bodyClass: "legal-view" }));
}

// ---------------------------------------------------------------------------
// 7. sitemap.xml
// ---------------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = [
    { loc: `${SITE}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
    ...Object.keys(CATEGORY_PAGES).map(c => ({ loc: `${SITE}/catalog/${c}`, lastmod: today, changefreq: "daily", priority: "0.9" })),
    ...productUrls,
    ...Object.keys(LEGAL_PAGES).map(s => ({ loc: `${SITE}/${s}`, lastmod: today, changefreq: "monthly", priority: "0.3" }))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

// ---------------------------------------------------------------------------
const count = (dir) => readdirSync(dir, { withFileTypes: true, recursive: true }).filter(e => e.isFile()).length;
console.log(`dist ready: ${count(DIST)} files, ${rows.length} products pre-rendered, ${urls.length} sitemap URLs`);

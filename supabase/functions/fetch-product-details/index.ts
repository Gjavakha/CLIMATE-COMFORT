// ============================================================================
// fetch-product-details — Climate Comfort
// Given a supplier's product page URL, fetches it server-side (avoids the
// browser's CORS block on cross-origin requests) and returns normalized
// specs + images so the admin importer can enrich a product without the
// admin having to manually copy them over.
//
// Elit (ee.ge) is a Next.js site: the full product record is embedded as
// JSON in a <script id="__NEXT_DATA__"> tag — no HTML parsing needed.
// Kontakt is a Magento site: specs live in .har__row (.har__title +
// .har__znach) and gallery images in .slider111__thumbs img[src].
//
// Fallback: some suppliers' own price lists carry no product-page link at
// all (Chigo, Alneo.ge), and Elit's site blocks this function's IP outright.
// When there's no direct source or it comes back empty, this function
// searches Kontakt.ge by brand+model instead — Kontakt carries a broad mix
// of brands, and its own product pages are reliably scrapable — so a
// product is never left with zero photo/specs just because its own
// supplier's list is missing that data.
// ============================================================================
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ka-GE,ka;q=0.9,en;q=0.8",
};

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        },
    });
}

function empty(error?: string) {
    return { images: [] as string[], specs: [] as unknown[], description: null as string | null, ...(error ? { error } : {}) };
}

function parseElit(html: string) {
    const m = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html);
    if (!m) return empty("NEXT_DATA not found");

    let data: any;
    try { data = JSON.parse(m[1]); } catch { return empty("bad NEXT_DATA json"); }

    const product = data?.props?.pageProps?.initialProductData?.product;
    if (!product) return empty("product not found in page data");

    const images: string[] = product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : []);
    const specs = (product.specificationGroup || []).map((g: any) => ({
        group: g.groupName,
        items: (g.specifications || []).map((s: any) => ({
            name: s.specificationName,
            value: s.specificationMeaning,
        })),
    }));

    return { images, specs, description: product.description || null };
}

function parseKontakt(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) return empty("could not parse HTML");

    const items = Array.from(doc.querySelectorAll(".har .har__row"))
        .map((row) => ({
            name: (row as any).querySelector(".har__title")?.textContent?.trim() || "",
            value: (row as any).querySelector(".har__znach")?.textContent?.trim() || "",
        }))
        .filter((i) => i.name && i.value);

    // Thumbnail <img src> points at a downscaled Magento cache variant
    // (…/product/cache/<hash>/t/m/file.jpg); stripping the cache/<hash>
    // segment gives the original, full-resolution image.
    const images = Array.from(doc.querySelectorAll(".slider111__thumbs img"))
        .map((img) => (img as any).getAttribute("src"))
        .filter((src): src is string => !!src)
        .map((src) => src.replace(/\/media\/catalog\/product\/cache\/[^/]+\//, "/media/catalog/product/"));

    return {
        images,
        specs: items.length ? [{ group: "მახასიათებლები", items }] : [],
        description: null,
    };
}

// ee.ge blocks requests from cloud/datacenter IPs (Cloudflare bot protection
// returns 403 — or a full JS challenge via a reader proxy — for Supabase
// Edge Functions specifically, while working fine from a residential IP).
// Routed through Jina AI Reader (r.jina.ai) on the chance it isn't blocked
// for a given request; Kontakt has no such block and is fetched directly.
async function fetchDirect(url: string, supplier: "elit" | "kontakt") {
    const viaJina = supplier === "elit";
    const fetchUrl = viaJina ? "https://r.jina.ai/" + url : url;
    const headers: Record<string, string> = { ...BROWSER_HEADERS };
    if (viaJina) headers["X-Return-Format"] = "html";
    else headers["Referer"] = new URL(url).origin + "/";

    const res = await fetch(fetchUrl, { headers });
    if (!res.ok) return empty(`fetch failed with status ${res.status}`);

    // Force UTF-8 decoding: some supplier sites omit/mis-declare the charset
    // in Content-Type, which makes a plain res.text() mangle Georgian text.
    const html = new TextDecoder("utf-8").decode(await res.arrayBuffer());
    return supplier === "elit" ? parseElit(html) : parseKontakt(html);
}

// --------------------------------------------------------------------------
// isurve.ge — third source, and the only one carrying Chigo, Alneo and Konka,
// whose own price lists have no product-page link at all.
//
// It runs on Shopify, so there is a clean public JSON API and no HTML
// scraping: /search?q= lists candidate handles and /products/<handle>.js
// returns the images plus a description in Georgian. Note /products.json
// omits sold-out items, so the search page is used to find handles instead.
// --------------------------------------------------------------------------
const ISURVE = "https://isurve.ge";

// "CS-25V3G-1C172DY8A-W3" and "cs-25v3g-1c172dy8a-w3" must compare equal
function normalizeModel(s: string) {
    return s.toUpperCase().replace(/[\s\-_/]/g, "");
}

// The description is <p><strong>Group</strong></p><ul><li>name: value</li>…</ul>
function parseIsurveDescription(html: string) {
    const groups: { group: string; items: { name: string; value: string }[] }[] = [];
    const strip = (s: string) => s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

    // Split on each bold paragraph heading, keeping the heading with its block
    const parts = html.split(/<p>\s*<strong>/i);
    for (const part of parts) {
        const headEnd = part.search(/<\/strong>/i);
        const group = headEnd > -1 ? strip(part.slice(0, headEnd)).replace(/:$/, "") : "მახასიათებლები";

        const items: { name: string; value: string }[] = [];
        for (const m of part.matchAll(/<li[^>]*>([\s\S]*?)(?=<li|<\/ul>|$)/gi)) {
            const text = strip(m[1]);
            if (!text) continue;
            const colon = text.indexOf(":");
            if (colon > 0 && colon < text.length - 1) {
                items.push({ name: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim() });
            } else if (colon === -1) {
                // A bare bullet is a feature the unit has, not a name/value pair
                items.push({ name: text, value: "✓" });
            }
        }
        if (items.length) groups.push({ group, items });
    }
    return groups;
}

// Price lists carry suffixes the retailer's title does not ("AR18CXFCABT/JO",
// "L1PB24-C28WM/CORP", "AS35S2SF1FA BLACK"), so retry on the trimmed code.
function modelVariants(model: string) {
    const out = [model];
    const beforeSlash = model.split("/")[0].trim();
    if (beforeSlash && beforeSlash !== model) out.push(beforeSlash);
    const noColour = model.replace(/\s+(BLACK|WHITE|SILVER|GOLD|INV)$/i, "").trim();
    if (noColour && !out.includes(noColour)) out.push(noColour);
    return out;
}

async function fetchIsurveBySearch(brand: string, model: string) {
    for (const variant of modelVariants(model)) {
        const hit = await fetchIsurveOne(variant);
        if (hit) return hit;
    }
    return null;
}

async function fetchIsurveOne(model: string) {
    const res = await fetch(`${ISURVE}/search?q=${encodeURIComponent(model)}&type=product`, { headers: BROWSER_HEADERS });
    if (!res.ok) return null;

    const html = new TextDecoder("utf-8").decode(await res.arrayBuffer());
    const handles = [...new Set([...html.matchAll(/\/products\/([^"'?#\s]+)/g)].map((m) => decodeURIComponent(m[1])))]
        .filter((h) => !/\.(jpg|jpeg|png|webp|gif)$/i.test(h) && !h.includes("{width}"));

    // Only accept a handle that actually contains the model code — isurve's
    // search happily returns loosely related products otherwise.
    const want = normalizeModel(model);
    const handle = handles.find((h) => normalizeModel(h).includes(want));
    if (!handle) return null;

    const pRes = await fetch(`${ISURVE}/products/${encodeURIComponent(handle)}.js`, { headers: BROWSER_HEADERS });
    if (!pRes.ok) return null;

    const data = JSON.parse(new TextDecoder("utf-8").decode(await pRes.arrayBuffer()));
    const images: string[] = (data.images || []).map((u: string) => (u.startsWith("//") ? "https:" + u : u));
    if (!images.length) return null;

    return {
        images,
        specs: parseIsurveDescription(data.description || ""),
        description: null as string | null,
        sourceUrl: `${ISURVE}/products/${handle}`,
    };
}

// Kontakt.ge's search auto-redirects a query with one clear best match
// straight to that product's page; response.url after a followed redirect
// reflects that. Staying on /catalogsearch/ means no confident single match.
async function fetchKontaktBySearch(brand: string, model: string) {
    const q = encodeURIComponent(`${brand} ${model}`);
    const res = await fetch(`https://kontakt.ge/catalogsearch/result/?q=${q}`, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
    });
    if (!res.ok || res.url.includes("/catalogsearch/")) return null;

    const html = new TextDecoder("utf-8").decode(await res.arrayBuffer());
    const result = parseKontakt(html);
    return result.images.length ? { ...result, sourceUrl: res.url } : null;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return json({ ok: true });

    try {
        const { url, supplier, brand, model } = await req.json();

        // Only Elit and Kontakt have a direct-site parser above; other
        // suppliers (Chigo, Alneo.ge, ...) have no product-page link at all
        // in their own price lists, so they go straight to the fallback.
        // Deliberately untyped: each source returns a slightly different shape
        // (some carry sourceUrl, some an error) and they all normalize below.
        // deno-lint-ignore no-explicit-any
        let result: any = empty();
        if (url && (supplier === "elit" || supplier === "kontakt")) {
            result = await fetchDirect(url, supplier);
        }

        // Fallback chain. Kontakt carries the mainstream brands; isurve is the
        // only source for Chigo, Alneo and Konka, and also fills gaps where
        // ee.ge blocks this function's IP. For the two suppliers Kontakt never
        // stocks, isurve is tried first so we don't pay for a doomed search.
        if (!result.images?.length && brand && model) {
            const isurveFirst = supplier === "chigo" || supplier === "alneo";
            // deno-lint-ignore no-explicit-any
            const chain: ((b: string, m: string) => Promise<any>)[] = isurveFirst
                ? [fetchIsurveBySearch, fetchKontaktBySearch]
                : [fetchKontaktBySearch, fetchIsurveBySearch];

            for (const lookup of chain) {
                try {
                    const hit = await lookup(brand, model);
                    if (hit) { result = hit; break; }
                } catch (_e) {
                    // One unreachable source must not abort the whole chain
                }
            }
        }

        const images = result.images ?? [];
        const specs = result.specs ?? [];
        if (!images.length && !specs.length) {
            return json({ images: [], specs: [], description: null, error: result.error || "no source had data for this product" }, 200);
        }
        return json({ ...result, images, specs });
    } catch (err) {
        return json({ error: String(err) }, 500);
    }
});

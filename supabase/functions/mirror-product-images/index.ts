// ============================================================================
// mirror-product-images — Climate Comfort
//
// Product photos are discovered on suppliers' sites at import time
// (fetch-product-details) and were stored as links to the suppliers' own
// servers. Those links break whenever a supplier renames or removes a file,
// and the site would lose its photos through no fault of its own. This
// function copies the photos into the project's own Storage bucket
// (product-images, public) and rewrites the product rows to point there.
//
//   POST { productId }          → mirror that one product (importer, after enrichment)
//   POST { limit?: number }     → mirror up to `limit` (default 10) products that
//                                  still have external photos; returns how many remain,
//                                  so the admin button can be clicked until 0.
//
// Response: { ok, processed, remaining, errors: [{productId, error}] }
//
// Who may call it: deployed WITH JWT verification, plus the database's
// is_admin() check — the same gate as bog-refund / publish-site.
// SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected.
// Bucket + read policy: see supabase-schema.sql ("Storage: product photos").
// ============================================================================

const BUCKET = "product-images";
const MAX_IMAGES_PER_PRODUCT = 6;
const MAX_BYTES = 8 * 1024 * 1024;

const CORS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

async function callerIsAdmin(authHeader: string): Promise<boolean> {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
        method: "POST",
        headers: { apikey: Deno.env.get("SUPABASE_ANON_KEY") ?? "", Authorization: authHeader, "Content-Type": "application/json" },
        body: "{}",
    });
    if (!res.ok) return false;
    return (await res.json()) === true;
}

const dbHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };

type Row = { id: string; image_url: string | null; images: string[] | null };

const isOurs = (u: string) => typeof u === "string" && u.startsWith(PUBLIC_PREFIX);

async function fetchCandidates(limit: number, productId?: string): Promise<Row[]> {
    // Rows whose cover or gallery still points outside our bucket. PostgREST
    // cannot express "any array element not like", so over-fetch and filter.
    const filter = productId ? `&id=eq.${productId}` : "";
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,image_url,images&order=created_at.desc${filter}`, { headers: dbHeaders });
    if (!res.ok) throw new Error(`products read failed: HTTP ${res.status}`);
    const rows = (await res.json()) as Row[];
    return rows.filter(r => {
        const all = [...(r.images || []), ...(r.image_url ? [r.image_url] : [])];
        return all.some(u => u && !isOurs(u));
    }).slice(0, limit);
}

function extFor(contentType: string, url: string): string {
    const ct = contentType.split(";")[0].trim().toLowerCase();
    if (ct === "image/jpeg") return "jpg";
    if (ct === "image/png") return "png";
    if (ct === "image/webp") return "webp";
    if (ct === "image/gif") return "gif";
    if (ct === "image/avif") return "avif";
    const m = url.match(/\.(jpe?g|png|webp|gif|avif)(?:[?#]|$)/i);
    return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

// Downloads one external photo and stores it as <productId>/<n>.<ext>.
// Returns the public URL, or null when the source is gone / not an image.
async function mirrorOne(productId: string, src: string, n: number): Promise<string | null> {
    if (isOurs(src)) return src;
    const res = await fetch(src, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ClimateComfortBot/1.0; +https://climate-comfort.ge)" } });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_BYTES) return null;
    const path = `${productId}/${n}.${extFor(ct, src)}`;
    const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SERVICE_KEY}`,
            apikey: SERVICE_KEY,
            "Content-Type": ct.split(";")[0],
            "Cache-Control": "max-age=31536000",
            "x-upsert": "true",
        },
        body: bytes,
    });
    if (!up.ok) throw new Error(`upload failed: HTTP ${up.status} ${await up.text()}`);
    return PUBLIC_PREFIX + path;
}

async function mirrorProduct(row: Row): Promise<{ mirrored: number; dropped: number }> {
    const sources = [...new Set([...(row.image_url ? [row.image_url] : []), ...(row.images || [])])].slice(0, MAX_IMAGES_PER_PRODUCT);
    const kept: string[] = [];
    let dropped = 0;
    for (let i = 0; i < sources.length; i++) {
        const url = await mirrorOne(row.id, sources[i], i + 1);
        if (url) kept.push(url); else dropped++;
    }
    // A product whose every photo is gone keeps its old links (better a
    // possibly-broken photo than none) and is reported, not rewritten.
    if (!kept.length) throw new Error("no photo could be downloaded");
    const patch = { images: kept, image_url: kept[0] };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { ...dbHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`products update failed: HTTP ${res.status}`);
    return { mirrored: kept.length, dropped };
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return json({ error: "POST only" }, 405);

    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "authentication required" }, 401);
    if (!(await callerIsAdmin(auth))) return json({ error: "admin only" }, 403);

    let body: { productId?: string; limit?: number } = {};
    try { body = await req.json(); } catch { /* empty body is fine */ }
    const productId = typeof body.productId === "string" && /^[0-9a-f-]{36}$/i.test(body.productId) ? body.productId : undefined;
    const limit = productId ? 1 : Math.min(Math.max(Number(body.limit) || 10, 1), 25);

    try {
        const rows = await fetchCandidates(limit, productId);
        const errors: { productId: string; error: string }[] = [];
        let processed = 0, photos = 0;
        for (const row of rows) {
            try {
                const r = await mirrorProduct(row);
                processed++;
                photos += r.mirrored;
            } catch (err) {
                errors.push({ productId: row.id, error: String((err as Error).message || err) });
            }
        }
        const remaining = productId ? 0 : (await fetchCandidates(1000)).length - errors.length;
        return json({ ok: true, processed, photos, remaining: Math.max(remaining, 0), errors });
    } catch (err) {
        return json({ error: String((err as Error).message || err) }, 500);
    }
});

// ============================================================================
// publish-site — Climate Comfort
//
// Rebuilds the public site. The site is static (Cloudflare Pages) and its
// product pages are pre-rendered at build time from the database, so after
// prices or products change in the admin page somebody has to trigger a new
// build. The admin page's "Publish site" button calls this function, which
// POSTs to the Cloudflare Pages deploy hook. Git pushes rebuild as well.
//
//   POST {}  → { ok: true, build: <Cloudflare's response> }
//
// Who may call it: deployed WITH JWT verification, plus the database's
// is_admin() check (admin_emails table) — the same gate as bog-refund.
// The hook URL is a secret (anyone holding it can start builds):
//   PAGES_DEPLOY_HOOK = https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<id>
// SUPABASE_URL / SUPABASE_ANON_KEY are injected by Supabase.
// ============================================================================

const CORS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS, "Content-Type": "application/json" },
    });
}

async function callerIsAdmin(authHeader: string): Promise<boolean> {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/rpc/is_admin`, {
        method: "POST",
        headers: {
            apikey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            Authorization: authHeader,
            "Content-Type": "application/json",
        },
        body: "{}",
    });
    if (!res.ok) return false;
    return (await res.json()) === true;
}

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return json({ error: "POST only" }, 405);

    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "authentication required" }, 401);
    if (!(await callerIsAdmin(auth))) return json({ error: "admin only" }, 403);

    const hook = Deno.env.get("PAGES_DEPLOY_HOOK");
    if (!hook || !hook.startsWith("https://api.cloudflare.com/")) {
        return json({ error: "PAGES_DEPLOY_HOOK is not configured — create a deploy hook in Cloudflare Pages → Settings → Builds and store its URL as a function secret" }, 500);
    }

    const res = await fetch(hook, { method: "POST" });
    const text = await res.text();
    let build: unknown = text;
    try { build = JSON.parse(text); } catch { /* keep the raw text */ }
    if (!res.ok) return json({ error: `deploy hook failed: HTTP ${res.status}`, detail: build }, 502);
    return json({ ok: true, build });
});

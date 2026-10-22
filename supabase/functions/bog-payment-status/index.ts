// ============================================================================
// bog-payment-status — Climate Comfort
//
// The page the bank sends the shopper back to asks this function "did my
// order get paid?". Guests cannot read orders through RLS, and the redirect
// itself proves nothing, so this is how the result page learns the outcome.
//
// While the order is still pending and a bank order exists, the function
// reads the bank's receipt and syncs our row — which also covers the case
// where the callback was lost. It returns only the handful of fields the
// result page shows; the order id (an unguessable uuid) is the capability.
//
// Request:  POST { "orderId": "<uuid>" }
// Response: { order_no, payment_status, status, amount, product_title,
//             payment_method, needs_install, payment_reason, bog_order_status }
//
// Secrets: BOG_CLIENT_ID, BOG_CLIENT_SECRET, optional ORDER_EMAIL_FUNCTION.
// ============================================================================

const BOG_TOKEN_URL = "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_API = "https://api.bog.ge/payments/v1";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const STATUS_MAP: Record<string, string> = {
    completed: "paid",
    partial_completed: "paid",
    rejected: "failed",
    blocked: "failed",
    refunded: "refunded",
    refunded_partially: "paid", // partial refund: order stays paid, bog_order_status shows it
};

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

function dbHeaders(): Record<string, string> {
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function dbSelect(table: string, query: string) {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/${table}?${query}`,
        { headers: { ...dbHeaders(), Accept: "application/json" } });
    if (!res.ok) throw new Error(`database ${res.status}: ${await res.text()}`);
    return await res.json();
}

// Returns the number of rows the PATCH touched (see the conditional update below).
async function dbPatch(table: string, query: string, patch: Record<string, unknown>): Promise<number> {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/${table}?${query}`, {
        method: "PATCH", headers: { ...dbHeaders(), Prefer: "return=representation" }, body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`database ${res.status}: ${await res.text()}`);
    const rows = await res.json();
    return Array.isArray(rows) ? rows.length : 0;
}

async function dbInsert(table: string, row: Record<string, unknown>) {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/rest/v1/${table}`, {
        method: "POST", headers: { ...dbHeaders(), Prefer: "return=minimal" }, body: JSON.stringify(row),
    });
    if (!res.ok) console.warn(`${table} insert failed: ${res.status} ${await res.text()}`);
}

async function bogToken(): Promise<string> {
    const id = Deno.env.get("BOG_CLIENT_ID");
    const secret = Deno.env.get("BOG_CLIENT_SECRET");
    if (!id || !secret) throw new Error("BOG_CLIENT_ID / BOG_CLIENT_SECRET secrets are not set");
    const res = await fetch(BOG_TOKEN_URL, {
        method: "POST",
        headers: { Authorization: "Basic " + btoa(`${id}:${secret}`), "Content-Type": "application/x-www-form-urlencoded" },
        body: "grant_type=client_credentials",
    });
    if (!res.ok) throw new Error(`bank auth ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!data.access_token) throw new Error("bank auth returned no access_token");
    return data.access_token;
}

async function bogReceipt(bogOrderId: string) {
    const token = await bogToken();
    const res = await fetch(`${BOG_API}/receipt/${encodeURIComponent(bogOrderId)}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
    if (!res.ok) throw new Error(`bank receipt ${res.status}: ${await res.text()}`);
    return await res.json();
}

async function sendOrderEmail(orderId: string) {
    const fn = Deno.env.get("ORDER_EMAIL_FUNCTION") || "rapid-action";
    try {
        const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/${fn}`, {
            method: "POST", headers: { ...dbHeaders() }, body: JSON.stringify({ orderId }),
        });
        if (!res.ok) console.warn("order email failed:", res.status, await res.text());
    } catch (err) {
        console.warn("order email errored:", (err as Error).message);
    }
}

// deno-lint-ignore no-explicit-any
function publicView(o: any) {
    return {
        order_no: o.order_no,
        payment_status: o.payment_status,
        status: o.status,
        amount: o.amount,
        product_title: o.product_title,
        payment_method: o.payment_method,
        needs_install: o.needs_install,
        payment_reason: o.payment_reason ?? null,
        bog_order_status: o.bog_order_status ?? null,
    };
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
    if (req.method !== "POST") return json(405, { error: "POST only" });

    let orderId = "";
    try { orderId = String((await req.json())?.orderId ?? ""); } catch { /* fall through */ }
    if (!UUID_RE.test(orderId)) return json(400, { error: "orderId must be a uuid" });

    try {
        const rows = await dbSelect("orders",
            `id=eq.${orderId}&select=id,order_no,payment_status,status,amount,product_title,payment_method,` +
            `needs_install,payment_reason,bog_order_id,bog_order_status,paid_at&limit=1`);
        const order = rows[0];
        if (!order) return json(404, { error: "order not found" });

        // Nothing to sync for cash orders or orders that already reached a final state.
        if (!order.bog_order_id || order.payment_status !== "pending") return json(200, publicView(order));

        // deno-lint-ignore no-explicit-any
        let bank: any = null;
        try {
            bank = await bogReceipt(order.bog_order_id);
        } catch (err) {
            console.warn("receipt fetch failed:", (err as Error).message);
            return json(200, { ...publicView(order), sync: "unavailable" });
        }

        const key: string = bank?.order_status?.key ?? "";
        const mapped = STATUS_MAP[key];
        const detail = bank?.payment_detail ?? {};
        const now = new Date().toISOString();
        const patch: Record<string, unknown> = { bog_order_status: key || null, payment_updated_at: now };
        if (detail.transaction_id) patch.bog_transaction_id = detail.transaction_id;
        if (detail.payer_identifier) patch.bog_payer_identifier = detail.payer_identifier;
        if (detail.card_type) patch.bog_card_type = detail.card_type;
        const reason = bank?.reject_reason || detail.code_description || null;
        if (reason && mapped === "failed") patch.payment_reason = String(reason).slice(0, 300);
        if (mapped) {
            patch.payment_status = mapped;
            if (mapped === "paid") patch.paid_at = now;
        }
        // Only the request that actually moves the row out of "pending" sends
        // the email; a callback racing us will see 0 rows touched and skip it.
        const touched = await dbPatch("orders", `id=eq.${orderId}&payment_status=eq.pending`, patch);

        if (mapped && touched > 0) {
            await dbInsert("payment_events", {
                order_id: orderId, provider: "bog", bog_order_id: order.bog_order_id, source: "status_sync",
                event: "receipt", order_status: key, signature_valid: null, payload: bank,
            });
            if (mapped === "paid") await sendOrderEmail(orderId);
        }

        return json(200, publicView({ ...order, ...patch }));
    } catch (err) {
        console.error("bog-payment-status:", (err as Error).message);
        return json(500, { error: (err as Error).message });
    }
});

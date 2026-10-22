// ============================================================================
// bog-refund — Climate Comfort
//
// Admin-only actions on a Bank of Georgia order, called from admin/admin.js:
//
//   POST { orderId, action: "refund", amount? }  → asks the bank to refund the
//        payment (full when amount is omitted or equals the order total,
//        partial otherwise). The bank processes refunds asynchronously; the
//        final "refunded" status arrives through bog-callback, and we also
//        re-read the receipt right away.
//   POST { orderId, action: "sync" }             → re-reads the bank receipt and
//        applies it (same mapping as bog-callback). Useful when a callback was
//        lost or an admin wants to confirm a refund landed.
//
// Who may call it: deployed WITH JWT verification, and on top of that the
// caller must pass the database's is_admin() check (admin_emails table) —
// the same gate the admin page itself uses. Every refund request is stored
// in payment_events with the admin's e-mail.
//
// Secrets: BOG_CLIENT_ID, BOG_CLIENT_SECRET (shared with the other bog-*
// functions). SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are
// injected by Supabase.
// ============================================================================

const BOG_TOKEN_URL = "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_API = "https://api.bog.ge/payments/v1";

const CORS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Bank order status → our payment_status (kept identical to bog-callback).
const STATUS_MAP: Record<string, string> = {
    completed: "paid",
    partial_completed: "paid",
    rejected: "failed",
    blocked: "failed",
    refunded: "refunded",
    // A partial refund leaves the order paid (the rest can still be refunded);
    // bog_order_status keeps "refunded_partially" so the admin can see it.
    refunded_partially: "paid",
};

const ORDER_COLUMNS = "id,order_no,amount,payment_status,paid_at,payment_reason,payment_updated_at," +
    "bog_order_id,bog_order_status,bog_transaction_id,bog_payer_identifier,bog_card_type";

function json(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status, headers: { ...CORS, "Content-Type": "application/json" },
    });
}

// ---------------------------------------------------------------------------
// Database (service role — bypasses RLS; only reached after the admin check)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Caller identity: the gateway already verified the JWT; we additionally ask
// the database whether this user is an admin, using the caller's own token so
// is_admin() sees their e-mail.
// ---------------------------------------------------------------------------
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

function callerEmail(authHeader: string): string | null {
    try {
        const token = authHeader.replace(/^Bearer\s+/i, "");
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return typeof payload.email === "string" ? payload.email : null;
    } catch {
        return null;
    }
}

// ---------------------------------------------------------------------------
// Bank
// ---------------------------------------------------------------------------
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

async function bogReceipt(token: string, bogOrderId: string) {
    const res = await fetch(`${BOG_API}/receipt/${encodeURIComponent(bogOrderId)}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
    if (!res.ok) throw new Error(`bank receipt ${res.status}: ${await res.text()}`);
    return await res.json();
}

// POST /payment/refund/:order_id — body { amount } for a partial refund,
// no body for a full one. The bank answers synchronously whether it accepted
// the request; the money movement itself is asynchronous.
async function bogRefund(token: string, bogOrderId: string, amount: number | null) {
    const headers: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    let body: string | undefined;
    if (amount !== null) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ amount });
    }
    const res = await fetch(`${BOG_API}/payment/refund/${encodeURIComponent(bogOrderId)}`, { method: "POST", headers, body });
    const text = await res.text();
    let data: unknown = text;
    try { data = JSON.parse(text); } catch { /* plain text answer */ }
    return { ok: res.ok, status: res.status, data };
}

// ---------------------------------------------------------------------------
// Apply a bank receipt to our order row (same rules as bog-callback).
// ---------------------------------------------------------------------------
// deno-lint-ignore no-explicit-any
async function applyBankOrder(order: any, bank: any): Promise<void> {
    const key: string = bank?.order_status?.key ?? "";
    const mapped = STATUS_MAP[key];
    const detail = bank?.payment_detail ?? {};
    const now = new Date().toISOString();

    const patch: Record<string, unknown> = {
        payment_provider: "bog",
        bog_order_status: key || null,
        payment_updated_at: now,
    };
    // A refund we asked for is still in flight when the receipt still says
    // "completed": keep our own "refund_requested" marker (it hides the Refund
    // button) until the bank reports the refund.
    if (order.bog_order_status === "refund_requested" && (key === "completed" || key === "partial_completed")) {
        patch.bog_order_status = "refund_requested";
    }
    if (detail.transaction_id) patch.bog_transaction_id = detail.transaction_id;
    if (detail.payer_identifier) patch.bog_payer_identifier = detail.payer_identifier;
    if (detail.card_type) patch.bog_card_type = detail.card_type;

    const reason = bank?.reject_reason || detail.code_description || null;
    if (reason && mapped === "failed") patch.payment_reason = String(reason).slice(0, 300);

    if (mapped && mapped !== order.payment_status) {
        if (!(order.payment_status === "paid" && mapped === "failed")) {
            patch.payment_status = mapped;
            if (mapped === "paid" && !order.paid_at) patch.paid_at = now;
        }
    }
    // Conditional on the status we read, so a concurrent callback wins cleanly.
    await dbPatch("orders", `id=eq.${order.id}&payment_status=eq.${order.payment_status}`, patch);
}

function bankMessage(data: unknown): string {
    if (data && typeof data === "object") {
        // deno-lint-ignore no-explicit-any
        const d = data as any;
        return String(d.message ?? d.error_description ?? d.error ?? d.key ?? JSON.stringify(d)).slice(0, 300);
    }
    return String(data ?? "").slice(0, 300);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (req.method !== "POST") return json(405, { error: "POST only" });

    const auth = req.headers.get("Authorization") || "";
    if (!auth) return json(401, { error: "not signed in" });

    // deno-lint-ignore no-explicit-any
    let body: any;
    try { body = await req.json(); } catch { return json(400, { error: "bad json" }); }

    const orderId = String(body?.orderId ?? "");
    const action = String(body?.action ?? "refund");
    if (!/^[0-9a-f-]{36}$/i.test(orderId)) return json(400, { error: "orderId must be a uuid" });
    if (action !== "refund" && action !== "sync") return json(400, { error: "unknown action" });

    try {
        if (!(await callerIsAdmin(auth))) return json(403, { error: "admin only" });
        const admin = callerEmail(auth);

        const rows = await dbSelect("orders", `id=eq.${orderId}&select=${ORDER_COLUMNS}&limit=1`);
        const order = rows[0];
        if (!order) return json(404, { error: "order not found" });
        if (!order.bog_order_id) return json(409, { error: "this order has no bank payment" });

        const token = await bogToken();
        let message = "";

        if (action === "refund") {
            if (order.payment_status !== "paid") return json(409, { error: `order is ${order.payment_status}, only paid orders can be refunded` });

            const total = Math.round(Number(order.amount) * 100) / 100;
            let amount: number | null = null;
            if (body.amount !== undefined && body.amount !== null && body.amount !== "") {
                amount = Math.round(Number(body.amount) * 100) / 100;
                if (!(amount > 0) || amount > total) return json(400, { error: `amount must be between 0.01 and ${total}` });
                if (amount === total) amount = null; // a full refund is sent without an amount
            }

            const result = await bogRefund(token, order.bog_order_id, amount);
            await dbInsert("payment_events", {
                order_id: order.id, provider: "bog", bog_order_id: order.bog_order_id, source: "refund",
                event: result.ok ? "refund_requested" : "refund_refused", order_status: order.bog_order_status ?? null,
                signature_valid: null,
                payload: { requested_by: admin, amount: amount ?? total, full: amount === null, bank_status: result.status, bank_response: result.data },
            });
            if (!result.ok) return json(502, { error: `bank refused the refund: ${bankMessage(result.data)}` });

            message = amount === null
                ? `Full refund of ${total} ₾ requested — the bank will confirm shortly.`
                : `Partial refund of ${amount} ₾ requested — the bank will confirm shortly.`;
        }

        // Re-read the bank's receipt and apply it (for "sync", this is the whole job).
        try {
            const receipt = await bogReceipt(token, order.bog_order_id);
            await applyBankOrder(order, receipt);
            await dbInsert("payment_events", {
                order_id: order.id, provider: "bog", bog_order_id: order.bog_order_id, source: "status_sync",
                event: action === "refund" ? "after_refund" : "admin_sync", order_status: receipt?.order_status?.key ?? null,
                signature_valid: null, payload: { requested_by: admin, receipt },
            });
            if (action === "sync") message = `Bank says: ${receipt?.order_status?.key ?? "unknown"}.`;
        } catch (err) {
            console.warn("receipt after action failed:", (err as Error).message);
            if (action === "sync") return json(502, { error: `could not read the bank receipt: ${(err as Error).message}` });
        }

        // While the bank is still processing the refund, show that on the order
        // so the admin does not click twice.
        if (action === "refund") {
            await dbPatch("orders",
                `id=eq.${orderId}&payment_status=eq.paid&bog_order_status=not.in.(refunded,refunded_partially,refund_requested)`,
                { bog_order_status: "refund_requested", payment_updated_at: new Date().toISOString() });
        }

        const fresh = (await dbSelect("orders", `id=eq.${orderId}&select=${ORDER_COLUMNS}&limit=1`))[0];
        return json(200, { ok: true, message, order: fresh });
    } catch (err) {
        console.error("bog-refund:", (err as Error).message);
        return json(500, { error: (err as Error).message });
    }
});

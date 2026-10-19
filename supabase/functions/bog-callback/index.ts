// ============================================================================
// bog-callback — Climate Comfort
//
// Bank of Georgia calls this URL (server to server) when a payment finishes,
// is rejected, expires or is refunded. It is the ONLY thing that may mark an
// order as paid.
//
// Trust model, in order:
//   1. The request body is signed by the bank (Callback-Signature header,
//      SHA256withRSA over the raw body). An invalid signature is rejected.
//   2. Regardless of the signature we re-read the order from the bank's own
//      receipt endpoint and apply THAT. The callback body is only used to
//      learn which bank order to look up (and as a fallback when the bank's
//      API is briefly unreachable but the signature was valid).
//   3. Every callback is stored verbatim in payment_events.
//
// ⚠ DEPLOY WITH JWT VERIFICATION OFF. The bank does not send a Supabase JWT.
//    Dashboard: Edge Functions → bog-callback → Details → "Verify JWT" = off.
//    CLI: supabase/config.toml has [functions.bog-callback] verify_jwt = false.
//
// Secrets: BOG_CLIENT_ID, BOG_CLIENT_SECRET (same as bog-create-payment),
//          optional BOG_CALLBACK_PUBLIC_KEY (PEM) to override the key below,
//          optional ORDER_EMAIL_FUNCTION (default "rapid-action") — the
//          confirmation mail is sent from here once the order is paid.
// ============================================================================

const BOG_TOKEN_URL = "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_API = "https://api.bog.ge/payments/v1";

// Published at https://api.bog.ge/docs/en/payments/standard-process/callback
const BOG_PUBLIC_KEY_DEFAULT =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4RUyAw3+CdkS3ZNILQhzHI9Hemo+vKB9U2BSabppkKjzjjkf+0Sm76hSMiu/HFtYhqWOESryoCDJoqffY0Q1VNt25aTxbj068QNUtnxQ7KQVLA+pG0smf+EBWlS1vBEAFbIas9d8c9b9sSEkTrrTYQ90WIM8bGB6S/KLVoT1a7SnzabjoLc5Qf/SLDG5fu8dH8zckyeYKdRKSBJKvhxtcBuHV4f7qsynQT+f2UYbESX/TLHwT5qFWZDHZ0YUOUIvb8n7JujVSGZO9/+ll/g4ZIWhC1MlJgPObDwRkRd8NFOopgxMcMsDIZIoLbWKhHVq67hdbwpAq9K9WMmEhPnPwIDAQAB";

// Bank order status → our payment_status. Statuses not listed leave ours alone.
const STATUS_MAP: Record<string, string> = {
    completed: "paid",
    partial_completed: "paid",
    rejected: "failed",
    blocked: "failed",
    refunded: "refunded",
    refunded_partially: "refunded",
};

// ---------------------------------------------------------------------------
// Database
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

// Returns the number of rows the PATCH touched, so a conditional update
// (…&payment_status=eq.pending) tells us whether WE made the transition.
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
// Signature
// ---------------------------------------------------------------------------
function pemBody(pem: string): string {
    return pem.replace(/-----BEGIN PUBLIC KEY-----/g, "").replace(/-----END PUBLIC KEY-----/g, "").replace(/\s+/g, "");
}

function b64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
    const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    const out = new Uint8Array(new ArrayBuffer(bin.length));
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
    const out = new Uint8Array(new ArrayBuffer(hex.length / 2));
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
}

async function verifySignature(rawBody: string, signature: string): Promise<boolean> {
    try {
        const keyB64 = pemBody(Deno.env.get("BOG_CALLBACK_PUBLIC_KEY") || BOG_PUBLIC_KEY_DEFAULT);
        const key = await crypto.subtle.importKey(
            "spki", b64ToBytes(keyB64),
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"],
        );
        // The docs do not say how the signature is encoded; accept hex or base64.
        const sig = /^[0-9a-f]+$/i.test(signature) && signature.length % 2 === 0
            ? hexToBytes(signature)
            : b64ToBytes(signature);
        const data = new TextEncoder().encode(rawBody);
        const body = new Uint8Array(new ArrayBuffer(data.byteLength));
        body.set(data);
        return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, sig, body);
    } catch (err) {
        console.warn("signature check errored:", (err as Error).message);
        return false;
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

async function bogReceipt(bogOrderId: string) {
    const token = await bogToken();
    const res = await fetch(`${BOG_API}/receipt/${encodeURIComponent(bogOrderId)}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
    if (!res.ok) throw new Error(`bank receipt ${res.status}: ${await res.text()}`);
    return await res.json();
}

// ---------------------------------------------------------------------------
// Apply a bank order object (receipt or callback body) to our order row.
// Returns the new payment_status, or null when nothing changed.
// ---------------------------------------------------------------------------
// deno-lint-ignore no-explicit-any
async function applyBankOrder(order: any, bank: any): Promise<string | null> {
    const key: string = bank?.order_status?.key ?? "";
    const mapped = STATUS_MAP[key];
    const detail = bank?.payment_detail ?? {};
    const now = new Date().toISOString();

    const patch: Record<string, unknown> = {
        payment_provider: "bog",
        bog_order_status: key || null,
        payment_updated_at: now,
    };
    if (detail.transaction_id) patch.bog_transaction_id = detail.transaction_id;
    if (detail.payer_identifier) patch.bog_payer_identifier = detail.payer_identifier;
    if (detail.card_type) patch.bog_card_type = detail.card_type;

    const reason = bank?.reject_reason || detail.code_description || null;
    if (reason && mapped === "failed") patch.payment_reason = String(reason).slice(0, 300);

    let changed: string | null = null;
    if (mapped && mapped !== order.payment_status) {
        // Never downgrade a paid order to failed because of a late/duplicate
        // callback; refunds are the only way out of "paid".
        if (order.payment_status === "paid" && mapped === "failed") {
            // keep
        } else {
            patch.payment_status = mapped;
            changed = mapped;
            if (mapped === "paid" && !order.paid_at) patch.paid_at = now;
        }
    }

    // Optimistic concurrency: the status we read must still be the status in
    // the row, otherwise another callback / status sync got there first.
    const touched = await dbPatch("orders", `id=eq.${order.id}&payment_status=eq.${order.payment_status}`, patch);
    if (touched === 0) {
        if (changed) console.info("order already transitioned by another request; skipping");
        return null;
    }
    return changed;
}

async function sendOrderEmail(orderId: string) {
    const fn = Deno.env.get("ORDER_EMAIL_FUNCTION") || "rapid-action";
    try {
        const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/${fn}`, {
            method: "POST",
            headers: { ...dbHeaders() },
            body: JSON.stringify({ orderId }),
        });
        if (!res.ok) console.warn("order email failed:", res.status, await res.text());
    } catch (err) {
        console.warn("order email errored:", (err as Error).message);
    }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
    if (req.method !== "POST") return new Response("POST only", { status: 405 });

    const raw = await req.text();
    const signature = req.headers.get("Callback-Signature") || req.headers.get("callback-signature") || "";
    let signatureValid: boolean | null = null;
    if (signature) {
        signatureValid = await verifySignature(raw, signature);
        if (!signatureValid) {
            console.warn("callback with INVALID signature rejected");
            return new Response("bad signature", { status: 401 });
        }
    }

    // deno-lint-ignore no-explicit-any
    let payload: any;
    try { payload = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }

    const bankBody = payload?.body ?? payload;
    const bogOrderId: string = String(bankBody?.order_id ?? "");
    if (!bogOrderId) return new Response("no order_id", { status: 400 });

    try {
        const rows = await dbSelect("orders",
            `bog_order_id=eq.${encodeURIComponent(bogOrderId)}&select=id,order_no,payment_status,paid_at&limit=1`);
        const order = rows[0];

        await dbInsert("payment_events", {
            order_id: order?.id ?? null, provider: "bog", bog_order_id: bogOrderId, source: "callback",
            event: payload?.event ?? null, order_status: bankBody?.order_status?.key ?? null,
            signature_valid: signatureValid, payload,
        });

        if (!order) {
            // Unknown to us: acknowledge so the bank stops retrying, but log it loudly.
            console.error("callback for unknown bank order", bogOrderId);
            return new Response("unknown order", { status: 200 });
        }

        // The bank's receipt is authoritative. An unsigned callback that we
        // cannot confirm with the bank is ignored (but still logged above).
        let bank = null;
        try {
            bank = await bogReceipt(bogOrderId);
        } catch (err) {
            console.warn("receipt fetch failed:", (err as Error).message);
            if (signatureValid !== true) return new Response("cannot verify", { status: 503 });
            bank = bankBody;
        }

        const changed = await applyBankOrder(order, bank);
        if (changed === "paid") await sendOrderEmail(order.id);

        return new Response("ok", { status: 200 });
    } catch (err) {
        console.error("bog-callback:", (err as Error).message);
        // Non-200 makes the bank retry (if it does) and leaves the order
        // pending; bog-payment-status will pick it up from the receipt anyway.
        return new Response("error", { status: 500 });
    }
});

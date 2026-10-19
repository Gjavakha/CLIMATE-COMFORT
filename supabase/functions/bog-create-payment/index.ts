// ============================================================================
// bog-create-payment — Climate Comfort
//
// Turns a pending order into a Bank of Georgia payment and returns the URL of
// the bank's hosted payment page. The storefront calls this right after it has
// inserted the order row, then sends the shopper to that URL.
//
// Security model: the caller supplies only an order id. The amount, the
// product and the buyer come from the database, and the amount is checked
// against the product's current price, so a tampered order row cannot buy a
// 2 000 GEL unit for 1 GEL. Bank credentials live in function secrets.
//
// Request:  POST { "orderId": "<uuid>", "lang": "ka" | "en" }
// Response: { "redirect_url": "https://payment.bog.ge/?order_id=..." }
//        or { "already_paid": true, "order_no": 123 }
//
// SETUP (Supabase → Edge Functions → Secrets):
//   BOG_CLIENT_ID      = OPAY client id      (manager.bog.ge → payment methods → your object)
//   BOG_CLIENT_SECRET  = OPAY secret key     (same place; only the company director sees it)
//   SITE_URL           = https://climate-comfort.ge   (where the bank sends the shopper back)
//   BOG_CALLBACK_URL   = optional override; default is <SUPABASE_URL>/functions/v1/bog-callback
//   BOG_CALLBACK_FUNCTION = optional; if the callback function was deployed under another
//                           name (the dashboard sometimes invents one), put that name here.
//
// No imports on purpose — see send-order-email for why.
// ============================================================================

const BOG_TOKEN_URL = "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_API = "https://api.bog.ge/payments/v1";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS, "Content-Type": "application/json" },
    });
}

// ---------------------------------------------------------------------------
// Database (PostgREST with the service role key)
// ---------------------------------------------------------------------------
function dbHeaders(): Record<string, string> {
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function dbSelect(table: string, query: string) {
    const url = Deno.env.get("SUPABASE_URL");
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, { headers: { ...dbHeaders(), Accept: "application/json" } });
    if (!res.ok) throw new Error(`database ${res.status}: ${await res.text()}`);
    return await res.json();
}

async function dbPatch(table: string, query: string, patch: Record<string, unknown>) {
    const url = Deno.env.get("SUPABASE_URL");
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
        method: "PATCH",
        headers: { ...dbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`database ${res.status}: ${await res.text()}`);
}

async function dbInsert(table: string, row: Record<string, unknown>) {
    const url = Deno.env.get("SUPABASE_URL");
    const res = await fetch(`${url}/rest/v1/${table}`, {
        method: "POST",
        headers: { ...dbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify(row),
    });
    if (!res.ok) console.warn(`payment_events insert failed: ${res.status} ${await res.text()}`);
}

// ---------------------------------------------------------------------------
// Bank of Georgia
// ---------------------------------------------------------------------------
async function bogToken(): Promise<string> {
    const id = Deno.env.get("BOG_CLIENT_ID");
    const secret = Deno.env.get("BOG_CLIENT_SECRET");
    if (!id || !secret) throw new Error("BOG_CLIENT_ID / BOG_CLIENT_SECRET secrets are not set");
    const res = await fetch(BOG_TOKEN_URL, {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(`${id}:${secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });
    if (!res.ok) throw new Error(`bank auth ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!data.access_token) throw new Error("bank auth returned no access_token");
    return data.access_token;
}

async function bogReceipt(token: string, bogOrderId: string) {
    const res = await fetch(`${BOG_API}/receipt/${encodeURIComponent(bogOrderId)}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`bank receipt ${res.status}: ${await res.text()}`);
    return await res.json();
}

function callbackUrl(): string {
    const explicit = Deno.env.get("BOG_CALLBACK_URL");
    if (explicit) return explicit;
    const fn = Deno.env.get("BOG_CALLBACK_FUNCTION") || "bog-callback";
    return `${Deno.env.get("SUPABASE_URL")}/functions/v1/${fn}`;
}

function maskEmail(email: string): string {
    const [user, domain] = String(email || "").split("@");
    if (!user || !domain) return "";
    return `${user.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string): string {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.length < 6) return "";
    return `${digits.slice(0, 3)}***${digits.slice(-3)}`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
    if (req.method !== "POST") return json(405, { error: "POST only" });

    let orderId = "";
    let lang = "ka";
    try {
        const body = await req.json();
        orderId = String(body?.orderId ?? "");
        lang = body?.lang === "en" ? "en" : "ka";
    } catch { /* fall through */ }
    if (!UUID_RE.test(orderId)) return json(400, { error: "orderId must be a uuid" });

    try {
        const rows = await dbSelect("orders",
            `id=eq.${orderId}&select=id,order_no,user_email,customer_name,phone,product_id,product_title,amount,` +
            `payment_method,payment_status,status,order_type,bog_order_id,bog_redirect_url&limit=1`);
        const order = rows[0];
        if (!order) return json(404, { error: "order not found" });

        if (order.status === "cancelled") return json(409, { error: "order is cancelled" });
        if (order.payment_status === "paid") return json(200, { already_paid: true, order_no: order.order_no });
        if (order.payment_method !== "card" || order.order_type === "financing") return json(409, { error: "order is not a card payment" });

        const amount = Number(order.amount);
        if (!(amount > 0)) return json(409, { error: "order amount is not positive" });

        // The order row was written by the shopper's browser. Re-check the
        // amount against the product's live price before asking the bank for
        // money: it must be a whole multiple (quantity) of the display price.
        if (order.product_id) {
            const products = await dbSelect("products", `id=eq.${order.product_id}&select=display_price,is_published,hidden&limit=1`);
            const product = products[0];
            if (!product) return json(409, { error: "product no longer exists" });
            const price = Number(product.display_price);
            if (!(price > 0)) return json(409, { error: "product has no price" });
            const qty = amount / price;
            if (Math.abs(qty - Math.round(qty)) > 0.001 || Math.round(qty) < 1) {
                return json(409, { error: "order amount does not match the product price" });
            }
        }

        const token = await bogToken();

        // A bank order may already exist (shopper closed the bank page and came
        // back). Reuse it while it is still open; replace it once it is dead.
        if (order.bog_order_id) {
            try {
                const receipt = await bogReceipt(token, order.bog_order_id);
                const key = receipt?.order_status?.key;
                if (key === "completed") {
                    await dbPatch("orders", `id=eq.${orderId}`, {
                        payment_status: "paid", payment_provider: "bog", bog_order_status: key,
                        bog_transaction_id: receipt?.payment_detail?.transaction_id ?? null,
                        bog_payer_identifier: receipt?.payment_detail?.payer_identifier ?? null,
                        bog_card_type: receipt?.payment_detail?.card_type ?? null,
                        paid_at: new Date().toISOString(), payment_updated_at: new Date().toISOString(),
                    });
                    return json(200, { already_paid: true, order_no: order.order_no });
                }
                if ((key === "created" || key === "processing") && order.bog_redirect_url) {
                    return json(200, { redirect_url: order.bog_redirect_url, reused: true });
                }
            } catch (err) {
                console.warn("could not read existing bank order, creating a new one:", (err as Error).message);
            }
        }

        const siteUrl = (Deno.env.get("SITE_URL") || new URL(req.headers.get("origin") || "https://climate-comfort.ge").origin).replace(/\/$/, "");
        const resultUrl = `${siteUrl}/#payment-result/${orderId}`;

        const bogBody = {
            callback_url: callbackUrl(),
            external_order_id: `ORD-${order.order_no}`,
            capture: "automatic",
            ttl: 30,
            purchase_units: {
                currency: "GEL",
                total_amount: amount,
                basket: [{
                    product_id: order.product_id || "item",
                    description: String(order.product_title || "").slice(0, 200),
                    quantity: 1,
                    unit_price: amount,
                }],
            },
            redirect_urls: { success: resultUrl, fail: resultUrl },
            buyer: {
                full_name: String(order.customer_name || "").slice(0, 100),
                masked_email: maskEmail(order.user_email),
                masked_phone: maskPhone(order.phone),
            },
            // payment_method is deliberately omitted: the bank then offers every
            // method enabled on the merchant (card today; Google/Apple Pay or
            // instalments appear automatically once BOG activates them).
        };

        const res = await fetch(`${BOG_API}/ecommerce/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept-Language": lang,
                "Idempotency-Key": crypto.randomUUID(),
            },
            body: JSON.stringify(bogBody),
        });
        const text = await res.text();
        if (!res.ok) {
            console.error("bank create order failed:", res.status, text);
            return json(502, { error: "bank rejected the order", detail: text.slice(0, 500) });
        }
        const created = JSON.parse(text);
        const redirect = created?._links?.redirect?.href;
        if (!created?.id || !redirect) return json(502, { error: "bank response had no redirect link" });

        await dbPatch("orders", `id=eq.${orderId}`, {
            payment_provider: "bog",
            bog_order_id: created.id,
            bog_redirect_url: redirect,
            bog_order_status: "created",
            payment_updated_at: new Date().toISOString(),
        });
        await dbInsert("payment_events", {
            order_id: orderId, provider: "bog", bog_order_id: created.id, source: "create",
            event: "order_created", order_status: "created", payload: { request: bogBody, response: created },
        });

        return json(200, { redirect_url: redirect });
    } catch (err) {
        console.error("bog-create-payment:", (err as Error).message);
        return json(500, { error: (err as Error).message });
    }
});

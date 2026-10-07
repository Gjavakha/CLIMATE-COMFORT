// ============================================================================
// send-order-email — Climate Comfort
//
// Sends the order confirmation to the customer and a notification to the shop.
//
// The function takes only an order id, then reads that order from the database
// with the service role key and mails whatever address is stored on it. The
// caller cannot choose the recipient or the contents, so the public anon key
// being able to invoke this does not turn it into an open mail relay.
//
// SETUP:
//   1. resend.com → API Keys → create one
//   2. Supabase → Edge Functions → Secrets:
//        RESEND_API_KEY = re_xxxxxxxx
//        ORDER_NOTIFY_TO = climatecomfortgroup@gmail.com   (optional)
//        MAIL_FROM = "Climate Comfort <orders@climatecomfort.ge>"
//      Until the domain is verified at Resend, use their sandbox sender:
//        MAIL_FROM = "Climate Comfort <onboarding@resend.dev>"
//
// No imports on purpose: the only database access is one row read, done
// against the PostgREST endpoint directly. Pulling in supabase-js through a
// CDN made deploys fail whenever esm.sh could not resolve one of its modules.
// ============================================================================

const ORDER_COLUMNS =
    "order_no,user_email,customer_name,phone,address,personal_id,product_title,amount,needs_install,payment_method,created_at";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// deno-lint-ignore no-explicit-any
async function fetchOrder(orderId: string): Promise<{ order: any; error?: string }> {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return { order: null, error: "Supabase env vars missing" };

    const res = await fetch(
        `${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=${ORDER_COLUMNS}&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" } }
    );
    if (!res.ok) return { order: null, error: `database ${res.status}: ${await res.text()}` };
    const rows = await res.json();
    return { order: Array.isArray(rows) && rows.length ? rows[0] : null };
}

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
    });
}

const SHOP = {
    name: "Climate Comfort",
    phone: "+995 32 2 111 848",
    email: "climatecomfortgroup@gmail.com",
    site: "https://climatecomfort.ge",
};

const PAYMENT_LABEL: Record<string, string> = {
    tbc: "ბარათით / განვადება — TBC Bank",
    bog: "ბარათით / განვადება — საქართველოს ბანკი",
    cash: "ადგილზე გადახდა",
};

function escapeHtml(s: string) {
    return String(s ?? "").replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
    );
}

function money(n: number) {
    return Number(n).toLocaleString("ka-GE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₾";
}

// deno-lint-ignore no-explicit-any
function customerHtml(o: any) {
    const install = o.needs_install
        ? `<tr><td style="padding:6px 0;color:#64748b">მონტაჟი</td><td style="padding:6px 0;text-align:right">დიახ — ღირებულებას გადაიხდით ადგილზე, სამუშაოს დასრულების შემდეგ</td></tr>`
        : "";

    return `<!doctype html>
<html lang="ka"><body style="margin:0;background:#f8fafc;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a">
  <div style="max-width:560px;margin:0 auto;padding:28px 16px">
    <div style="background:#0f172a;border-radius:14px 14px 0 0;padding:22px 26px">
      <div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-.4px">
        <span style="color:#0ec1f5">Climate</span>Comfort
      </div>
    </div>

    <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px;padding:26px">
      <h1 style="margin:0 0 6px;font-size:20px">შეკვეთა მიღებულია</h1>
      <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6">
        გმადლობთ, ${escapeHtml(o.customer_name)}! თქვენი შეკვეთა დარეგისტრირდა.
        ოპერატორი უახლოეს საათებში დაგიკავშირდებათ დეტალების დასაზუსტებლად.
      </p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin-bottom:20px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#64748b">შეკვეთის ნომერი</td><td style="padding:6px 0;text-align:right;font-weight:700">ORD-${o.order_no}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">პროდუქტი</td><td style="padding:6px 0;text-align:right">${escapeHtml(o.product_title)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">ღირებულება</td><td style="padding:6px 0;text-align:right;font-weight:700">${money(o.amount)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">გადახდის მეთოდი</td><td style="padding:6px 0;text-align:right">${PAYMENT_LABEL[o.payment_method] || "შეთანხმებით"}</td></tr>
          ${install}
          <tr><td style="padding:6px 0;color:#64748b">მისამართი</td><td style="padding:6px 0;text-align:right">${escapeHtml(o.address)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">ტელეფონი</td><td style="padding:6px 0;text-align:right">${escapeHtml(o.phone)}</td></tr>
        </table>
      </div>

      <p style="margin:0 0 18px;color:#475569;font-size:13px;line-height:1.6">
        შეკვეთის გაუქმება ან ცვლილება შესაძლებელია ოპერატორთან დაკავშირებით.
        დაბრუნებისა და გარანტიის პირობები:
        <a href="${SHOP.site}/#returns" style="color:#0ec1f5">${SHOP.site}/#returns</a>
      </p>

      <div style="border-top:1px solid #e2e8f0;padding-top:16px;color:#64748b;font-size:13px;line-height:1.7">
        <strong style="color:#0f172a">${SHOP.name}</strong><br>
        ტელ: <a href="tel:${SHOP.phone.replace(/\s/g, "")}" style="color:#0ec1f5">${SHOP.phone}</a><br>
        ელ. ფოსტა: <a href="mailto:${SHOP.email}" style="color:#0ec1f5">${SHOP.email}</a>
      </div>
    </div>
  </div>
</body></html>`;
}

// deno-lint-ignore no-explicit-any
function shopHtml(o: any) {
    return `<!doctype html><html lang="ka"><body style="font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a">
  <h2 style="margin:0 0 12px">ახალი შეკვეთა — ORD-${o.order_no}</h2>
  <table style="border-collapse:collapse;font-size:14px">
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">მომხმარებელი</td><td><strong>${escapeHtml(o.customer_name)}</strong></td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">ტელეფონი</td><td><a href="tel:${escapeHtml(o.phone)}">${escapeHtml(o.phone)}</a></td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">ელ. ფოსტა</td><td>${escapeHtml(o.user_email)}</td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">მისამართი</td><td>${escapeHtml(o.address)}</td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">პროდუქტი</td><td>${escapeHtml(o.product_title)}</td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">თანხა</td><td><strong>${money(o.amount)}</strong></td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">გადახდა</td><td>${PAYMENT_LABEL[o.payment_method] || "—"}</td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">მონტაჟი</td><td>${o.needs_install ? "დიახ" : "არა"}</td></tr>
    <tr><td style="padding:4px 14px 4px 0;color:#64748b">პირადი №</td><td>${escapeHtml(o.personal_id || "—")}</td></tr>
  </table>
</body></html>`;
}

async function sendMail(apiKey: string, from: string, to: string, subject: string, html: string) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], subject, html }),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

    try {
        const apiKey = Deno.env.get("RESEND_API_KEY");
        if (!apiKey) return json({ error: "RESEND_API_KEY is not configured" }, 500);

        // Secrets pasted in the dashboard easily pick up stray quotes, spaces or a
        // leading "=" — clean them, and fall back to the shop address rather than
        // losing the notification if what is left still isn't an address.
        const clean = (v: string | undefined) => (v || "").trim().replace(/^=\s*/, "").replace(/^["']|["']$/g, "").trim();
        const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
        const from = clean(Deno.env.get("MAIL_FROM")) || "Climate Comfort <onboarding@resend.dev>";
        const notifyRaw = clean(Deno.env.get("ORDER_NOTIFY_TO"));
        const notifyTo = EMAIL_RE.test(notifyRaw) ? notifyRaw : SHOP.email;

        const { orderId } = await req.json();
        if (!orderId || !UUID_RE.test(String(orderId))) return json({ error: "a valid orderId is required" }, 400);

        // Service role: the order row (and the recipient address) comes from the
        // database, never from the request body.
        const { order, error } = await fetchOrder(String(orderId));
        if (error) return json({ error }, 500);
        if (!order) return json({ error: "order not found" }, 404);

        const results: Record<string, unknown> = {};

        if (order.user_email) {
            const r = await sendMail(apiKey, from, order.user_email,
                `შეკვეთა ORD-${order.order_no} მიღებულია — Climate Comfort`, customerHtml(order));
            results.customer = r.ok ? "sent" : `failed (${r.status}): ${r.body}`;
        }

        // The shop copy must never block the customer's confirmation
        try {
            const r = await sendMail(apiKey, from, notifyTo,
                `ახალი შეკვეთა ORD-${order.order_no} — ${order.customer_name}`, shopHtml(order));
            results.shop = r.ok ? "sent" : `failed (${r.status}): ${r.body}`;
        } catch (e) {
            results.shop = "failed: " + String(e);
        }

        return json({ ok: true, orderNo: order.order_no, results });
    } catch (err) {
        return json({ error: String(err) }, 500);
    }
});

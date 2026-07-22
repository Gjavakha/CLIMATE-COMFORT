// ============================================================================
// Climate Comfort — Admin dashboard
// Auth: Supabase email+password. Access: email must exist in admin_emails
// (enforced by RLS on the server — this UI only mirrors that verdict).
// ============================================================================

let allOrders = [];
let statusFilter = "all";
let searchTerm = "";
let signupMode = false;
let refreshTimer = null;

const $ = id => document.getElementById(id);

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    if (!sbClient) {
        showAuthError("Cannot reach the database — check supabase-config.js and your internet connection.");
        return;
    }

    bindAuthUI();
    bindDashboardUI();

    const { data: { session } } = await sbClient.auth.getSession();
    if (session) {
        enterDashboard(session.user);
    }

    sbClient.auth.onAuthStateChange((event, sess) => {
        if (event === "SIGNED_OUT") {
            stopAutoRefresh();
            $("dashboard").classList.add("hidden");
            $("denied-screen").classList.add("hidden");
            $("auth-screen").classList.remove("hidden");
        }
    });
});

// ---------------------------------------------------------------------------
// Auth screen
// ---------------------------------------------------------------------------
function bindAuthUI() {
    $("auth-switch-link").addEventListener("click", (e) => {
        e.preventDefault();
        signupMode = !signupMode;
        $("auth-title").innerText = signupMode ? "Create account" : "Sign in";
        $("auth-submit").innerHTML = signupMode
            ? '<i class="fa-solid fa-user-plus"></i> Create account'
            : '<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign in';
        $("auth-switch-label").innerText = signupMode ? "Already have an account?" : "First time here?";
        $("auth-switch-link").innerText = signupMode ? "Sign in" : "Create an account";
        $("auth-hint").innerText = signupMode
            ? "Create the account for your admin email. If the email is not on the admin list, you can register but not enter."
            : "Admin access only. Use the email that is on the admin list.";
        hideAuthMessages();
    });

    $("auth-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        hideAuthMessages();

        const email = $("auth-email").value.trim();
        const password = $("auth-password").value;
        if (!email || password.length < 6) {
            showAuthError("Enter your email and a password of at least 6 characters.");
            return;
        }

        const btn = $("auth-submit");
        btn.disabled = true;

        try {
            if (signupMode) {
                const { data, error } = await sbClient.auth.signUp({
                    email, password,
                    options: { emailRedirectTo: location.href }
                });
                if (error) { showAuthError(error.message); return; }
                if (data.session) {
                    enterDashboard(data.user); // email confirmation disabled → straight in
                } else {
                    showAuthNotice("Account created. Check your inbox and click the confirmation link, then come back and sign in.");
                }
            } else {
                const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
                if (error) { showAuthError(error.message); return; }
                enterDashboard(data.user);
            }
        } finally {
            btn.disabled = false;
        }
    });
}

function showAuthError(msg) { const el = $("auth-error"); el.innerText = msg; el.classList.remove("hidden"); }
function showAuthNotice(msg) { const el = $("auth-notice"); el.innerText = msg; el.classList.remove("hidden"); }
function hideAuthMessages() { $("auth-error").classList.add("hidden"); $("auth-notice").classList.add("hidden"); }

// ---------------------------------------------------------------------------
// Admin gate + dashboard lifecycle
// ---------------------------------------------------------------------------
async function enterDashboard(user) {
    // The real gate is RLS; this check just decides which screen to show.
    const { data, error } = await sbClient
        .from("admin_emails")
        .select("email")
        .ilike("email", user.email);

    if (error || !data || data.length === 0) {
        $("auth-screen").classList.add("hidden");
        $("dashboard").classList.add("hidden");
        $("denied-email").innerText = user.email;
        $("denied-screen").classList.remove("hidden");
        return;
    }

    $("auth-screen").classList.add("hidden");
    $("denied-screen").classList.add("hidden");
    $("dashboard").classList.remove("hidden");
    $("admin-email").innerText = user.email;

    await loadOrders();
    startAutoRefresh();
}

function bindDashboardUI() {
    $("logout-btn").addEventListener("click", () => sbClient.auth.signOut());
    $("denied-logout").addEventListener("click", () => sbClient.auth.signOut());

    $("refresh-btn").addEventListener("click", loadOrders);

    $("status-chips").addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        statusFilter = chip.getAttribute("data-status");
        document.querySelectorAll("#status-chips .chip").forEach(c => c.classList.toggle("active", c === chip));
        renderOrders();
    });

    $("order-search").addEventListener("input", (e) => {
        searchTerm = e.target.value.trim().toLowerCase();
        renderOrders();
    });

    // Row interactions (expand, status changes) via delegation
    $("orders-body").addEventListener("click", (e) => {
        if (e.target.closest(".pill-select")) return; // let the selects be selects
        const row = e.target.closest("tr.order-row");
        if (!row) return;
        const detail = row.nextElementSibling;
        if (detail && detail.classList.contains("detail-row")) {
            detail.classList.toggle("hidden");
        }
    });

    $("orders-body").addEventListener("change", async (e) => {
        const sel = e.target.closest(".pill-select");
        if (!sel) return;
        const orderId = sel.getAttribute("data-order");
        const field = sel.getAttribute("data-field");
        const value = sel.value;

        sel.classList.add("saving");
        const { error } = await sbClient.from("orders").update({ [field]: value }).eq("id", orderId);
        sel.classList.remove("saving");

        if (error) {
            alert("Could not save the change: " + error.message);
            await loadOrders();
            return;
        }
        const order = allOrders.find(o => o.id === orderId);
        if (order) order[field] = value;
        sel.className = `pill-select ${pillClass(field, value)}`;
        renderStats();
    });
}

function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(loadOrders, 60000);
}
function stopAutoRefresh() {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
async function loadOrders() {
    const btn = $("refresh-btn");
    btn.classList.add("spinning");
    try {
        const { data, error } = await sbClient
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(500);

        if (error) {
            console.warn("orders load failed:", error.message);
            return;
        }
        allOrders = data || [];
        renderStats();
        renderOrders();
    } finally {
        btn.classList.remove("spinning");
    }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function renderStats() {
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const todayCount = allOrders.filter(o => new Date(o.created_at) >= today).length;
    const pending = allOrders.filter(o => o.payment_status === "pending" && o.status !== "cancelled").length;
    const revenue = allOrders
        .filter(o => o.payment_status === "paid")
        .reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const financing = allOrders.filter(o => o.order_type === "financing").length;

    $("stat-today").innerText = todayCount;
    $("stat-pending").innerText = pending;
    $("stat-revenue").innerText = revenue.toLocaleString();
    $("stat-financing").innerText = financing;
}

function esc(s) {
    return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pillClass(field, value) {
    return field === "payment_status" ? `pay-${value}` : `st-${value}`;
}

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
        ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

const PAY_OPTIONS = ["pending", "paid", "failed", "refunded"];
const STATUS_OPTIONS = ["new", "confirmed", "delivering", "completed", "cancelled"];

function pillSelect(order, field, options) {
    const current = order[field];
    return `<select class="pill-select ${pillClass(field, current)}" data-order="${order.id}" data-field="${field}">
        ${options.map(o => `<option value="${o}" ${o === current ? "selected" : ""}>${o}</option>`).join("")}
    </select>`;
}

function renderOrders() {
    const body = $("orders-body");
    const visible = allOrders.filter(o => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false;
        if (searchTerm) {
            const hay = `${o.customer_name} ${o.phone} ${o.user_email} ${o.product_title} ${o.order_no}`.toLowerCase();
            if (!hay.includes(searchTerm)) return false;
        }
        return true;
    });

    $("empty-state").classList.toggle("hidden", visible.length > 0);
    $("empty-text").innerText = allOrders.length === 0
        ? "No orders yet. They will appear here the moment a customer checks out."
        : "Nothing matches this filter.";

    body.innerHTML = visible.map(o => `
        <tr class="order-row">
            <td class="order-no">#${o.order_no}</td>
            <td class="order-date">${fmtDate(o.created_at)}</td>
            <td>
                <div class="cust-name">${esc(o.customer_name)}</div>
                <div class="cust-phone">${esc(o.phone)}</div>
            </td>
            <td class="prod-cell">
                <div class="prod-title">${esc(o.product_title)}</div>
                ${o.needs_install ? '<span class="install-flag"><i class="fa-solid fa-screwdriver-wrench"></i> + installation</span>' : ""}
            </td>
            <td class="num amount-cell">${Number(o.amount).toLocaleString()} ₾</td>
            <td><span class="type-badge type-${o.order_type}">${o.order_type === "financing" ? "Financing" : "Standard"}</span></td>
            <td>${pillSelect(o, "payment_status", PAY_OPTIONS)}</td>
            <td>${pillSelect(o, "status", STATUS_OPTIONS)}</td>
        </tr>
        <tr class="detail-row hidden">
            <td colspan="8">
                <div class="detail-grid">
                    <div class="detail-item"><p>Email</p><p>${esc(o.user_email) || "—"}</p></div>
                    <div class="detail-item"><p>Delivery address</p><p>${esc(o.address)}</p></div>
                    <div class="detail-item"><p>Personal ID</p><p>${esc(o.personal_id) || "—"}</p></div>
                    <div class="detail-item"><p>Bank</p><p>${o.payment_method ? esc(o.payment_method).toUpperCase() : "—"}</p></div>
                    <div class="detail-item"><p>Installation</p><p>${o.needs_install ? "Requested (paid on site)" : "No"}</p></div>
                </div>
            </td>
        </tr>
    `).join("");
}

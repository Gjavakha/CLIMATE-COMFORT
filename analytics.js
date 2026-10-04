// ============================================================================
// analytics.js — Google Analytics 4 + Meta Pixel, behind cookie consent.
//
// Nothing here loads until the visitor accepts analytics cookies, because the
// privacy policy promises exactly that: essential cookies always, analytics
// and marketing only with consent. The choice is remembered in localStorage
// and can be changed again from the footer link.
//
// ⚠ SETUP: fill in the two IDs below. While an ID is empty its script is
// simply never loaded — the site keeps working, it just isn't measured.
//   • GA4:        analytics.google.com → Admin → Data Streams → "G-XXXXXXXXXX"
//   • Meta Pixel: business.facebook.com → Events Manager → a 15-16 digit ID
// ============================================================================

const ANALYTICS_CONFIG = {
    ga4MeasurementId: "",   // e.g. "G-XXXXXXXXXX"
    metaPixelId: ""         // e.g. "123456789012345"
};

const CONSENT_KEY = "cc_cookie_consent";   // "granted" | "denied"

function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (err) { return null; }
}

function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (err) { /* private mode */ }
}

function analyticsLang() {
    // app.js owns the language; fall back to KA before it has initialised
    return (window.state && window.state.currentLang) || localStorage.getItem("lang") || "ka";
}

// ---------------------------------------------------------------------------
// Loaders — each is a no-op when its ID is blank, and runs at most once
// ---------------------------------------------------------------------------
let loaded = false;

function loadGA4() {
    const id = ANALYTICS_CONFIG.ga4MeasurementId;
    if (!id) return;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    // anonymize_ip keeps the policy's "we minimise what we collect" honest
    window.gtag("config", id, { anonymize_ip: true });
}

function loadMetaPixel() {
    const id = ANALYTICS_CONFIG.metaPixelId;
    if (!id) return;

    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    window.fbq("init", id);
    window.fbq("track", "PageView");
}

function loadTrackers() {
    if (loaded) return;
    loaded = true;
    loadGA4();
    loadMetaPixel();
}

// ---------------------------------------------------------------------------
// Public tracking helpers — safe to call whether or not consent was given
// ---------------------------------------------------------------------------

// Hash routing means no real page loads, so views are reported by hand
function trackPageView(path) {
    if (getConsent() !== "granted") return;
    if (window.gtag) window.gtag("event", "page_view", { page_path: path || location.hash || "/" });
    if (window.fbq) window.fbq("track", "PageView");
}

function trackViewItem(product) {
    if (getConsent() !== "granted" || !product) return;
    const name = typeof product.title === "object" ? product.title.ka : product.title;
    if (window.gtag) {
        window.gtag("event", "view_item", {
            currency: "GEL",
            value: product.price,
            items: [{ item_id: String(product.id), item_name: name, item_brand: product.brand, price: product.price }]
        });
    }
    if (window.fbq) {
        window.fbq("track", "ViewContent", {
            content_ids: [String(product.id)], content_name: name, content_type: "product",
            value: product.price, currency: "GEL"
        });
    }
}

function trackBeginCheckout(product) {
    if (getConsent() !== "granted" || !product) return;
    const name = typeof product.title === "object" ? product.title.ka : product.title;
    if (window.gtag) {
        window.gtag("event", "begin_checkout", {
            currency: "GEL", value: product.price,
            items: [{ item_id: String(product.id), item_name: name, item_brand: product.brand, price: product.price }]
        });
    }
    if (window.fbq) {
        window.fbq("track", "InitiateCheckout", {
            content_ids: [String(product.id)], content_type: "product",
            value: product.price, currency: "GEL"
        });
    }
}

function trackPurchase(product, orderRef) {
    if (getConsent() !== "granted" || !product) return;
    const name = typeof product.title === "object" ? product.title.ka : product.title;
    if (window.gtag) {
        window.gtag("event", "purchase", {
            transaction_id: orderRef, currency: "GEL", value: product.price,
            items: [{ item_id: String(product.id), item_name: name, item_brand: product.brand, price: product.price }]
        });
    }
    if (window.fbq) {
        window.fbq("track", "Purchase", {
            content_ids: [String(product.id)], content_type: "product",
            value: product.price, currency: "GEL"
        });
    }
}

function trackLead(kind) {
    if (getConsent() !== "granted") return;
    if (window.gtag) window.gtag("event", "generate_lead", { method: kind });
    if (window.fbq) window.fbq("track", "Lead", { content_name: kind });
}

// ---------------------------------------------------------------------------
// Consent banner
// ---------------------------------------------------------------------------
const CONSENT_TEXT = {
    ka: {
        body: "ვიყენებთ cookie-ს საიტის მუშაობისთვის და — თქვენი თანხმობით — სტატისტიკისა და რეკლამის ეფექტურობის გასაზომად.",
        more: "დაწვრილებით",
        accept: "თანხმობა",
        decline: "მხოლოდ აუცილებელი"
    },
    en: {
        body: "We use cookies to run the site and — with your consent — to measure traffic and advertising performance.",
        more: "Learn more",
        accept: "Accept",
        decline: "Essential only"
    }
};

function showConsentBanner() {
    if (document.getElementById("cookie-consent")) return;
    const txt = CONSENT_TEXT[analyticsLang()] || CONSENT_TEXT.ka;

    const bar = document.createElement("div");
    bar.id = "cookie-consent";
    bar.className = "cookie-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookies");
    bar.innerHTML = `
        <p class="cookie-consent-text">${txt.body} <a href="#privacy">${txt.more}</a></p>
        <div class="cookie-consent-actions">
            <button type="button" class="btn-cookie-decline" id="cookie-decline">${txt.decline}</button>
            <button type="button" class="btn-cookie-accept" id="cookie-accept">${txt.accept}</button>
        </div>
    `;
    document.body.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add("visible"));

    document.getElementById("cookie-accept").addEventListener("click", () => {
        setConsent("granted");
        loadTrackers();
        closeConsentBanner();
    });
    document.getElementById("cookie-decline").addEventListener("click", () => {
        setConsent("denied");
        closeConsentBanner();
    });
}

function closeConsentBanner() {
    const bar = document.getElementById("cookie-consent");
    if (!bar) return;
    bar.classList.remove("visible");
    setTimeout(() => bar.remove(), 300);
}

// Lets the visitor change their mind later (footer link)
function openCookieSettings() {
    try { localStorage.removeItem(CONSENT_KEY); } catch (err) { /* ignore */ }
    loaded = false;
    showConsentBanner();
}

document.addEventListener("DOMContentLoaded", () => {
    const consent = getConsent();
    if (consent === "granted") {
        loadTrackers();
    } else if (consent !== "denied") {
        // Give the page a moment to paint before covering part of it
        setTimeout(showConsentBanner, 1200);
    }

    // Report each hash route as its own view
    window.addEventListener("hashchange", () => trackPageView(location.hash));

    const settingsLink = document.getElementById("cookie-settings-link");
    if (settingsLink) {
        settingsLink.addEventListener("click", (e) => {
            e.preventDefault();
            openCookieSettings();
        });
    }
});

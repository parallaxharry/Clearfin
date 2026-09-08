import { ANALYTICS_CONSENT_KEY, readConsent } from "./trackingConsent";
import { reportTrackingFailure } from "./trackingDiagnostics";

let script: HTMLScriptElement | null = null;
let ready = false;
let active = false;
let lastPage: string | null = null;

function cleanUrl(value: string) {
  try { const url = new URL(value); return `${url.origin}${url.pathname}`; } catch { return ""; }
}

function campaignFields() {
  // Keep ordinary campaign attribution without forwarding arbitrary URL queries.
  // Campaign labels must never contain personal/profile data.
  const params = new URL(window.location.href).searchParams;
  const fields: Record<string, string> = {};
  for (const [query, field] of Object.entries({
    utm_source: "campaign_source", utm_medium: "campaign_medium",
    utm_campaign: "campaign_name", utm_id: "campaign_id",
    utm_term: "campaign_term", utm_content: "campaign_content",
  })) {
    const value = params.get(query);
    if (value && /^[a-zA-Z0-9 _.,+\/-]{1,100}$/.test(value)) fields[field] = value;
  }
  return fields;
}

function sendPage(id: string) {
  const page = cleanUrl(window.location.href);
  if (lastPage === page) return;
  const context = {
    page_location: page,
    page_referrer: lastPage ?? cleanUrl(document.referrer),
    page_title: document.title,
  };
  window.gtag?.("set", context);
  window.gtag?.("event", "page_view", { ...context, send_to: id });
  lastPage = page;
}

function allowed() {
  return typeof window !== "undefined"
    && ["clearfin.ca", "www.clearfin.ca"].includes(window.location.hostname)
    && readConsent(ANALYTICS_CONSENT_KEY) === "granted";
}

function clearCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", window.location.hostname, "clearfin.ca", ".clearfin.ca"]) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
    }
  }
}

export function syncGoogleAnalytics(id: string) {
  if (typeof window === "undefined") return;
  const permitted = allowed();
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = !permitted;
  if (!permitted) {
    // Google's documented opt-out disables collection. Do not send a consent
    // update here: an already-loaded SDK can otherwise send cookieless pings.
    active = false;
    lastPage = null;
    clearCookies();
    return;
  }

  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    // Google's supplied queue format uses an Arguments object per command.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied",
    });
    window.gtag("js", new Date());
  }
  if (ready) {
    if (!active) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      // Next owns page views. Keep Enhanced Measurement history page views off
      // in the GA property; send_page_view alone does not disable that setting.
      window.gtag("config", id, {
        ...campaignFields(),
        send_page_view: false,
        page_location: cleanUrl(window.location.href),
        page_referrer: cleanUrl(document.referrer),
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      active = true;
    }
    sendPage(id);
    return;
  }
  if (script) return;
  script = document.createElement("script");
  script.id = "clearfin-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.onload = () => { ready = true; syncGoogleAnalytics(id); };
  script.onerror = () => {
    script?.remove();
    script = null;
    reportTrackingFailure("google", "load_failed");
  };
  document.head.appendChild(script);
}

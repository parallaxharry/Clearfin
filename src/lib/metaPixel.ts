import { MARKETING_CONSENT_KEY, readConsent } from "./trackingConsent";

export const META_PIXEL_ID = "1620418306380365";

type PixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: PixelFunction;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: PixelFunction;
    _fbq?: PixelFunction;
  }
}

let script: HTMLScriptElement | null = null;
let initialized = false;
let ready = false;
let lastPage: string | null = null;

function mayTrack() {
  return typeof window !== "undefined"
    && ["clearfin.ca", "www.clearfin.ca"].includes(window.location.hostname)
    && readConsent(MARKETING_CONSENT_KEY) === "granted";
}

function clearMarketingCookies() {
  // Remove host-only and parent-domain copies created by Meta's browser library.
  for (const name of ["_fbp", "_fbc"]) {
    for (const domain of ["", window.location.hostname, "clearfin.ca", ".clearfin.ca"]) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
    }
  }
}

function sendCurrentPage() {
  if (!ready || !mayTrack() || !window.fbq) return;
  const pathname = window.location.pathname;
  if (lastPage === pathname) return;
  window.fbq("consent", "grant");
  window.fbq("trackSingle", META_PIXEL_ID, "PageView");
  lastPage = pathname;
  if (/^\/credit-cards\/[^/]+\/?$/.test(pathname)) {
    window.fbq("trackSingle", META_PIXEL_ID, "ViewContent");
  }
}

export function syncMetaPixel() {
  if (typeof window === "undefined") return;
  if (!mayTrack()) {
    window.fbq?.("consent", "revoke");
    lastPage = null;
    clearMarketingCookies();
    return;
  }

  if (!initialized) {
    // Meta's supplied base-code queue, adapted to TypeScript. Load the official
    // library only after an explicit advertising choice, including returning users.
    if (!window.fbq) {
      const fbq = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
      } as PixelFunction;
      fbq.queue = [];
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      window.fbq = fbq;
      window._fbq = window._fbq || fbq;
    }
    // Next's route observer below owns PageView. Meta otherwise emits an
    // additional PageView on pushState even with automatic configuration off.
    window.fbq.disablePushState = true;
    window.fbq("consent", "revoke");
    // Manual events only: no automatic button/form/metadata collection or
    // advanced-matching contact details from ClearFin's financial tools.
    window.fbq("set", "autoConfig", false, META_PIXEL_ID);
    window.fbq("init", META_PIXEL_ID);
    initialized = true;
  }

  if (ready) {
    sendCurrentPage();
    return;
  }
  if (script) return;

  script = document.createElement("script");
  script.id = "clearfin-meta-pixel";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.onload = () => {
    ready = true;
    // Consent can change while the SDK downloads. Never queue page or action
    // events before it is ready, or replay actions that happened before consent.
    if (mayTrack()) sendCurrentPage();
    else window.fbq?.("consent", "revoke");
  };
  script.onerror = () => {
    script?.remove();
    script = null;
  };
  document.head.appendChild(script);
}

// Fixed event names and no form payloads keep email, income, credit score,
// spending amounts, and recommendation values out of advertising events.
export function trackMetaAction(event: "Lead" | "ApplyClick" | "CalculatorCompleted" | "CardComparison") {
  if (!ready || !mayTrack()) return;
  window.fbq?.(event === "Lead" ? "trackSingle" : "trackSingleCustom", META_PIXEL_ID, event);
}

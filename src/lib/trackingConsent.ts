export type ConsentChoice = "granted" | "denied";

export const ANALYTICS_CONSENT_KEY = "clearfin-analytics-consent";
export const MARKETING_CONSENT_KEY = "clearfin-marketing-consent";
export const CONSENT_CHANGED_EVENT = "clearfin-consent-changed";
export const OPEN_CONSENT_EVENT = "clearfin-open-consent";

// Keep choices usable for this visit when the browser blocks local storage.
const sessionChoices: Record<string, ConsentChoice> = {};

export function readConsent(key: string): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  if (sessionChoices[key]) return sessionChoices[key];
  try {
    const value = window.localStorage.getItem(key);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return sessionChoices[key] ?? null;
  }
}

export function saveConsent(analytics: ConsentChoice, marketing: ConsentChoice) {
  for (const [key, choice] of [
    [ANALYTICS_CONSENT_KEY, analytics],
    [MARKETING_CONSENT_KEY, marketing],
  ] as const) {
    try {
      window.localStorage.setItem(key, choice);
      delete sessionChoices[key];
    } catch {
      // The choice still applies in this tab when persistence is unavailable.
      sessionChoices[key] = choice;
    }
  }
  window.gtag?.("consent", "update", { analytics_storage: analytics });
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

export function subscribeToConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === MARKETING_CONSENT_KEY || event.key === ANALYTICS_CONSENT_KEY) {
      window.gtag?.("consent", "update", {
        analytics_storage: readConsent(ANALYTICS_CONSENT_KEY) ?? "denied",
      });
      onChange();
    }
  };
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

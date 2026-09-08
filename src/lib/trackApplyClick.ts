import { trackMetaAction } from "./metaPixel";
import { ANALYTICS_CONSENT_KEY, readConsent } from "./trackingConsent";
import { reportTrackingFailure } from "./trackingDiagnostics";

// Outbound intent, not an application, approval or commission. Never delay the link.
export function trackApplyClick(cardId: string) {
  trackMetaAction("ApplyClick");
  if (readConsent(ANALYTICS_CONSENT_KEY) !== "granted") return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  void fetch("/api/track-click", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-ClearFin-Analytics-Consent": "granted" },
    body: JSON.stringify({ cardId }),
    credentials: "omit",
    referrerPolicy: "no-referrer",
    keepalive: true,
    signal: controller.signal,
  }).then(async (response) => {
    if (!response.ok || (await response.json()).ok !== true) throw new Error("delivery_failed");
  }).catch(() => reportTrackingFailure("click", "delivery_failed"))
    .finally(() => clearTimeout(timeout));
}

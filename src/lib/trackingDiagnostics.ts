// Local diagnostics only: never include form values, URLs, card IDs or raw errors.
export function reportTrackingFailure(channel: "google" | "meta" | "click", reason: "load_failed" | "delivery_failed") {
  console.warn(`[ClearFin tracking] ${channel}: ${reason}`);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("clearfin-tracking-diagnostic", { detail: { channel, reason } }));
  }
}

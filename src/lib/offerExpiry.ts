export type OfferExpiryStatus = "undated" | "current" | "expired" | "invalid";

const calendar = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit",
});

/**
 * Date-only issuer deadlines remain valid through that Canadian calendar day.
 * Eastern time is the display convention when no timezone is supplied; exact
 * issuer deadlines still govern. Timestamp deadlines must supply an offset.
 * Evaluate at server render/revalidation time, never against a research date.
 */
export function offerExpiryStatus(end: string | null | undefined, now = Date.now()): OfferExpiryStatus {
  if (!end?.trim()) return "undated";
  if (!Number.isFinite(now)) return "invalid";
  const value = end.trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const datePart = value.slice(0, 10);
  const parsedDay = Date.parse(`${datePart}T00:00:00Z`);
  // Reject dates that Date.parse rolls into another month (e.g. February 30).
  if (!Number.isFinite(parsedDay) || new Date(parsedDay).toISOString().slice(0, 10) !== datePart) return "invalid";
  if (dateOnly) {
    const parts = calendar.formatToParts(now);
    const part = (type: string) => parts.find(p => p.type === type)?.value;
    const today = `${part("year")}-${part("month")}-${part("day")}`;
    return datePart < today ? "expired" : "current";
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return "invalid";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "invalid";
  return timestamp <= now ? "expired" : "current";
}

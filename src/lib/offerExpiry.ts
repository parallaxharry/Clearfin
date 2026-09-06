/** Date-only offers remain available through their stated day in Eastern Time.
 * Explicitly zoned timestamps retain their exact instant. Missing/unparseable
 * dates remain unknown, not proof that an offer is current (see CF-26).
 */
export const OFFER_TIME_ZONE = "America/Toronto";

const easternDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: OFFER_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
});

export function isOfferExpired(endDate: string | null | undefined, now = new Date()): boolean {
  if (!endDate?.trim()) return false;
  const value = endDate.trim();
  // Do not let the server's local time zone reinterpret timestamp deadlines.
  if (/T\d{2}:\d{2}.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) && now.getTime() >= timestamp;
  }

  // Catalogue dates use ISO dates or English month names, without a time.
  // Reject ambiguous numeric dates and unzoned timestamps rather than guessing.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) && !/^[A-Za-z]+ \d{1,2},? \d{4}$/.test(value)) return false;
  const timestamp = Date.parse(`${value} 00:00:00 GMT`);
  if (!Number.isFinite(timestamp)) return false;
  const deadlineDay = new Date(timestamp).toISOString().slice(0, 10);
  // Date.parse normalizes impossible ISO dates (e.g. February 30); reject them.
  if (/^\d{4}-/.test(value) && deadlineDay !== value) return false;
  const parts = easternDate.formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  return deadlineDay < today;
}

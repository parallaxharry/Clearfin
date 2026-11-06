/**
 * FinlyWealth sub-affiliate disclosure — the ONE place this wording lives.
 *
 * Agreement §11 / §11(a): disclose on every page, post or email with a
 * FinlyWealth link, BEFORE or BESIDE the link (never only in a footer or on
 * the About page). §17(d): say that products change. §18: when a cash rebate
 * is mentioned, say it is paid by FinlyWealth.
 *
 * AFFILIATE_DISCLOSURE is the "From the agreement" wording chosen in the
 * FinlyWealth link hub on 2026-10-31 — copy it verbatim; do not reword.
 * Render this above the first Apply link on every surface that has one.
 */

export const AFFILIATE_DISCLOSURE =
  "⚠ Disclaimer: We may earn a commission if you apply through the links on this page. Any results described are from our own personal experience — individual results vary, and card terms and rewards pricing change over time, so confirm current details with the issuer before applying.";

export const REBATE_DISCLOSURE =
  "Cash rebates are paid by FinlyWealth, not by the bank or card issuer, and have their own terms.";

interface AffiliateDisclosureProps {
  /** Add the FinlyWealth cash-rebate sentence (any surface showing a rebate badge). */
  rebates?: boolean;
  /** Smaller type for modals and tight panels. */
  compact?: boolean;
  className?: string;
}

export default function AffiliateDisclosure({
  rebates = false,
  compact = false,
  className = "",
}: AffiliateDisclosureProps) {
  return (
    <aside
      className={`affiliate-disclosure${compact ? " is-compact" : ""}${className ? ` ${className}` : ""}`}
      aria-label="Affiliate disclosure"
    >
      <p>
        {AFFILIATE_DISCLOSURE}
        {rebates ? ` ${REBATE_DISCLOSURE}` : null}
      </p>
      {compact ? null : (
        <p className="affiliate-disclosure-more">
          Commissions don&rsquo;t change calculated reward values or calculator rankings; homepage
          featured placement is a separate commercial selection.{" "}
          <a href="/disclosures">How ClearFin makes money</a>
        </p>
      )}
    </aside>
  );
}

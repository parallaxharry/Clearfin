import { isFinlyWealthApplicationUrl } from "@/lib/finlyRebates";

/**
 * Apply-button label and rel for a card's application link.
 *
 * FinlyWealth Program links open FinlyWealth's page first (the reader applies
 * from there), so the label must not claim it goes straight to the issuer.
 *
 * FinlyWealth agreement §7(d): never mask referring-URL information, so
 * affiliate links must NOT carry rel="noreferrer". "sponsored" marks them as
 * paid links for search engines.
 */
export function applyLabel(issuer: string, href: string | null | undefined): string {
  return isFinlyWealthApplicationUrl(href) ? "Apply via FinlyWealth" : `Apply at ${issuer}`;
}

export function applyRel(href: string | null | undefined): string {
  return isFinlyWealthApplicationUrl(href) ? "sponsored noopener" : "noopener noreferrer";
}

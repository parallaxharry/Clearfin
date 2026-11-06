/**
 * Active FinlyWealth cash rebates, keyed by card_catalog id.
 * Source: the FinlyWealth Program offers export of 2026-11-06.
 *
 * A rebate is only displayed when the card's application link is a FinlyWealth
 * Program link that lands on a FinlyWealth REBATE page — the only page where the
 * reader can actually claim it. A badge must never promise a rebate the link
 * doesn't deliver.
 */

export const FINLY_REBATES_CHECKED_AT = "November 6, 2026";

/** Site ids that differ from card_catalog ids (mirror of ID_ALIASES in cardDetail.ts). */
const CATALOG_ID_BY_SITE_ID: Record<string, string> = { cobalt: "Amex-cobalt" };

interface FinlyRebateDefinition {
  /** 0 for a promotion-only rebate: nothing shows once the promotion ends. */
  baseAmount: number;
  sourceSlug: string;
  promotionalAmount?: number;
  promotionalEndsAt?: string;
  /** When this entry was last checked, if more recent than FINLY_REBATES_CHECKED_AT. */
  checkedAt?: string;
}

export interface ActiveFinlyRebate extends FinlyRebateDefinition {
  amount: number;
  isPromotional: boolean;
}

const FINLY_REBATES: Record<string, FinlyRebateDefinition> = {
  // GENERATED from the FinlyWealth offers export ("Customer rebate", "Regular rebate",
  // "Rebate boost ends", "Rebate ends"). Regenerate from a fresh export; don't hand-edit.
  "Amex-cobalt": { baseAmount: 0, promotionalAmount: 75, promotionalEndsAt: "2026-12-31T05:00:00.000Z", sourceSlug: "amex-cobalt" },
  "amex-aeroplan": { baseAmount: 0, promotionalAmount: 150, promotionalEndsAt: "2026-12-31T05:00:00.000Z", sourceSlug: "amex-aeroplan-reserve" },
  "amex-platinum": { baseAmount: 0, promotionalAmount: 150, promotionalEndsAt: "2026-12-31T05:00:00.000Z", sourceSlug: "amex-platinum" },
  "bmo-ascend-world-elite": { baseAmount: 120, sourceSlug: "bmo-ascend-world-elite-mastercard" },
  "bmo-blue-world-elite": { baseAmount: 120, sourceSlug: "bmo-blue-rewards-world-elite-mastercard" },
  "bmo-cashback-world-elite": { baseAmount: 120, sourceSlug: "bmo-cashback-world-elite-mastercard" },
  "bmo-eclipse": { baseAmount: 120, promotionalAmount: 200, promotionalEndsAt: "2027-01-01T05:00:00.000Z", sourceSlug: "bmo-eclipse-visa-infinite" },
  "bmo-eclipse-privilege": { baseAmount: 50, promotionalAmount: 100, promotionalEndsAt: "2027-01-01T05:00:00.000Z", sourceSlug: "bmo-eclipse-visa-infinite-privilege" },
  "bmo-eclipse-rise": { baseAmount: 50, sourceSlug: "bmo-eclipse-rise-visa" },
  "bmo-viporter": { baseAmount: 100, sourceSlug: "bmo-viporter-mastercard" },
  "bmo-viporter-world-elite": { baseAmount: 125, sourceSlug: "bmo-viporter-world-elite-mastercard" },
  "mbna-true-line": { baseAmount: 50, sourceSlug: "mbna-true-line" },
  "nbc-world": { baseAmount: 50, sourceSlug: "national-bank-platinum-mastercard" },
  "nbc-world-elite": { baseAmount: 100, sourceSlug: "national-bank-world-elite-mastercard" },
  "neo-mastercard": { baseAmount: 50, sourceSlug: "neo-credit-card" },
  "neo-world-elite": { baseAmount: 50, sourceSlug: "neo-world-everywhere" },
  "neo-world-elite-mc": { baseAmount: 100, sourceSlug: "neo-world-elite-everywhere" },
  "rbc-westjet-world-elite": { baseAmount: 50, promotionalAmount: 140, promotionalEndsAt: "2027-01-01T05:00:00.000Z", sourceSlug: "rbc-westjet-world-elite-mastercard" },
  "scene-plus-visa": { baseAmount: 50, sourceSlug: "scotia-scene-plus-visa" },
  "scotia-gold": { baseAmount: 150, sourceSlug: "scotia-amex-gold" },
  "scotia-momentum": { baseAmount: 60, sourceSlug: "scotia-momentum-visa" },
  "scotia-momentum-infinite": { baseAmount: 100, promotionalAmount: 150, promotionalEndsAt: "2027-01-01T05:00:00.000Z", sourceSlug: "scotia-momentum-visa-infinite" },
  "scotia-passport": { baseAmount: 100, promotionalAmount: 150, promotionalEndsAt: "2027-01-01T05:00:00.000Z", sourceSlug: "scotia-passport-visa-infinite" },
  "scotia-passport-privilege": { baseAmount: 175, sourceSlug: "scotia-passport-visa-infinite-privilege" },
  "scotia-platinum": { baseAmount: 175, sourceSlug: "scotia-amex-platinum" },
  "scotiabank-amex": { baseAmount: 50, sourceSlug: "scotia-amex" },
  "scotiabank-no-fee": { baseAmount: 50, sourceSlug: "scotia-momentum-no-fee-visa" },
  "scotiabank-value": { baseAmount: 50, sourceSlug: "scotia-value-visa" },
  "simplii-cashback": { baseAmount: 50, sourceSlug: "simplii-cashback-visa" },
  "tangerine-money-back": { baseAmount: 75, sourceSlug: "tangerine-money-back" },
  "tangerine-rewards-world-elite": { baseAmount: 120, sourceSlug: "tangerine-rewards-world-elite-mastercard" },
  "tangerine-world": { baseAmount: 75, sourceSlug: "tangerine-world-mastercard" },
  "td-cashback-infinite": { baseAmount: 50, sourceSlug: "td-cashback-visa-infinite" },
  "td-first-class": { baseAmount: 50, sourceSlug: "td-first-class-travel-visa-infinite" },
};

export function isFinlyWealthApplicationUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    return /(^|\.)finlywealth\.com$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** True when a FinlyWealth link opens a rebate page, directly or via a /r/ referral link. */
export function isFinlyRebatePageUrl(url: string | null | undefined) {
  if (!isFinlyWealthApplicationUrl(url)) return false;
  try {
    const parsed = new URL(url!);
    const target = parsed.pathname.startsWith("/r/") ? parsed.searchParams.get("url") ?? "" : parsed.pathname;
    return target.startsWith("/rebates/");
  } catch {
    return false;
  }
}

export function getFinlyRebate(
  cardId: string,
  applicationUrl: string | null | undefined,
): ActiveFinlyRebate | null {
  if (!isFinlyRebatePageUrl(applicationUrl)) return null;
  const rebate = FINLY_REBATES[cardId] ?? FINLY_REBATES[CATALOG_ID_BY_SITE_ID[cardId] ?? ""];
  if (!rebate) return null;

  const promotionalEnds = rebate.promotionalEndsAt
    ? Date.parse(rebate.promotionalEndsAt)
    : Number.NaN;
  const isPromotional = Boolean(
    rebate.promotionalAmount &&
      Number.isFinite(promotionalEnds) &&
      promotionalEnds > Date.now(),
  );

  const amount = isPromotional ? rebate.promotionalAmount! : rebate.baseAmount;
  if (amount <= 0) return null;

  return { ...rebate, amount, isPromotional };
}

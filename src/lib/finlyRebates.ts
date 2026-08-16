/**
 * Active FinlyWealth cash rebates matched to ClearFin's exact card ids.
 * Verified against https://www.finlywealth.com/rebates on 2026-08-16.
 *
 * A rebate is only displayed when the card's current application URL is a
 * FinlyWealth URL. This prevents a cash promise from appearing beside a direct
 * issuer link or an unrelated card with a similar name.
 */

export const FINLY_REBATES_CHECKED_AT = "August 16, 2026";

interface FinlyRebateDefinition {
  baseAmount: number;
  sourceSlug: string;
  promotionalAmount?: number;
  promotionalEndsAt?: string;
}

export interface ActiveFinlyRebate extends FinlyRebateDefinition {
  amount: number;
  isPromotional: boolean;
}

const FINLY_REBATES: Record<string, FinlyRebateDefinition> = {
  "bmo-ascend-world-elite": { baseAmount: 120, sourceSlug: "bmo-ascend-world-elite-mastercard" },
  "bmo-blue-world-elite": { baseAmount: 120, sourceSlug: "bmo-blue-rewards-world-elite-mastercard" },
  "bmo-cashback-world-elite": { baseAmount: 120, sourceSlug: "bmo-cashback-world-elite-mastercard" },
  "bmo-eclipse-rise": { baseAmount: 50, sourceSlug: "bmo-eclipse-rise-visa" },
  "bmo-eclipse": { baseAmount: 120, sourceSlug: "bmo-eclipse-visa-infinite" },
  "bmo-eclipse-privilege": { baseAmount: 50, sourceSlug: "bmo-eclipse-visa-infinite-privilege" },
  "bmo-viporter": { baseAmount: 100, sourceSlug: "bmo-viporter-mastercard" },
  "bmo-viporter-world-elite": {
    baseAmount: 125,
    promotionalAmount: 200,
    promotionalEndsAt: "2026-11-01T04:00:00.000Z",
    sourceSlug: "bmo-viporter-world-elite-mastercard",
  },
  "mbna-rewards-platinum": { baseAmount: 50, sourceSlug: "mbna-rewards-platinum-plus-mastercard" },
  "mbna-rewards-world-elite": { baseAmount: 100, sourceSlug: "mbna-rewards-world-elite-mastercard" },
  "mbna-smart-cash": { baseAmount: 50, sourceSlug: "mbna-smart-cash-platinum-plus-mastercard" },
  "mbna-smart-cash-world": { baseAmount: 50, sourceSlug: "mbna-smart-cash-world-mastercard" },
  "mbna-true-line-gold": { baseAmount: 50, sourceSlug: "mbna-true-line-gold" },
  "mbna-true-line": { baseAmount: 50, sourceSlug: "mbna-true-line" },
  "nbc-world": { baseAmount: 50, sourceSlug: "national-bank-platinum-mastercard" },
  "nbc-world-elite": { baseAmount: 100, sourceSlug: "national-bank-world-elite-mastercard" },
  "neo-mastercard": { baseAmount: 50, sourceSlug: "neo-credit-card" },
  "neo-world-elite": { baseAmount: 50, sourceSlug: "neo-world" },
  "neo-world-elite-mc": { baseAmount: 100, sourceSlug: "neo-world-elite" },
  "rbc-westjet-world-elite": { baseAmount: 50, sourceSlug: "rbc-westjet-world-elite-mastercard" },
  "scene-plus-visa": { baseAmount: 50, sourceSlug: "scotia-scene-plus-visa" },
  "scotia-gold": { baseAmount: 150, sourceSlug: "scotia-amex-gold" },
  "scotia-momentum": { baseAmount: 60, sourceSlug: "scotia-momentum-visa" },
  "scotia-momentum-infinite": {
    baseAmount: 100,
    promotionalAmount: 150,
    promotionalEndsAt: "2026-08-31T13:00:00.000Z",
    sourceSlug: "scotia-momentum-visa-infinite",
  },
  "scotia-momentum-student": {
    baseAmount: 50,
    promotionalAmount: 100,
    promotionalEndsAt: "2026-08-31T01:22:00.000Z",
    sourceSlug: "scotia-momentum-no-fee-visa-students",
  },
  "scotia-passport": { baseAmount: 120, sourceSlug: "scotia-passport-visa-infinite" },
  "scotia-passport-privilege": { baseAmount: 175, sourceSlug: "scotia-passport-visa-infinite-privilege" },
  "scotia-platinum": {
    baseAmount: 175,
    promotionalAmount: 200,
    promotionalEndsAt: "2026-08-31T07:47:00.000Z",
    sourceSlug: "scotia-amex-platinum",
  },
  "scotiabank-amex": { baseAmount: 50, sourceSlug: "scotia-amex" },
  "scotiabank-student": {
    baseAmount: 50,
    promotionalAmount: 125,
    promotionalEndsAt: "2026-08-31T01:21:00.000Z",
    sourceSlug: "scotia-scene-plus-visa-students",
  },
  "scotiabank-value": { baseAmount: 50, sourceSlug: "scotia-value-visa" },
  "simplii-cashback": { baseAmount: 50, sourceSlug: "simplii-cashback-visa" },
  "tangerine-money-back": { baseAmount: 75, sourceSlug: "tangerine-money-back" },
  "tangerine-rewards-world-elite": { baseAmount: 120, sourceSlug: "tangerine-rewards-world-elite-mastercard" },
  "tangerine-world": { baseAmount: 75, sourceSlug: "tangerine-world-mastercard" },
  "td-cashback-infinite": {
    baseAmount: 50,
    promotionalAmount: 140,
    promotionalEndsAt: "2026-10-05T07:00:00.000Z",
    sourceSlug: "td-cashback-visa-infinite",
  },
  "td-first-class": {
    baseAmount: 50,
    promotionalAmount: 140,
    promotionalEndsAt: "2026-10-05T07:00:00.000Z",
    sourceSlug: "td-first-class-travel-visa-infinite",
  },
};

export function isFinlyWealthApplicationUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    return /(^|\.)finlywealth\.com$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function getFinlyRebate(
  cardId: string,
  applicationUrl: string | null | undefined,
): ActiveFinlyRebate | null {
  if (!applicationUrl || !isFinlyWealthApplicationUrl(applicationUrl)) return null;
  const rebate = FINLY_REBATES[cardId];
  if (!rebate) return null;

  const promotionalEnds = rebate.promotionalEndsAt
    ? Date.parse(rebate.promotionalEndsAt)
    : Number.NaN;
  const isPromotional = Boolean(
    rebate.promotionalAmount &&
      Number.isFinite(promotionalEnds) &&
      promotionalEnds > Date.now(),
  );

  return {
    ...rebate,
    amount: isPromotional ? rebate.promotionalAmount! : rebate.baseAmount,
    isPromotional,
  };
}

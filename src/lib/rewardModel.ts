import { CARDS, scoreCard, type CardDef, type SpendKey } from "./cards";
import type { CatalogDisplay } from "./cardDetail";

export const REWARD_MODEL_VERSION = "reviewed-rates-v2";
type CatalogMap = Record<string, CatalogDisplay>;
const KEYS: SpendKey[] = ["dining", "grocery", "gas", "travel", "other"];
const valid = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

/** Known reviewed corrections also work if the catalogue is unavailable. */
function correctedFallback<T extends CardDef>(card: T): T {
  const rates = { ...card.rates };
  let annualFee = card.annualFee;
  let description = card.description;
  if (card.id === "td-aeroplan" || card.id === "cibc-aeroplan-infinite") rates.travel = 0.01;
  if (card.id === "rbc-avion") rates.travel = 0.0125;
  if (card.id === "rbc-cashback-world-elite") {
    annualFee = 120;
    Object.assign(rates, { dining: 0.005, grocery: 0.02, gas: 0.01, travel: 0.005, other: 0.005 });
    description = "2% cash back on eligible groceries, 1% on eligible gas, EV charging, transit and rideshare, and 0.5% on other eligible purchases.";
  }
  return { ...card, rates, annualFee, description };
}

/** Resolve the inputs BEFORE scoring, identically for Calculator, Compare and chat.
 * Unreviewed database values cannot silently replace the existing fallback model.
 * Rates are decimal cash-equivalent returns, not point multipliers.
 */
export function withCatalog<T extends CardDef>(card: T, map: CatalogMap): T {
  const fallback = correctedFallback(card);
  const info = map[card.id];
  if (!info) return fallback;
  const model = info.calculation;
  const reviewed = Boolean(model?.researchLevel && model.reviewedAt && Number.isFinite(Date.parse(model.reviewedAt)));
  const rates = { ...fallback.rates };
  if (reviewed && model) {
    for (const key of KEYS) {
      const value = model.rates[key];
      if (valid(value) && value <= 1) rates[key] = value;
    }
  }
  return {
    ...fallback,
    rates,
    annualFee: reviewed && valid(model?.annualFee) ? model.annualFee : fallback.annualFee,
    name: info.name ?? fallback.name,
    issuer: info.issuer ?? fallback.issuer,
    img: info.img ?? fallback.img,
    badge: info.badge ?? fallback.badge,
    bankUrl: info.bankUrl ?? fallback.bankUrl,
    perks: info.rewards.length > 0 ? info.rewards : fallback.perks,
  };
}

export function getModelCards(map: CatalogMap): CardDef[] {
  return CARDS
    .filter((card) => card.id !== "td-emerald" && map[card.id]?.isActive !== false)
    .map((card) => withCatalog(card, map));
}

export function qualifiesByIncome(info: CatalogDisplay | undefined, personal: number, household: number): boolean {
  const personalMin = info?.minIncome;
  const householdMin = info?.minHouseholdIncome;
  const hasPersonal = valid(personalMin) && personalMin > 0;
  const hasHousehold = valid(householdMin) && householdMin > 0;
  // Missing thresholds are unknown; do not invent a requirement or approval claim.
  if (!hasPersonal && !hasHousehold) return true;
  return (hasPersonal && personal >= personalMin) || (hasHousehold && household >= householdMin);
}

export function rankCards(spend: Record<SpendKey, number>, map: CatalogMap) {
  return getModelCards(map)
    .map((card) => ({ ...card, netValue: scoreCard(card, spend) }))
    .sort((a, b) => b.netValue - a.netValue);
}

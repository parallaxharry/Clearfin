export type RewardKind = "cashback" | "points" | "unknown";
export type CatalogueFilters = { query: string; issuer: string; fee: string; reward: string; sort: string };
export const DEFAULT_CATALOGUE_FILTERS: CatalogueFilters = { query: "", issuer: "", fee: "", reward: "", sort: "original" };

// Classify only explicit existing catalogue wording, not merchant rates or card tier.
export function classifyReward(program: string | null, fallbackText = ""): RewardKind {
  const text = (program?.trim() || fallbackText).toLowerCase();
  if (/cash[ -]?back/.test(text)) return "cashback";
  if (/\b(points?|miles|aeroplan|avion|scene\+?|membership rewards|pc optimum|triangle rewards|bmo rewards)\b/.test(text)) return "points";
  return "unknown";
}

type FilterCard = { name: string; issuer: string; badge: string; annualFee: number | null; rewardKind: RewardKind };
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function filterCatalogue<T extends FilterCard>(cards: T[], filters: CatalogueFilters): T[] {
  const words = normalize(filters.query.trim()).split(/\s+/).filter(Boolean);
  const result = cards.filter(card => {
    const text = normalize(`${card.name} ${card.issuer} ${card.badge}`);
    const knownFee = card.annualFee !== null && Number.isFinite(card.annualFee) && card.annualFee >= 0;
    return words.every(word => text.includes(word)) && (!filters.issuer || card.issuer === filters.issuer)
      && (!filters.reward || card.rewardKind === filters.reward)
      && (!filters.fee || (filters.fee === "free" ? knownFee && card.annualFee === 0 : filters.fee === "paid" ? knownFee && card.annualFee! > 0 : !knownFee));
  });
  if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name, "en-CA"));
  if (filters.sort === "fee-asc" || filters.sort === "fee-desc") result.sort((a, b) => {
    const valid = (fee: number | null) => fee !== null && Number.isFinite(fee) && fee >= 0;
    if (!valid(a.annualFee)) return valid(b.annualFee) ? 1 : 0;
    if (!valid(b.annualFee)) return -1;
    return (a.annualFee! - b.annualFee!) * (filters.sort === "fee-desc" ? -1 : 1) || a.name.localeCompare(b.name, "en-CA");
  });
  return result;
}

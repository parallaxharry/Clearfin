import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { CARDS, type CardDef, type SpendKey } from "@/lib/cards";
import type { SearchCard, RichSearchCard } from "@/lib/searchIndex";
import { CARD_REVIEW_ENRICHMENT, type CardResearchLevel } from "@/lib/cardReviewData";

// ---------- Rich card_catalog shapes (jsonb) ----------

export interface WelcomeBonusStage {
  reward: string;
  requirement: string;
}

export interface WelcomeBonus {
  type?: string;
  headline?: string;
  stages?: WelcomeBonusStage[];
  eligibility?: string;
  offer_end_date?: string | null;
  estimated_value_cad?: number | null;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface CreditScoreRange {
  min?: number;
  max?: number;
  range_label?: string;
}

export interface CreditScore {
  note?: string;
  title?: string;
  description?: string;
  estimated_credit_score_range?: CreditScoreRange;
}

export interface EarnCapEntry {
  type?: string;
  description?: string;
}

export interface EarnCaps {
  notes?: string;
  reward_caps?: EarnCapEntry[];
}

interface CardCatalogRow {
  id: string;
  name: string | null;
  issuer: string | null;
  description: string | null;
  annual_fee: number | null;
  dining_rate: number | null;
  grocery_rate: number | null;
  gas_rate: number | null;
  travel_rate: number | null;
  other_rate: number | null;
  badge: string | null;
  color: string | null;
  img: string | null;
  bank_url: string | null;
  perks: string[] | null;
  network: string | null;
  reward_program: string | null;
  first_year_free: boolean | null;
  min_income_personal: number | null;
  min_income_household: number | null;
  purchase_apr: number | null;
  cash_advance_apr: number | null;
  balance_transfer_apr: number | null;
  additional_card_fee: number | null;
  fx_fee: number | null;
  point_value_cpp: number | null;
  welcome_bonus: WelcomeBonus | null;
  earn_caps: EarnCaps | null;
  credit_score: CreditScore | null;
  benefits: Benefit[] | null;
  insurance: Benefit[] | null;
  rewards: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  redemptions: string[] | null;
  editorial_summary: string | null;
  source_url: string | null;
  insurance_source_url: string | null;
  reviewed_at: string | null;
  research_level?: CardResearchLevel | null;
  research_note?: string | null;
}

/** Fully merged card for the detail page: card_catalog enrichment + cards.ts fallback. */
export interface CardDetail {
  id: string;
  name: string;
  issuer: string;
  description: string;
  annualFee: number;
  rates: Record<SpendKey, number>;
  badge: string;
  color: string;
  img: string;
  bankUrl: string;
  network: string | null;
  rewardProgram: string | null;
  firstYearFree: boolean | null;
  minIncomePersonal: number | null;
  minIncomeHousehold: number | null;
  purchaseApr: number | null;
  cashAdvanceApr: number | null;
  balanceTransferApr: number | null;
  additionalCardFee: number | null;
  fxFee: number | null;
  pointValueCpp: number | null;
  welcomeBonus: WelcomeBonus | null;
  earnCaps: EarnCaps | null;
  creditScore: CreditScore | null;
  benefits: Benefit[];
  insurance: Benefit[];
  rewards: string[];
  pros: string[];
  cons: string[];
  redemptions: string[];
  editorialSummary: string | null;
  sourceUrl: string | null;
  insuranceSourceUrl: string | null;
  reviewedAt: string | null;
  researchLevel: CardResearchLevel | null;
  researchNote: string | null;
}

const CARDS_BY_ID = new Map<string, CardDef>(CARDS.map((c) => [c.id, c]));

/** A few cards.ts ids differ from their card_catalog id. Resolve to the catalog id. */
const ID_ALIASES: Record<string, string> = { cobalt: "Amex-cobalt" };
const catalogId = (id: string) => ID_ALIASES[id] ?? id;

function readClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function num(...vals: (number | null | undefined)[]): number {
  for (const v of vals) if (typeof v === "number" && !Number.isNaN(v)) return v;
  return 0;
}

const INSURANCE_TERMS = /insurance|purchase (?:security|protection)|extended (?:warranty|protection)|warranty|collision damage|rental (?:car|vehicle) coverage|travel accident|baggage|trip cancellation|trip interruption|emergency medical/i;
const REDEMPTION_TERMS = /redeem|redemption|statement credit|gift card|merchandise|travel portal|transfer (?:to|partner)|pay (?:a )?bill/i;
const COST_TERMS = /annual fee|monthly fee|purchase (?:interest )?rate|cash advance|balance transfer|minimum income|income required|foreign transaction fee/i;
const EARNING_TERMS = /\b(?:earn|cash ?back|points?|miles?|avios|westjet dollars?|ct money|rewards?)\b|\b\d+(?:\.\d+)?\s?(?:x|%|¢)/i;

function sentence(value: string): string {
  const trimmed = value.trim().replace(/\s*[·•]\s*$/, "");
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function fallbackRewards(card: CardDef | undefined, perks: string[]): string[] {
  if (!card) return [];
  const explicit = perks
    .filter((perk) => EARNING_TERMS.test(perk) && !COST_TERMS.test(perk) && !INSURANCE_TERMS.test(perk) && !REDEMPTION_TERMS.test(perk))
    .map(sentence)
    .filter(Boolean);
  if (explicit.length > 0) return explicit;

  const maxRate = Math.max(...Object.values(card.rates));
  if (maxRate <= 0 || /no rewards?|without rewards?/i.test(`${card.description} ${perks.join(" ")}`)) return [];

  const labels: Record<SpendKey, string> = {
    dining: "dining",
    grocery: "groceries",
    gas: "gas and eligible transportation",
    travel: "travel",
    other: "other eligible purchases",
  };
  const grouped = new Map<number, string[]>();
  for (const [key, rate] of Object.entries(card.rates) as [SpendKey, number][]) {
    if (rate <= 0) continue;
    grouped.set(rate, [...(grouped.get(rate) ?? []), labels[key]]);
  }
  return [...grouped.entries()]
    .sort(([a], [b]) => b - a)
    .map(([rate, categories]) => `ClearFin models an estimated ${(rate * 100).toFixed(rate < 0.01 ? 2 : 1)}% return on ${categories.join(", ")}, based on the catalogue earn rate and point valuation.`);
}

function fallbackBenefits(card: CardDef | undefined, perks: string[]): Benefit[] {
  if (!card) return [];
  const benefits = perks
    .filter((perk) => !COST_TERMS.test(perk) && !INSURANCE_TERMS.test(perk) && !REDEMPTION_TERMS.test(perk) && !EARNING_TERMS.test(perk))
    .map((perk) => ({
      title: perk.trim(),
      description: "Listed in ClearFin's current card catalogue. Eligibility and issuer terms apply.",
    }));

  if (benefits.length > 0) return benefits;
  if (card.annualFee === 0) {
    return [{
      title: "No annual fee",
      description: "The current ClearFin catalogue lists a $0 annual fee for the primary card. Other transaction and service fees may still apply.",
    }];
  }
  return [];
}

function fallbackInsurance(perks: string[]): Benefit[] {
  return perks
    .filter((perk) => INSURANCE_TERMS.test(perk))
    .map((perk) => ({
      title: perk.trim(),
      description: "This coverage is listed in ClearFin's card catalogue. Confirm eligibility, limits, exclusions, and payment requirements in the issuer's current insurance certificate.",
    }));
}

function fallbackRedemptions(card: CardDef | undefined, rewardProgram: string | null, rewards: string[], perks: string[]): string[] {
  if (!card) return [];
  const explicit = perks.filter((perk) => REDEMPTION_TERMS.test(perk)).map(sentence).filter(Boolean);
  if (explicit.length > 0) return explicit;

  const value = `${card.name} ${card.issuer} ${card.description} ${rewardProgram ?? ""} ${rewards.join(" ")}`.toLowerCase();
  const maxRate = Math.max(...Object.values(card.rates));
  if (maxRate <= 0 || /no rewards?|without rewards?/.test(value)) {
    return ["This card is not currently listed with a points or cash-back redemption program; its value is primarily tied to credit access or borrowing cost."];
  }
  if (/cash ?back|cash rewards?/.test(value)) {
    return [
      "Redeem earned cash rewards using the issuer's available cash-back or statement-credit options.",
      "Minimum redemption amounts, automatic payout timing, and eligible account credits vary by issuer; confirm the current program terms before applying.",
    ];
  }
  if (/aeroplan/.test(value)) {
    return [
      "Redeem Aeroplan points for eligible Air Canada and partner-airline flights, with taxes, fees, availability, and program rules applying.",
      "Use eligible points for hotels, car rentals, merchandise, gift cards, and other options available through Aeroplan.",
    ];
  }
  if (/scene\+/.test(value)) {
    return [
      "Redeem Scene+ points with participating grocery, entertainment, dining, and retail partners.",
      "Use eligible Scene+ points toward travel booked through the program; redemption values and availability vary.",
    ];
  }
  if (/membership rewards/.test(value)) {
    return [
      "Apply eligible Membership Rewards points to card purchases or travel booked through American Express.",
      "Transfer eligible points to participating airline and hotel programs or redeem for gift cards and merchandise; ratios and values vary.",
    ];
  }
  if (/avion/.test(value)) {
    return [
      "Redeem eligible Avion points for travel, gift cards, merchandise, and participating brand offers.",
      "Depending on the Avion product, points may also be used for account credits, bills, investments, donations, or eligible loyalty transfers; values and access vary by card.",
    ];
  }
  if (/td rewards/.test(value)) {
    return [
      "Use eligible TD Rewards points for travel through Expedia for TD or other travel options available under the program.",
      "Redeem for eligible statement credits, education credits, gift cards, merchandise, and participating Shop The Mall purchases; values vary.",
    ];
  }
  if (/bmo rewards/.test(value)) {
    return [
      "Use eligible BMO Rewards points for travel, merchandise, gift cards, investments, or statement credits available through the program.",
      "Redemption values and minimums vary by option; review the current BMO Rewards terms before choosing a redemption.",
    ];
  }
  if (/aventura/.test(value)) {
    return [
      "Redeem eligible Aventura points for travel through the CIBC Rewards Centre, including flights and other available travel products.",
      "Use points for eligible statement credits, merchandise, gift cards, or financial products where offered; values vary by option.",
    ];
  }
  if (/westjet/.test(value)) {
    return [
      "Apply eligible WestJet points toward available WestJet flights and vacation packages under the current program rules.",
      "Taxes, fees, seat availability, minimums, and eligible fare requirements may apply.",
    ];
  }
  if (/pc optimum/.test(value)) {
    return ["Redeem PC Optimum points at participating stores under the program's current minimums and terms."];
  }
  if (/more rewards/.test(value)) {
    return ["Redeem More Rewards points with participating grocery, travel, gift-card, and merchandise partners; values and minimums vary."];
  }
  if (/triangle|ct money/.test(value)) {
    return ["Redeem Canadian Tire Money on eligible purchases at participating Triangle Rewards stores and partners under current program terms."];
  }
  if (/marriott bonvoy/.test(value)) {
    return ["Redeem Marriott Bonvoy points for eligible hotel stays, experiences, and participating loyalty transfers; availability and values vary."];
  }
  if (/air miles/.test(value)) {
    return ["Redeem AIR MILES through the reward options available for the cardholder's collector account; values and availability vary by option."];
  }
  return [
    "Redeem the card's rewards through the issuer's current rewards program.",
    "Available options, minimums, transfer access, and redemption values vary; confirm the current program terms before applying.",
  ];
}

/**
 * ClearFin's conservative recommendation model for cards whose issuer does not
 * publish a score threshold. This is an estimate, never an approval promise.
 */
function estimateCreditScore(
  name: string,
  annualFee: number,
  minIncomePersonal: number | null,
): CreditScore {
  const product = name.toLowerCase();
  let min = 660;
  let rangeLabel = "Good";
  let reason = "Most standard rewards cards are best approached with established good credit.";

  if (/secured|guaranteed|credit builder|credit-building/.test(product)) {
    min = 300;
    rangeLabel = "Poor or rebuilding";
    reason = "This product is positioned for credit building, rebuilding, or guaranteed/secured access.";
  } else if (/student/.test(product)) {
    min = 560;
    rangeLabel = "Fair";
    reason = "Student products commonly consider applicants with shorter or developing credit histories.";
  } else if (
    /infinite privilege|world elite privilege|private banking|centurion/.test(product) ||
    (minIncomePersonal !== null && minIncomePersonal >= 150000) ||
    annualFee >= 350
  ) {
    min = 725;
    rangeLabel = "Very Good";
    reason = "Premium privilege products generally pair high income requirements with stronger credit expectations.";
  }

  return {
    title: `ClearFin estimated recommendation: ${min}+`,
    description: reason,
    note: "Estimate only. The issuer may use a different score, credit bureau, income test, debt level, or underwriting model.",
    estimated_credit_score_range: { min, max: 900, range_label: rangeLabel },
  };
}

/** Merge a card_catalog row with the static cards.ts fallback into a CardDetail. */
function merge(row: CardCatalogRow | null, fallback: CardDef | undefined): CardDetail | null {
  if (!row && !fallback) return null;
  const id = row?.id ?? fallback!.id;
  const review = CARD_REVIEW_ENRICHMENT[fallback?.id ?? id];
  const resolvedName = row?.name ?? fallback?.name ?? id;
  const resolvedFee = review?.authoritative
    ? num(review.annualFee, row?.annual_fee, fallback?.annualFee)
    : num(row?.annual_fee, review?.annualFee, fallback?.annualFee);
  const resolvedIncome = row?.min_income_personal ?? review?.minIncomePersonal ?? null;
  const resolvedPerks = row?.perks?.length ? row.perks : fallback?.perks ?? [];
  const resolvedRewardProgram = row?.reward_program ?? null;

  const reviewRate = (key: SpendKey) => review?.rates?.[key];
  const rates: Record<SpendKey, number> = {
    dining: review?.authoritative ? num(reviewRate("dining"), row?.dining_rate, fallback?.rates.dining) : num(row?.dining_rate, reviewRate("dining"), fallback?.rates.dining),
    grocery: review?.authoritative ? num(reviewRate("grocery"), row?.grocery_rate, fallback?.rates.grocery) : num(row?.grocery_rate, reviewRate("grocery"), fallback?.rates.grocery),
    gas: review?.authoritative ? num(reviewRate("gas"), row?.gas_rate, fallback?.rates.gas) : num(row?.gas_rate, reviewRate("gas"), fallback?.rates.gas),
    travel: review?.authoritative ? num(reviewRate("travel"), row?.travel_rate, fallback?.rates.travel) : num(row?.travel_rate, reviewRate("travel"), fallback?.rates.travel),
    other: review?.authoritative ? num(reviewRate("other"), row?.other_rate, fallback?.rates.other) : num(row?.other_rate, reviewRate("other"), fallback?.rates.other),
  };

  return {
    id,
    name: resolvedName,
    issuer: row?.issuer ?? fallback?.issuer ?? "",
    description: row?.description ?? fallback?.description ?? "",
    annualFee: resolvedFee,
    rates,
    badge: row?.badge ?? fallback?.badge ?? "",
    color: row?.color ?? fallback?.color ?? "var(--accent)",
    img: row?.img ?? fallback?.img ?? "",
    bankUrl: row?.bank_url ?? fallback?.bankUrl ?? "",
    network: row?.network ?? null,
    rewardProgram: resolvedRewardProgram,
    firstYearFree: row?.first_year_free ?? null,
    minIncomePersonal: resolvedIncome,
    minIncomeHousehold: row?.min_income_household ?? review?.minIncomeHousehold ?? null,
    purchaseApr: review?.authoritative
      ? review.purchaseApr ?? row?.purchase_apr ?? null
      : row?.purchase_apr ?? review?.purchaseApr ?? null,
    cashAdvanceApr: review?.authoritative
      ? review.cashAdvanceApr ?? row?.cash_advance_apr ?? null
      : row?.cash_advance_apr ?? review?.cashAdvanceApr ?? null,
    balanceTransferApr: review?.authoritative
      ? review.balanceTransferApr ?? row?.balance_transfer_apr ?? null
      : row?.balance_transfer_apr ?? review?.balanceTransferApr ?? null,
    additionalCardFee: review?.authoritative
      ? review.additionalCardFee ?? row?.additional_card_fee ?? null
      : row?.additional_card_fee ?? review?.additionalCardFee ?? null,
    fxFee: review?.authoritative ? review.fxFee ?? row?.fx_fee ?? null : row?.fx_fee ?? review?.fxFee ?? null,
    pointValueCpp: row?.point_value_cpp ?? null,
    welcomeBonus: review?.authoritative
      ? review.welcomeBonus ?? row?.welcome_bonus ?? null
      : row?.welcome_bonus ?? review?.welcomeBonus ?? null,
    earnCaps: row?.earn_caps ?? null,
    creditScore: row?.credit_score ?? estimateCreditScore(resolvedName, resolvedFee, resolvedIncome),
    benefits: review?.authoritative && review.benefits?.length
      ? review.benefits
      : row?.benefits?.length
        ? row.benefits
        : review?.benefits?.length
          ? review.benefits
          : fallbackBenefits(fallback, resolvedPerks),
    insurance: review?.authoritative && review.insurance?.length
      ? review.insurance
      : row?.insurance?.length
        ? row.insurance
        : review?.insurance?.length
          ? review.insurance
          : fallbackInsurance(resolvedPerks),
    rewards: review?.authoritative && review.rewards?.length
      ? review.rewards
      : row?.rewards?.length
        ? row.rewards
        : review?.rewards?.length
          ? review.rewards
          : fallbackRewards(fallback, resolvedPerks),
    pros: review?.authoritative && review.pros?.length
      ? review.pros
      : row?.pros?.length
        ? row.pros
        : review?.pros ?? [],
    cons: review?.authoritative && review.cons?.length
      ? review.cons
      : row?.cons?.length
        ? row.cons
        : review?.cons ?? [],
    redemptions: review?.authoritative && review.redemptions?.length
      ? review.redemptions
      : row?.redemptions?.length
        ? row.redemptions
        : review?.redemptions?.length
          ? review.redemptions
          : fallbackRedemptions(fallback, resolvedRewardProgram, row?.rewards ?? review?.rewards ?? [], resolvedPerks),
    editorialSummary: review?.authoritative
      ? review.editorialSummary ?? row?.editorial_summary ?? null
      : row?.editorial_summary ?? review?.editorialSummary ?? null,
    sourceUrl: review?.authoritative
      ? review.sourceUrl ?? row?.source_url ?? row?.bank_url ?? fallback?.bankUrl ?? null
      : row?.source_url ?? review?.sourceUrl ?? row?.bank_url ?? fallback?.bankUrl ?? null,
    insuranceSourceUrl: review?.authoritative
      ? review.insuranceSourceUrl ?? row?.insurance_source_url ?? null
      : row?.insurance_source_url ?? review?.insuranceSourceUrl ?? null,
    reviewedAt: review?.authoritative
      ? review.reviewedAt ?? row?.reviewed_at ?? null
      : row?.reviewed_at ?? review?.reviewedAt ?? null,
    researchLevel: row?.research_level ?? review?.researchLevel ?? null,
    researchNote: row?.research_note ?? review?.researchNote ?? null,
  };
}

/**
 * Fetch one card by id: card_catalog enrichment merged with cards.ts fallback.
 * Wrapped in React cache() so generateMetadata + the page share a single DB call per render.
 */
export const getCard = cache(async (id: string): Promise<CardDetail | null> => {
  const fallback = CARDS_BY_ID.get(id);
  const supabase = readClient();

  if (!supabase) return merge(null, fallback);

  const { data, error } = await supabase
    .from("card_catalog")
    .select("*")
    .eq("id", catalogId(id))
    .maybeSingle();

  if (error) {
    console.error(`getCard(${id}) card_catalog error:`, error.message);
    return merge(null, fallback);
  }

  return merge((data as CardCatalogRow) ?? null, fallback);
});

/** Catalog display + eligibility fields for the home page (matched onto static cards by id). */
export interface CatalogDisplay {
  name: string | null;
  issuer: string | null;
  img: string | null;
  badge: string | null;
  bankUrl: string | null;
  rewards: string[];
  /** Eligibility (for the calculator's income/credit matching). null = no stated requirement. */
  minIncome: number | null;
  creditMin: number | null;
}

/**
 * Map of id → catalog display fields, for overlaying Supabase info onto the
 * home page's static cards. Returns {} when Supabase is unconfigured so the
 * site falls back to cards.ts. Cached per-request.
 */
export const getCatalogDisplayMap = cache(async (): Promise<Record<string, CatalogDisplay>> => {
  const supabase = readClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("card_catalog")
    .select("id,name,issuer,img,badge,bank_url,rewards,min_income_personal,credit_score");
  if (error || !data) {
    if (error) console.error("getCatalogDisplayMap error:", error.message);
    return {};
  }

  const map: Record<string, CatalogDisplay> = {};
  for (const r of data as Array<{
    id: string;
    name: string | null;
    issuer: string | null;
    img: string | null;
    badge: string | null;
    bank_url: string | null;
    rewards: string[] | null;
    min_income_personal: number | null;
    credit_score: CreditScore | null;
  }>) {
    const cMin = r.credit_score?.estimated_credit_score_range?.min;
    map[r.id] = {
      name: r.name,
      issuer: r.issuer,
      img: r.img,
      badge: r.badge,
      bankUrl: r.bank_url,
      rewards: r.rewards ?? [],
      minIncome: typeof r.min_income_personal === "number" ? r.min_income_personal : null,
      creditMin: typeof cMin === "number" ? cMin : null,
    };
  }

  // Mirror catalog rows under their cards.ts alias id so those cards overlay too.
  for (const [staticId, realId] of Object.entries(ID_ALIASES)) {
    if (map[realId]) map[staticId] = map[realId];
  }

  return map;
});

/** Lightweight card list for site search: cards.ts cards overlaid with catalog
 *  name/issuer/img (alias-aware). Links use cards.ts ids, which the detail route
 *  resolves. Cached; falls back to plain cards.ts when Supabase is unavailable. */
export const getSearchCards = cache(async (): Promise<SearchCard[]> => {
  const map = await getCatalogDisplayMap();
  return CARDS.map((c) => {
    const info = map[c.id];
    return {
      id: c.id,
      name: info?.name ?? c.name,
      issuer: info?.issuer ?? c.issuer,
      img: info?.img ?? c.img,
    };
  });
});

export interface CatalogListCard extends SearchCard {
  annualFee: number | null;
  badge: string;
}

/**
 * All cards in Supabase table order. This keeps the public catalogue complete
 * when a card exists in card_catalog but has not yet been added to cards.ts.
 */
export const getCatalogOrderedCards = cache(async (): Promise<CatalogListCard[]> => {
  const fallback = (): CatalogListCard[] =>
    CARDS.map((card) => ({
      id: card.id,
      name: card.name,
      issuer: card.issuer,
      img: card.img,
      annualFee: card.annualFee,
      badge: card.badge,
    }));

  const supabase = readClient();
  if (!supabase) return fallback();

  const { data, error } = await supabase
    .from("card_catalog")
    .select("id,name,issuer,img,sort_order,annual_fee,badge")
    .order("sort_order", { ascending: true });
  if (error || !data) {
    if (error) console.error("getCatalogOrderedCards error:", error.message);
    return fallback();
  }

  const staticIdByCatalogId = new Map(
    Object.entries(ID_ALIASES).map(([staticId, realId]) => [realId, staticId])
  );
  return (data as Array<{
    id: string;
    name: string | null;
    issuer: string | null;
    img: string | null;
    annual_fee: number | null;
    badge: string | null;
  }>).map((row) => ({
    id: staticIdByCatalogId.get(row.id) ?? row.id,
    name: row.name ?? row.id,
    issuer: row.issuer ?? "",
    img: row.img ?? "",
    annualFee: row.annual_fee,
    badge: row.badge ?? "",
  }));
});

/** Rich, Supabase-backed search index used by /api/search-index. */
export const getRichSearchIndex = cache(async (): Promise<RichSearchCard[]> => {
  const byId = new Map<string, RichSearchCard>();
  for (const card of CARDS) {
    byId.set(card.id, {
      id: card.id,
      name: card.name,
      issuer: card.issuer,
      img: card.img,
      annualFee: card.annualFee,
      fxFee: null,
      badge: card.badge,
      network: null,
      rewardProgram: null,
      rewards: card.perks,
      benefits: [],
      pros: [],
    });
  }

  const supabase = readClient();
  if (!supabase) return [...byId.values()];

  const { data, error } = await supabase
    .from("card_catalog")
    .select("id,name,issuer,img,badge,annual_fee,fx_fee,network,reward_program,rewards,benefits,pros");
  if (error || !data) {
    if (error) console.error("getRichSearchIndex error:", error.message);
    return [...byId.values()];
  }

  const staticIdByCatalogId = new Map(
    Object.entries(ID_ALIASES).map(([staticId, realId]) => [realId, staticId])
  );
  for (const row of data as Array<{
    id: string;
    name: string | null;
    issuer: string | null;
    img: string | null;
    badge: string | null;
    annual_fee: number | null;
    fx_fee: number | null;
    network: string | null;
    reward_program: string | null;
    rewards: string[] | null;
    benefits: Benefit[] | null;
    pros: string[] | null;
  }>) {
    const id = staticIdByCatalogId.get(row.id) ?? row.id;
    const base = byId.get(id);
    byId.set(id, {
      id,
      name: row.name ?? base?.name ?? row.id,
      issuer: row.issuer ?? base?.issuer ?? "",
      img: row.img ?? base?.img ?? "",
      annualFee: row.annual_fee ?? base?.annualFee ?? null,
      fxFee: row.fx_fee,
      badge: row.badge ?? base?.badge ?? "",
      network: row.network,
      rewardProgram: row.reward_program,
      rewards: row.rewards?.length ? row.rewards : base?.rewards ?? [],
      benefits: (row.benefits ?? []).map((benefit) => ({
        title: benefit.title ?? "",
        description: benefit.description ?? "",
      })),
      pros: row.pros ?? [],
    });
  }

  return [...byId.values()];
});

/** All card ids for generateStaticParams — union of card_catalog and static cards.ts. */
export async function getAllCardIds(): Promise<string[]> {
  const staticIds = CARDS.map((c) => c.id);
  const supabase = readClient();
  if (!supabase) return staticIds;

  const { data, error } = await supabase.from("card_catalog").select("id");
  if (error || !data) {
    console.error("getAllCardIds card_catalog error:", error?.message);
    return staticIds;
  }

  const ids = new Set(staticIds);
  for (const row of data as { id: string }[]) ids.add(row.id);
  return [...ids];
}

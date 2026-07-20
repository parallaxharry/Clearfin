import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { CARDS, type CardDef, type SpendKey } from "@/lib/cards";
import type { SearchCard, RichSearchCard } from "@/lib/searchIndex";

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
  network: string | null;
  reward_program: string | null;
  first_year_free: boolean | null;
  min_income_personal: number | null;
  min_income_household: number | null;
  purchase_apr: number | null;
  fx_fee: number | null;
  point_value_cpp: number | null;
  welcome_bonus: WelcomeBonus | null;
  earn_caps: EarnCaps | null;
  credit_score: CreditScore | null;
  benefits: Benefit[] | null;
  rewards: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
}

/** Fully merged card for the detail page: card_catalog enrichment + cards.ts fallback. */
export interface CardDetail {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  rates: Record<SpendKey, number>;
  badge: string;
  color: string;
  img: string;
  bankUrl: string;
  network: string | null;
  rewardProgram: string | null;
  firstYearFree: boolean | null;
  feeNote: string | null;
  minIncomePersonal: number | null;
  minIncomeHousehold: number | null;
  purchaseApr: number | null;
  fxFee: number | null;
  pointValueCpp: number | null;
  welcomeBonus: WelcomeBonus | null;
  earnCaps: EarnCaps | null;
  creditScore: CreditScore | null;
  benefits: Benefit[];
  rewards: string[];
  pros: string[];
  cons: string[];
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

/** Merge a card_catalog row with the static cards.ts fallback into a CardDetail. */
function merge(row: CardCatalogRow | null, fallback: CardDef | undefined): CardDetail | null {
  if (!row && !fallback) return null;
  const id = row?.id ?? fallback!.id;

  const rates: Record<SpendKey, number> = {
    dining: num(row?.dining_rate, fallback?.rates.dining),
    grocery: num(row?.grocery_rate, fallback?.rates.grocery),
    gas: num(row?.gas_rate, fallback?.rates.gas),
    travel: num(row?.travel_rate, fallback?.rates.travel),
    other: num(row?.other_rate, fallback?.rates.other),
  };

  return {
    id,
    name: row?.name ?? fallback?.name ?? id,
    issuer: row?.issuer ?? fallback?.issuer ?? "",
    annualFee: num(row?.annual_fee, fallback?.annualFee),
    rates,
    badge: row?.badge ?? fallback?.badge ?? "",
    color: row?.color ?? fallback?.color ?? "var(--accent)",
    img: row?.img ?? fallback?.img ?? "",
    bankUrl: row?.bank_url ?? fallback?.bankUrl ?? "",
    network: row?.network ?? null,
    rewardProgram: row?.reward_program ?? null,
    firstYearFree: row?.first_year_free ?? null,
    feeNote: fallback?.feeNote ?? null,
    minIncomePersonal: row?.min_income_personal ?? null,
    minIncomeHousehold: row?.min_income_household ?? null,
    purchaseApr: row?.purchase_apr ?? null,
    fxFee: row?.fx_fee ?? null,
    pointValueCpp: row?.point_value_cpp ?? null,
    welcomeBonus: row?.welcome_bonus ?? null,
    earnCaps: row?.earn_caps ?? null,
    creditScore: row?.credit_score ?? null,
    benefits: row?.benefits ?? [],
    rewards: row?.rewards ?? [],
    pros: row?.pros ?? [],
    cons: row?.cons ?? [],
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

/** All cards in Supabase table order (by sort_order) — the source order used by
 *  the /credit-cards index so the list mirrors the catalog and clusters issuers.
 *  Alias-aware ids so links resolve via the detail route. Falls back to cards.ts
 *  order when Supabase is unavailable. Cached per-request. */
export const getCatalogOrderedCards = cache(async (): Promise<SearchCard[]> => {
  const fallback = (): SearchCard[] =>
    CARDS.map((c) => ({ id: c.id, name: c.name, issuer: c.issuer, img: c.img }));

  const supabase = readClient();
  if (!supabase) return fallback();

  const { data, error } = await supabase
    .from("card_catalog")
    .select("id,name,issuer,img,sort_order")
    .order("sort_order", { ascending: true });
  if (error || !data) {
    if (error) console.error("getCatalogOrderedCards error:", error.message);
    return fallback();
  }

  const staticIdByCatalogId = new Map(
    Object.entries(ID_ALIASES).map(([staticId, realId]) => [realId, staticId])
  );
  return (data as Array<{ id: string; name: string | null; issuer: string | null; img: string | null }>).map(
    (r) => ({
      id: staticIdByCatalogId.get(r.id) ?? r.id,
      name: r.name ?? r.id,
      issuer: r.issuer ?? "",
      img: r.img ?? "",
    })
  );
});

/**
 * Rich search index for /api/search-index: the union of card_catalog and
 * cards.ts, with the catalog's benefits/rewards/pros text made searchable.
 * Alias-aware (rows are keyed by their cards.ts id where one exists) so links
 * resolve exactly like getSearchCards. Falls back to cards.ts perks when
 * Supabase is unavailable.
 */
export const getRichSearchIndex = cache(async (): Promise<RichSearchCard[]> => {
  const byId = new Map<string, RichSearchCard>();
  for (const c of CARDS) {
    byId.set(c.id, {
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      img: c.img,
      annualFee: c.annualFee,
      fxFee: null,
      badge: c.badge,
      network: null,
      rewardProgram: null,
      rewards: c.perks,
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
  for (const r of data as Array<{
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
    const id = staticIdByCatalogId.get(r.id) ?? r.id;
    const base = byId.get(id);
    byId.set(id, {
      id,
      name: r.name ?? base?.name ?? r.id,
      issuer: r.issuer ?? base?.issuer ?? "",
      img: r.img ?? base?.img ?? "",
      annualFee: r.annual_fee ?? base?.annualFee ?? null,
      fxFee: r.fx_fee ?? null,
      badge: r.badge ?? base?.badge ?? "",
      network: r.network,
      rewardProgram: r.reward_program,
      rewards: r.rewards?.length ? r.rewards : base?.rewards ?? [],
      benefits: (r.benefits ?? []).map((b) => ({
        title: b.title ?? "",
        description: b.description ?? "",
      })),
      pros: r.pros ?? [],
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

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { CARDS, type CardDef, type SpendKey } from "@/lib/cards";

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

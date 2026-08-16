import type { ChatCompletionTool } from "openai/resources/chat/completions";
import { getCard } from "@/lib/cardDetail";
import { getTopCards, getBreakdown, CAT_LABELS, type SpendKey } from "@/lib/cards";
import { getSlimCatalogue } from "@/lib/chatContext";

/**
 * Tools the assistant may call. Every argument is validated here before it
 * reaches Supabase or the scoring math — user text must never steer a query.
 */

const MAX_DETAIL_CARDS = 4;
const MAX_RANK_RESULTS = 5;
/** A monthly category spend above this is a typo or an attempt to skew results. */
const MAX_MONTHLY_SPEND = 50_000;

export const CHAT_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_card_details",
      description:
        "Get full details for specific cards: welcome bonus, benefits, insurance, earn caps, credit score guidance, APRs, pros and cons. Use when the user asks about anything not in the catalogue summary. Maximum 4 cards per call.",
      parameters: {
        type: "object",
        properties: {
          card_ids: {
            type: "array",
            items: { type: "string" },
            description: "Card ids exactly as they appear in the catalogue, e.g. 'cobalt'.",
          },
        },
        required: ["card_ids"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "rank_cards",
      description:
        "Rank cards by estimated net annual value for a given monthly spending pattern, using the same calculation as the ClearFin calculator. Call this whenever the user describes what they spend. Do not do this arithmetic yourself.",
      parameters: {
        type: "object",
        properties: {
          dining: { type: "number", description: "Monthly dining and restaurant spend in CAD." },
          grocery: { type: "number", description: "Monthly grocery spend in CAD." },
          gas: { type: "number", description: "Monthly gas and EV charging spend in CAD." },
          travel: { type: "number", description: "Monthly travel spend in CAD." },
          other: { type: "number", description: "Monthly spend on everything else in CAD." },
          limit: { type: "number", description: "How many cards to return, 1-5. Defaults to 3." },
        },
        required: ["dining", "grocery", "gas", "travel", "other"],
        additionalProperties: false,
      },
    },
  },
];

function clampSpend(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.min(Math.max(n, 0), MAX_MONTHLY_SPEND);
}

/** Trim long prose so a tool result can't blow out the context window. */
function short(text: string | null | undefined, max = 220): string | null {
  if (!text) return null;
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

async function runGetCardDetails(args: Record<string, unknown>) {
  const requested = Array.isArray(args.card_ids) ? args.card_ids : [];
  const known = new Set((await getSlimCatalogue()).map((c) => c.id));

  const valid: string[] = [];
  const unknown: string[] = [];
  for (const raw of requested) {
    if (typeof raw !== "string") continue;
    const id = raw.trim();
    if (known.has(id)) valid.push(id);
    else unknown.push(id);
    if (valid.length >= MAX_DETAIL_CARDS) break;
  }

  if (valid.length === 0) {
    return {
      error: "No valid card ids supplied.",
      unknown_ids: unknown,
      hint: "Use ids exactly as they appear in the catalogue.",
    };
  }

  const cards = await Promise.all(valid.map((id) => getCard(id)));

  return {
    unknown_ids: unknown.length ? unknown : undefined,
    cards: cards.filter(Boolean).map((c) => ({
      id: c!.id,
      name: c!.name,
      issuer: c!.issuer,
      annual_fee: c!.annualFee,
      first_year_free: c!.firstYearFree,
      min_income_personal: c!.minIncomePersonal,
      purchase_apr: c!.purchaseApr,
      fx_fee: c!.fxFee,
      reward_program: c!.rewardProgram,
      welcome_bonus: c!.welcomeBonus,
      earn_caps: c!.earnCaps,
      credit_score: c!.creditScore,
      benefits: c!.benefits.slice(0, 8).map((b) => ({ title: b.title, detail: short(b.description) })),
      insurance: c!.insurance.slice(0, 8).map((b) => ({ title: b.title, detail: short(b.description) })),
      rewards: c!.rewards.slice(0, 6),
      pros: c!.pros.slice(0, 5),
      cons: c!.cons.slice(0, 5),
      url: `/credit-cards/${c!.id}`,
    })),
  };
}

function runRankCards(args: Record<string, unknown>) {
  const spend: Record<SpendKey, number> = {
    dining: clampSpend(args.dining),
    grocery: clampSpend(args.grocery),
    gas: clampSpend(args.gas),
    travel: clampSpend(args.travel),
    other: clampSpend(args.other),
  };

  const requested = typeof args.limit === "number" ? Math.round(args.limit) : 3;
  const limit = Math.min(Math.max(requested, 1), MAX_RANK_RESULTS);

  const top = getTopCards(spend, limit);

  return {
    spend_used: spend,
    note: "Net annual value is estimated yearly rewards minus the annual fee, using the same calculation as the ClearFin calculator.",
    results: top.map((card, i) => ({
      rank: i + 1,
      id: card.id,
      name: card.name,
      issuer: card.issuer,
      annual_fee: card.annualFee,
      net_annual_value: Math.round(card.netValue),
      by_category: getBreakdown(card, spend).rows.map((r) => ({
        category: CAT_LABELS[r.key],
        yearly: Math.round(r.annual),
      })),
      url: `/credit-cards/${card.id}`,
    })),
  };
}

/** Execute a tool call by name. Unknown names return an error object, never throw. */
export async function runChatTool(name: string, rawArgs: string): Promise<unknown> {
  let args: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(rawArgs || "{}");
    if (parsed && typeof parsed === "object") args = parsed as Record<string, unknown>;
  } catch {
    return { error: "Arguments were not valid JSON." };
  }

  try {
    if (name === "get_card_details") return await runGetCardDetails(args);
    if (name === "rank_cards") return runRankCards(args);
    return { error: `Unknown tool: ${name}` };
  } catch (err) {
    console.error(`chat tool ${name} failed:`, err);
    return { error: "That lookup failed. Answer from the catalogue instead." };
  }
}

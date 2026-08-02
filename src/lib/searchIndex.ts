// Pure (client-safe) search domain: types, the static page manifest, and the
// matcher used by the search palette. No server / Supabase imports here.

export interface SearchCard {
  id: string;
  name: string;
  issuer: string;
  img: string;
}

/** Full-fat card entry for attribute search, fetched lazily from /api/search-index. */
export interface RichSearchCard extends SearchCard {
  annualFee: number | null;
  fxFee: number | null;
  badge: string;
  network: string | null;
  rewardProgram: string | null;
  rewards: string[];
  benefits: { title: string; description: string }[];
  pros: string[];
}

export type PageGroup = "Guide" | "Page" | "Tool";

export interface SearchPage {
  title: string;
  group: PageGroup;
  href: string;
  keywords: string[];
}

export interface SearchResult {
  type: "card" | "page";
  key: string;
  label: string;
  sublabel: string;
  href: string;
  img?: string;
  group: string; // section header: "Cards" | "Guide" | "Page" | "Tool"
  /** Fee chip, e.g. "No fee" | "$120/yr". Card results only. */
  fee?: string;
  /** Card badge chip, e.g. "✈️ Best Travel". */
  badgeChip?: string;
  /** The benefit/reward text that matched the query ("why it matched"). */
  snippet?: string;
  /** Terms to highlight inside the snippet. */
  terms?: string[];
}

// Static manifest of non-card destinations.
export const PAGES: SearchPage[] = [
  { title: "All Credit Cards", group: "Page", href: "/credit-cards", keywords: ["all", "cards", "list", "browse", "every", "directory", "issuer"] },
  { title: "Best Credit Cards in Canada", group: "Guide", href: "/best-credit-cards-canada", keywords: ["best", "top", "overall", "ranking", "2026"] },
  { title: "Best Credit Cards for Everyday Spending", group: "Guide", href: "/best-credit-card-for-everyday-spending-in-canada-2026-picks", keywords: ["everyday", "daily spending", "groceries", "dining", "bills", "cash back", "2026"] },
  { title: "Best Credit Card Combinations", group: "Guide", href: "/best-credit-card-combination-in-canada-for-2026-how-to-pair-two-cards-for-maximum-rewards", keywords: ["combination", "pair", "two cards", "card strategy", "maximum rewards", "2026"] },
  { title: "Best Cashback Cards", group: "Guide", href: "/best-cashback-credit-cards-canada", keywords: ["cashback", "cash back", "money back"] },
  { title: "Best Travel Cards", group: "Guide", href: "/best-travel-credit-cards-canada", keywords: ["travel", "points", "aeroplan", "miles", "flights"] },
  { title: "Best Grocery Cards", group: "Guide", href: "/best-grocery-credit-cards-canada", keywords: ["grocery", "groceries", "supermarket", "food"] },
  { title: "Best Student Cards", group: "Guide", href: "/best-student-credit-cards-canada", keywords: ["student", "no income", "first card", "starter"] },
  { title: "Best No-Fee Cards", group: "Guide", href: "/best-no-fee-credit-cards-canada", keywords: ["no fee", "no annual fee", "free", "$0"] },
  { title: "Rewards Guide", group: "Guide", href: "/credit-card-rewards-canada-guide", keywords: ["rewards", "points", "value", "cpp", "how it works"] },
  { title: "Blog", group: "Guide", href: "/blog", keywords: ["blog", "articles", "guides", "posts", "strategy", "tips"] },
  { title: "FAQ", group: "Page", href: "/faq", keywords: ["faq", "questions", "help", "how does"] },
  { title: "About ClearFin", group: "Page", href: "/about", keywords: ["about", "who", "company", "mission"] },
  { title: "Disclosures", group: "Page", href: "/disclosures", keywords: ["disclosure", "affiliate", "how we make money", "legal"] },
  { title: "Privacy Policy", group: "Page", href: "/privacy", keywords: ["privacy", "data", "policy"] },
  { title: "Rewards Calculator", group: "Tool", href: "/credit-card-calculator-canada", keywords: ["calculator", "calculate", "how much", "earn", "tool"] },
  { title: "Compare Cards", group: "Tool", href: "/compare-credit-cards-canada", keywords: ["compare", "comparison", "side by side", "versus", "vs"] },
];

// High enough that a full-issuer query ("scotia", "td") lists every card —
// Scotiabank is the largest issuer at 13 cards. The results pane scrolls.
const MAX_CARDS = 14;

// ---------- Attribute search (rich index) ----------

// Filler words in natural queries like "suggest me a card for lounge access".
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with", "me", "my", "i",
  "card", "cards", "credit", "suggest", "recommend", "want", "need", "get", "give", "show",
  "find", "best", "good", "great", "that", "have", "has", "which", "what", "do", "does",
  "is", "are", "it", "something", "some", "any",
]);

/**
 * Query vocabulary → catalog vocabulary. Keys are single tokens or two-word
 * phrases found in the query; values are the terms actually matched against
 * card text. Extend this table to teach the search new concepts.
 */
const SYNONYMS: Record<string, string[]> = {
  lounge: ["lounge"],
  lounges: ["lounge"],
  "priority pass": ["lounge", "priority pass"],
  airport: ["lounge", "airport"],
  fx: ["foreign transaction", "foreign currency", "fx"],
  forex: ["foreign transaction", "fx"],
  foreign: ["foreign transaction", "foreign currency", "foreign"],
  bonus: ["welcome bonus", "bonus"],
  grocery: ["grocer", "supermarket", "sobeys"],
  groceries: ["grocer", "supermarket", "sobeys"],
  gas: ["gas", "fuel", "ev charging"],
  fuel: ["gas", "fuel"],
  dining: ["dining", "restaurant", "food delivery"],
  restaurant: ["dining", "restaurant"],
  restaurants: ["dining", "restaurant"],
  travel: ["travel", "flight", "hotel"],
  flight: ["flight", "travel", "air canada", "airline"],
  flights: ["flight", "travel", "air canada", "airline"],
  hotel: ["hotel", "travel"],
  hotels: ["hotel", "travel"],
  movie: ["cineplex", "entertainment", "movie"],
  movies: ["cineplex", "entertainment", "movie"],
  streaming: ["streaming"],
  insurance: ["insurance", "coverage", "warranty", "protection"],
  student: ["student"],
  students: ["student"],
  cashback: ["cashback", "cash back", "money-back", "money back"],
  aeroplan: ["aeroplan", "air canada"],
  concierge: ["concierge"],
  roadside: ["roadside"],
  transit: ["transit", "rideshare", "public transit"],
  interest: ["interest", "low rate"],
  business: ["business"],
  points: ["points", "rewards"],
};

// Field weights: a hit on the name matters more than one buried in a benefit description.
const W_NAME = 10, W_ISSUER = 6, W_BADGE = 5, W_PROGRAM = 5, W_REWARD = 4, W_BENEFIT = 4, W_DETAIL = 2;

interface ParsedQuery {
  /** One entry per query concept; each entry lists interchangeable terms. */
  groups: string[][];
  /** The cleaned query as a phrase, for exact-phrase boosts ("lounge access"). */
  phrase: string;
  noFee: boolean;
  noFx: boolean;
}

function parseQuery(raw: string): ParsedQuery {
  let q = raw.toLowerCase();

  // Structured concepts: pull them out of the text before tokenizing.
  const noFee = /\bno\s+(annual\s+)?fees?\b|\bfree\b|\$0\b/.test(q);
  const noFx = /\bno\s+(fx|forex|foreign)\b/.test(q);
  if (noFee) q = q.replace(/\bno\s+(annual\s+)?fees?\b|\bfree\b|\$0\b/g, " ");
  if (noFx) q = q.replace(/\bno\s+(fx|forex|foreign)(\s+(transaction|exchange|currency))?(\s+fees?)?\b/g, " ");

  const groups: string[][] = [];
  // Two-word synonym phrases first (e.g. "priority pass"), then single tokens.
  for (const key of Object.keys(SYNONYMS)) {
    if (key.includes(" ") && q.includes(key)) {
      groups.push([key, ...SYNONYMS[key]]);
      q = q.replace(key, " ");
    }
  }
  const tokens = q.split(/[^a-z0-9%$+]+/).filter((t) => t.length > 1 && !STOPWORDS.has(t));
  for (const t of tokens) {
    const syn = SYNONYMS[t];
    // Light plural folding: "perks" also tries "perk".
    const singular = t.endsWith("s") ? t.slice(0, -1) : null;
    groups.push(syn ? [t, ...syn] : singular ? [t, singular] : [t]);
  }

  return { groups, phrase: tokens.join(" "), noFee, noFx };
}

interface CardScore {
  card: RichSearchCard;
  score: number;
  snippet?: string;
  terms: string[];
}

function scoreRichCard(card: RichSearchCard, parsed: ParsedQuery): CardScore | null {
  if (parsed.noFee && card.annualFee !== 0) return null;
  if (parsed.noFx && card.fxFee !== 0) return null;

  // [text, weight, snippetable] — snippetable fields explain *why* a card matched.
  const fields: [string, number, boolean][] = [
    [card.name, W_NAME, false],
    [card.issuer, W_ISSUER, false],
    [card.badge, W_BADGE, false],
    [card.rewardProgram ?? "", W_PROGRAM, false],
    [card.network ?? "", W_PROGRAM, false],
    ...card.rewards.map((r): [string, number, boolean] => [r, W_REWARD, true]),
    ...card.benefits.map((b): [string, number, boolean] => [b.title, W_BENEFIT, true]),
    ...card.benefits.map((b): [string, number, boolean] => [b.description, W_DETAIL, true]),
    ...card.pros.map((p): [string, number, boolean] => [p, W_DETAIL, true]),
  ];
  const lower = fields.map(([text]) => text.toLowerCase());

  let score = 0;
  const terms: string[] = [];
  // Best snippet: highest weight wins; among equals, the one hit by more groups.
  const snippetHits = new Map<number, number>(); // field idx → groups matched

  for (const group of parsed.groups) {
    let best = 0;
    let bestIdx = -1;
    let bestTerm = "";
    for (let i = 0; i < fields.length; i++) {
      const [, weight] = fields[i];
      if (weight <= best) continue;
      for (const term of group) {
        if (lower[i].includes(term)) {
          best = weight;
          bestIdx = i;
          bestTerm = term;
          break;
        }
      }
    }
    if (best === 0) return null; // AND semantics: every concept must land somewhere
    score += best;
    terms.push(bestTerm);
    if (fields[bestIdx][2]) snippetHits.set(bestIdx, (snippetHits.get(bestIdx) ?? 0) + 1);
  }

  // Exact-phrase boost: "lounge access" together beats scattered hits.
  if (parsed.phrase.includes(" ")) {
    if (lower.some((t) => t.includes(parsed.phrase))) score += 6;
  }

  // Predicate-only queries ("no fee") match everything that passes the filters.
  if (parsed.groups.length === 0) score = 1;

  let snippet: string | undefined;
  let snippetBest = -1;
  for (const [idx, hits] of snippetHits) {
    const rank = hits * 100 + fields[idx][1];
    if (rank > snippetBest) {
      snippetBest = rank;
      snippet = fields[idx][0];
    }
  }

  return { card, score, snippet, terms };
}

const feeChip = (fee: number | null): string | undefined =>
  fee == null ? undefined : fee === 0 ? "No fee" : `$${Math.round(fee)}/yr`;

/** Attribute search over the rich index. Returns [] when nothing qualifies. */
function searchRichCards(query: string, rich: RichSearchCard[]): SearchResult[] {
  const parsed = parseQuery(query);
  if (parsed.groups.length === 0 && !parsed.noFee && !parsed.noFx) return [];

  return rich
    .map((c) => scoreRichCard(c, parsed))
    .filter((s): s is CardScore => s !== null)
    .sort((a, b) => b.score - a.score || a.card.name.localeCompare(b.card.name))
    .slice(0, MAX_CARDS)
    .map(({ card, snippet, terms }) => ({
      type: "card" as const,
      key: card.id,
      label: card.name,
      sublabel: card.issuer,
      href: `/credit-cards/${card.id}`,
      img: card.img || undefined,
      group: "Cards",
      fee: feeChip(card.annualFee),
      badgeChip: card.badge || undefined,
      snippet,
      terms,
    }));
}

/** Quick links shown as pills when the search box is empty. */
export const POPULAR: { label: string; href: string }[] = [
  { label: "Best cashback cards", href: "/best-cashback-credit-cards-canada" },
  { label: "Best travel cards", href: "/best-travel-credit-cards-canada" },
  { label: "Best no-fee cards", href: "/best-no-fee-credit-cards-canada" },
  { label: "Best grocery cards", href: "/best-grocery-credit-cards-canada" },
  { label: "Best student cards", href: "/best-student-credit-cards-canada" },
  { label: "Rewards calculator", href: "/#tool" },
  { label: "Compare cards", href: "/#compare" },
];

/** Group display order in the palette. */
export const GROUP_ORDER = ["Cards", "Guide", "Page", "Tool"];

/**
 * Build the grouped result list for a query.
 * Empty query → default suggestions (guides + tools, no cards).
 * With the rich index loaded, cards are matched by attribute (benefits, perks,
 * fees…) and scored; before it loads, the lean name/issuer match is used.
 */
export function searchAll(
  query: string,
  cards: SearchCard[],
  rich?: RichSearchCard[] | null
): SearchResult[] {
  const q = query.trim().toLowerCase();

  const pageResult = (p: SearchPage): SearchResult => ({
    type: "page",
    key: p.href,
    label: p.title,
    sublabel: p.group === "Tool" ? "Tool" : p.group === "Guide" ? "Guide" : "Page",
    href: p.href,
    group: p.group,
  });

  if (!q) {
    // Default state: "popular searches" pills.
    return POPULAR.map<SearchResult>((p) => ({
      type: "page",
      key: p.href,
      label: p.label,
      sublabel: "",
      href: p.href,
      group: "Popular",
    }));
  }

  // Cards: attribute search when the rich index is loaded, else lean name/issuer match.
  const cardMatches = rich
    ? searchRichCards(q, rich)
    : cards
        .filter((c) => c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q))
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
          const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
          return aStarts - bStarts || a.name.localeCompare(b.name);
        })
        .slice(0, MAX_CARDS)
        .map<SearchResult>((c) => ({
          type: "card",
          key: c.id,
          label: c.name,
          sublabel: c.issuer,
          href: `/credit-cards/${c.id}`,
          img: c.img || undefined,
          group: "Cards",
        }));

  // Pages: match title or any keyword.
  const pageMatches = PAGES.filter(
    (p) => p.title.toLowerCase().includes(q) || p.keywords.some((k) => k.includes(q))
  ).map(pageResult);

  return [...cardMatches, ...pageMatches];
}

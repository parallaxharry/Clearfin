// Pure (client-safe) search domain: types, the static page manifest, and the
// matcher used by the search palette. No server / Supabase imports here.

export interface SearchCard {
  id: string;
  name: string;
  issuer: string;
  img: string;
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
}

// Static manifest of non-card destinations.
export const PAGES: SearchPage[] = [
  { title: "Best Credit Cards in Canada", group: "Guide", href: "/best-credit-cards-canada", keywords: ["best", "top", "overall", "ranking", "2026"] },
  { title: "Best Cashback Cards", group: "Guide", href: "/best-cashback-credit-cards-canada", keywords: ["cashback", "cash back", "money back"] },
  { title: "Best Travel Cards", group: "Guide", href: "/best-travel-credit-cards-canada", keywords: ["travel", "points", "aeroplan", "miles", "flights"] },
  { title: "Best Grocery Cards", group: "Guide", href: "/best-grocery-credit-cards-canada", keywords: ["grocery", "groceries", "supermarket", "food"] },
  { title: "Best Student Cards", group: "Guide", href: "/best-student-credit-cards-canada", keywords: ["student", "no income", "first card", "starter"] },
  { title: "Best No-Fee Cards", group: "Guide", href: "/best-no-fee-credit-cards-canada", keywords: ["no fee", "no annual fee", "free", "$0"] },
  { title: "Rewards Guide", group: "Guide", href: "/credit-card-rewards-canada-guide", keywords: ["rewards", "points", "value", "cpp", "how it works"] },
  { title: "FAQ", group: "Page", href: "/faq", keywords: ["faq", "questions", "help", "how does"] },
  { title: "About ClearFin", group: "Page", href: "/about", keywords: ["about", "who", "company", "mission"] },
  { title: "Disclosures", group: "Page", href: "/disclosures", keywords: ["disclosure", "affiliate", "how we make money", "legal"] },
  { title: "Privacy Policy", group: "Page", href: "/privacy", keywords: ["privacy", "data", "policy"] },
  { title: "Rewards Calculator", group: "Tool", href: "/#tool", keywords: ["calculator", "calculate", "how much", "earn", "tool"] },
  { title: "Compare Cards", group: "Tool", href: "/#compare", keywords: ["compare", "comparison", "side by side", "versus", "vs"] },
];

const MAX_CARDS = 6;

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
 */
export function searchAll(query: string, cards: SearchCard[]): SearchResult[] {
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

  // Cards: match name or issuer; rank name-startsWith first.
  const cardMatches = cards
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

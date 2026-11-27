/**
 * Editorial "benefit showcase" layout for card pages: benefits grouped into themes,
 * each shown as a photo card with a short headline and one or two lines, with the
 * full catalogue description behind a "+" toggle.
 *
 * Only cards listed here get the showcase; every other card keeps the standard
 * perks grid. `match` is the benefit's title in card_catalog.benefits — the full
 * description is always read from the catalogue, never duplicated here, so the
 * expanded text can't drift from the database.
 *
 * Photos are ClearFin's own (Canva AI generated) — never an issuer's marketing images.
 */

export interface ShowcaseItem {
  /** card_catalog.benefits[].title this item presents. */
  match: string;
  /** Headline with the number up front, e.g. "$200 Annual Travel Credit". */
  headline: string;
  /** One or two plain-language lines. Must stay faithful to the catalogue text. */
  summary: string;
  /** Small footnote under the summary (conditions the reader must not miss). */
  note?: string;
  /** Path under /public. Omit for a styled panel showing `stat` instead. */
  image?: string;
  imageAlt?: string;
  /** Big figure shown on the panel when there is no photo (e.g. "$240"). */
  stat?: string;
}

export interface ShowcaseGroup {
  title: string;
  subtitle: string;
  /** "photo" = image cards, "compact" = smaller text-only cards. */
  variant: "photo" | "compact";
  items: ShowcaseItem[];
}

const IMG = "/images/benefits/amex-platinum";

export const BENEFIT_SHOWCASE: Record<string, ShowcaseGroup[]> = {
  // Matches the reviewed benefits in cardReviewData.ts (amex-platinum), which override
  // the catalogue on this page. Insurance has its own section, so it isn't repeated here.
  "amex-platinum": [
    {
      title: "Premium travel",
      subtitle: "Lounges and hotel perks that change how the trip feels.",
      variant: "photo",
      items: [
        {
          match: "Global Lounge Collection",
          headline: "1,550+ airport lounges",
          summary: "Relax before your flight in lounges at airports in 140 countries.",
          image: `${IMG}/lounge.webp`,
          imageAlt: "Bright airport lounge with a curved bar and runway views",
        },
        {
          match: "Fine Hotels + Resorts",
          headline: "Fine Hotels + Resorts",
          summary: "Breakfast for two and a guaranteed 4 p.m. checkout on eligible luxury-hotel bookings.",
          image: `${IMG}/fine-hotels.webp`,
          imageAlt: "Breakfast tray on a hotel bed with an ocean view",
        },
        {
          match: "Hotel elite status",
          headline: "Marriott & Hilton Gold status",
          summary: "Enrol for Marriott Bonvoy Gold Elite and Hilton Honors Gold without the usual stays.",
          image: `${IMG}/hotel-status.webp`,
          imageAlt: "Guest receiving a key card at a boutique hotel front desk",
        },
      ],
    },
    {
      title: "Annual credits",
      subtitle: "Up to $400 a year in credits, plus NEXUS every four years.",
      variant: "photo",
      items: [
        {
          match: "$200 annual travel credit",
          headline: "$200 Annual Travel Credit",
          summary: "Put it toward an eligible booking through American Express Travel.",
          image: `${IMG}/travel-credit.webp`,
          imageAlt: "Couple relaxing in a stone pool at a sunny villa",
        },
        {
          match: "$200 annual dining credit",
          headline: "$200 Annual Dining Credit",
          summary: "A statement credit after a $200+ meal at participating Canadian restaurants.",
          stat: "$200",
        },
        {
          match: "$100 NEXUS credit",
          headline: "$100 NEXUS credit",
          summary: "Covers a NEXUS application or renewal fee, once every four years.",
          stat: "$100",
        },
      ],
    },
  ],
};

export interface ResolvedShowcaseItem extends ShowcaseItem {
  description: string;
}

export interface ResolvedShowcaseGroup extends Omit<ShowcaseGroup, "items"> {
  items: ResolvedShowcaseItem[];
}

/**
 * The showcase for a card, with each item's full description pulled from the
 * catalogue. Items whose benefit is no longer in the catalogue are dropped, and
 * catalogue benefits the showcase doesn't mention are returned as `unplaced` so
 * nothing silently disappears from the page.
 */
export function getBenefitShowcase(
  cardId: string,
  benefits: { title: string; description?: string | null }[],
): { groups: ResolvedShowcaseGroup[]; unplaced: { title: string; description?: string | null }[] } | null {
  const config = BENEFIT_SHOWCASE[cardId];
  if (!config) return null;
  const byTitle = new Map(benefits.map((b) => [b.title.trim(), b]));
  const used = new Set<string>();
  const groups = config
    .map((group) => ({
      ...group,
      items: group.items.flatMap((item) => {
        const benefit = byTitle.get(item.match);
        if (!benefit) return [];
        used.add(item.match);
        return [{ ...item, description: benefit.description ?? "" }];
      }),
    }))
    .filter((group) => group.items.length > 0);
  const unplaced = benefits.filter((b) => !used.has(b.title.trim()));
  return { groups, unplaced };
}

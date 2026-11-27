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
  /**
   * Title(s) of the benefit or insurance entries this card presents. Several titles
   * make one card that lists each of them behind the "+" (e.g. "Travel coverage").
   */
  match: string | string[];
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
  /** Line icon shown on the panel when there is neither a photo nor a stat. */
  icon?: "plane" | "car" | "bag";
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
          image: `${IMG}/dining.webp`,
          imageAlt: "Friends sharing plates at a warm, busy restaurant",
        },
        {
          match: "$100 NEXUS credit",
          headline: "$100 NEXUS credit",
          summary: "Covers a NEXUS application or renewal fee, once every four years.",
          image: `${IMG}/nexus.webp`,
          imageAlt: "Traveller with a carry-on walking past a queue in a bright airport hall",
        },
      ],
    },
  ],
};

/**
 * Coverage & services layout for the insurance section (same component). Titles
 * match cardReviewData.ts insurance entries for the card.
 */
export const COVERAGE_SHOWCASE: Record<string, ShowcaseGroup[]> = {
  "amex-platinum": [
    {
      title: "Coverage & services",
      subtitle: "The protection that comes with the card, grouped by when you'd use it.",
      variant: "photo",
      items: [
        {
          match: [
            "Emergency medical",
            "Trip cancellation and interruption",
            "Flight and baggage delay",
            "Lost or stolen baggage and hotel burglary",
            "Travel accident",
          ],
          headline: "Travel coverage",
          summary: "Emergency medical, trip cancellation, delays, lost bags and travel accident coverage while you're away.",
          image: `${IMG}/travel-coverage.webp`,
          imageAlt: "Traveller smiling at her phone in an airplane window seat",
        },
        {
          match: "Car-rental theft and damage",
          headline: "Car rental coverage",
          summary: "Theft and damage coverage for eligible rental cars you pay for with the card.",
          image: `${IMG}/car-rental.webp`,
          imageAlt: "Couple loading luggage into a rental car at a mountain lookout",
        },
        {
          match: "Purchase Protection and Buyer's Assurance",
          headline: "Purchase coverage",
          summary: "Short-term theft and damage protection on eligible purchases, plus a possible warranty extension.",
          image: `${IMG}/purchase-coverage.webp`,
          imageAlt: "Customer tapping a card to pay at a bright café counter",
        },
      ],
    },
  ],
};

export interface ShowcaseDetail {
  title: string;
  description: string;
}

export interface ResolvedShowcaseItem extends ShowcaseItem {
  /** One entry per matched title, in the order the config lists them. */
  details: ShowcaseDetail[];
}

export interface ResolvedShowcaseGroup extends Omit<ShowcaseGroup, "items"> {
  items: ResolvedShowcaseItem[];
}

type Entry = { title: string; description?: string | null };

function resolveShowcase(
  config: ShowcaseGroup[] | undefined,
  entries: Entry[],
): { groups: ResolvedShowcaseGroup[]; unplaced: Entry[] } | null {
  if (!config) return null;
  const byTitle = new Map(entries.map((e) => [e.title.trim(), e]));
  const used = new Set<string>();
  const groups = config
    .map((group) => ({
      ...group,
      items: group.items.flatMap((item) => {
        const titles = Array.isArray(item.match) ? item.match : [item.match];
        const details = titles.flatMap((t) => {
          const e = byTitle.get(t);
          if (!e) return [];
          used.add(t);
          return [{ title: e.title, description: e.description ?? "" }];
        });
        return details.length ? [{ ...item, details }] : [];
      }),
    }))
    .filter((group) => group.items.length > 0);
  const unplaced = entries.filter((e) => !used.has(e.title.trim()));
  return { groups, unplaced };
}

/**
 * The showcase for a card, with each item's full text pulled from the page's data.
 * Items whose entry no longer exists are dropped; entries the showcase doesn't
 * mention come back as `unplaced` so nothing silently disappears from the page.
 */
export const getBenefitShowcase = (cardId: string, benefits: Entry[]) =>
  resolveShowcase(BENEFIT_SHOWCASE[cardId], benefits);

export const getCoverageShowcase = (cardId: string, insurance: Entry[]) =>
  resolveShowcase(COVERAGE_SHOWCASE[cardId], insurance);

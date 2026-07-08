import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  bodyMd: string;
  coverImg: string | null;
  tags: string[];
  author: string;
  publishedAt: string; // ISO date
  updatedAt: string;
}

interface BlogPostRow {
  slug: string;
  title: string | null;
  description: string | null;
  body_md: string | null;
  cover_img: string | null;
  tags: string[] | null;
  author: string | null;
  published_at: string | null;
  updated_at: string | null;
}

function readClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function fromRow(r: BlogPostRow): BlogPost {
  return {
    slug: r.slug,
    title: r.title ?? r.slug,
    description: r.description ?? "",
    bodyMd: r.body_md ?? "",
    coverImg: r.cover_img,
    tags: r.tags ?? [],
    author: r.author ?? "ClearFin Team",
    publishedAt: r.published_at ?? new Date().toISOString(),
    updatedAt: r.updated_at ?? r.published_at ?? new Date().toISOString(),
  };
}

/**
 * Launch posts, shipped in code so the blog works before the blog_posts table
 * exists (and if Supabase is ever unreachable). Once the table has published
 * rows, it takes over entirely — keep slugs identical in scripts/blog-posts.sql
 * so the table versions replace these cleanly.
 */
const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: "how-credit-card-points-work-canada",
    title: "How Credit Card Points Actually Work in Canada",
    description:
      "Aeroplan, Scene+, Membership Rewards, BMO Rewards — every program values a point differently. Here's how to convert any points card into a real percentage return.",
    coverImg: null,
    tags: ["points", "basics"],
    author: "ClearFin Team",
    publishedAt: "2026-07-07T00:00:00Z",
    updatedAt: "2026-07-07T00:00:00Z",
    bodyMd: `Every Canadian bank advertises points, but none of them advertise what a point is worth. "5x points on groceries" sounds like 5% back — it usually isn't. This guide shows you how to translate any points card into a plain percentage so you can compare it against a simple cashback card.

## The only formula you need

**Earn rate × point value = real return.**

A card that earns 5 points per dollar, where each point is worth 1 cent, returns 5%. A card that earns 5 points per dollar where points are worth 0.7 cents returns 3.5%. Same "5x" marketing, very different outcome.

Point values in Canada cluster around these ranges:

| Program | Typical value per point | Best redemption |
| --- | --- | --- |
| Aeroplan | 1.5–2.1¢ | Flight rewards |
| Amex Membership Rewards | 1.0–2.0¢ | Transfers to Aeroplan/Avios |
| Scene+ | 1.0¢ | Travel or groceries |
| RBC Avion | 1.0–1.6¢ | Airline transfer partners |
| BMO Rewards | 0.67¢ | Travel bookings |
| TD Rewards | 0.5¢ | Expedia for TD |

## Why redemption choice matters more than earn rate

The same Aeroplan point is worth about 2 cents on a well-chosen flight reward and about 0.8 cents on a gift card. Redeeming 60,000 points for a $480 gift card instead of a $1,200 flight quietly throws away $720. The rule: **points programs reward people who redeem for the thing the program is built around** — usually flights — and punish everyone else.

If you know you'll never redeem for travel, stop chasing travel points. A flat 2% cashback card beats a points card you redeem badly, every single time.

## Cashback vs points, honestly

- **Cashback** is worth face value, always. No blackout dates, no devaluations, no math.
- **Points** can beat cashback by 50–100% — but only with deliberate redemptions, and programs devalue over time.

A good test: if you spent 20 minutes last year optimizing a redemption and enjoyed it, you're a points person. If that sounds like a chore, take the cash.

## How ClearFin handles this

Our calculator converts every points card to an estimated dollar return using conservative point values, so a "5x" card and a "4%" card are compared on the same scale. Try it with your own spending — the ranking usually surprises people.`,
  },
  {
    slug: "two-card-strategy-canada",
    title: "The Two-Card Strategy That Beats Any Single Card",
    description:
      "No single Canadian credit card wins every category. Pairing one category card with one flat-rate card typically adds $200–$400 a year over the best solo card.",
    coverImg: null,
    tags: ["strategy", "cashback"],
    author: "ClearFin Team",
    publishedAt: "2026-07-07T00:00:00Z",
    updatedAt: "2026-07-07T00:00:00Z",
    bodyMd: `Ask "what's the best credit card in Canada?" and you'll get a different answer from every blog. That's because the question is wrong. The best *card* loses to the best *pair* for almost every spending profile.

## Why one card can't win

Category cards pay 4–6% on groceries or dining but drop to 1% on everything else. Flat-rate cards pay 1.5–2% on everything but never spike. Since a typical household puts 40–60% of card spend outside the bonus categories, a single card always leaves one side of your spending under-earning.

## The pairing

1. **A category card** matched to your biggest spending bucket — groceries, dining, or gas.
2. **A flat-rate card** at 1.5–2% that catches everything else.

The category card handles the concentrated spending; the flat card sets the floor for the rest.

### Example: a $2,500/month household

| Spend | Single "best" card | Two-card pair |
| --- | --- | --- |
| Groceries $800 | 4% → $384/yr | 4% → $384/yr |
| Dining $300 | 1% → $36/yr | 2% → $72/yr |
| Gas $200 | 2% → $48/yr | 2% → $48/yr |
| Everything else $1,200 | 1% → $144/yr | 2% → $288/yr |
| **Total** | **$612/yr** | **$792/yr** |

Same spending, same effort at the till, **$180 more per year** — before welcome bonuses.

## Three rules that make it work

- **Never carry a balance.** At 21% interest, one revolving month erases a year of optimization.
- **Mind the annual-fee math.** A fee card must out-earn a no-fee alternative *by more than its fee* on your actual numbers, not the bank's example.
- **Keep it to two.** A third card adds wallet friction for single-digit dollars unless your spending is unusually large or concentrated.

## Find your pair

Run your real monthly numbers through the ClearFin calculator to find your category card, then use the compare tool to test it against a flat-rate partner. The right pair depends entirely on where your money actually goes.`,
  },
];

/** All published posts, newest first. Table rows win; fallback keeps the blog alive without them. */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const supabase = readClient();
  if (!supabase) return FALLBACK_POSTS;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.error("getPosts blog_posts error:", error.message);
    return FALLBACK_POSTS;
  }
  return (data as BlogPostRow[]).map(fromRow);
});

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
});

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

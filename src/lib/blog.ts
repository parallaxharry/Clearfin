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

const DEFAULT_BLOG_COVERS: Record<string, string> = {
  "how-clearfin-helps": "/images/blog/how-clearfin-helps.webp",
  "how-credit-card-points-work-canada": "/images/blog/how-credit-card-points-work-canada.webp",
  "best-credit-card-combination-canada": "/images/blog/best-credit-card-combination-canada.webp",
};

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
    coverImg: r.cover_img ?? DEFAULT_BLOG_COVERS[r.slug] ?? null,
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
    slug: "how-clearfin-helps",
    title: "How ClearFin Helps You Compare Canadian Credit Cards",
    description:
      "Credit card rewards look simple until you try to compare them. Here's how ClearFin turns your real spending into a calmer, more practical card choice.",
    coverImg: DEFAULT_BLOG_COVERS["how-clearfin-helps"],
    tags: ["about"],
    author: "ClearFin Team",
    publishedAt: "2026-08-10T00:00:00Z",
    updatedAt: "2026-08-10T00:00:00Z",
    bodyMd: `Credit card rewards look simple until you try to compare them. Grocery rates can depend on the store, travel points can change value depending on how you redeem them, and a large welcome offer does not always make up for an annual fee. ClearFin brings those details into one place so you can make a calmer, more practical choice.

## Start with your real spending

Start with our [Canadian credit card calculator](/credit-card-calculator-canada) and enter the categories that matter in your household. We use that spending mix to estimate which cards may return more value after the annual fee. You can then open the card details, compare alternatives side by side, and check the issuer's current terms before applying.

## See the trade-offs clearly

ClearFin is most useful when your spending is uneven. Maybe groceries and recurring bills are the big categories, or perhaps dining and travel matter more. Instead of assuming the same card is best for everyone, the comparison follows your numbers. You can also browse our guides to understand [cash back](/best-cashback-credit-cards-canada), [travel rewards](/best-travel-credit-cards-canada), and [no-annual-fee cards](/best-no-fee-credit-cards-canada) in plain language.

## Independent by design

ClearFin is not a bank or digital wallet, and it does not move your money. It is an independent comparison and education tool. The goal is straightforward: help you understand the trade-offs, choose a card that fits your real routine, and avoid paying for benefits you are unlikely to use.

Ready to see it with your own numbers? [Explore the card catalogue](/credit-cards) or jump straight into the [calculator](/credit-card-calculator-canada).`,
  },
  {
    slug: "how-credit-card-points-work-canada",
    title: "How Credit Card Points Actually Work in Canada",
    description:
      "Aeroplan, Scene+, Membership Rewards, BMO Rewards — every program values a point differently. Here's how to convert any points card into a real percentage return.",
    coverImg: DEFAULT_BLOG_COVERS["how-credit-card-points-work-canada"],
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
    slug: "best-credit-card-combination-canada",
    title: "Best Credit Card Combination in Canada for 2026: How to Pair Two Cards for Maximum Rewards",
    description:
      "Learn how ClearFin helps you choose the best credit card combinations in Canada for 2026 to maximize cash back, travel rewards and everyday savings.",
    coverImg: DEFAULT_BLOG_COVERS["best-credit-card-combination-canada"],
    tags: ["strategy", "combinations"],
    author: "ClearFin Team",
    publishedAt: "2026-07-10T00:00:00Z",
    updatedAt: "2026-07-26T00:00:00Z",
    bodyMd: `The best credit card combination Canada users should consider in 2026 is usually one high-earning rewards card for major spending categories and one backup card for places where the first card is not accepted. For many Canadians, this means pairing a premium points card for groceries, dining, transit, gas, and subscriptions with a no-fee cash back Mastercard or Visa for everyday backup spending.

A two-card strategy works because no single credit card is perfect for every purchase. One card may give strong rewards on groceries and restaurants, while another may be better for utility bills, online purchases, Costco, non-American Express merchants, or flat-rate cash back.

Before choosing any rewards card, compare interest rates, annual fees, rewards, benefits, and how often you will actually use those benefits. Canada's Financial Consumer Agency also notes that rewards may lose value if the cardholder carries a balance and pays interest.

## Why should Canadians use two credit cards instead of one?

Using two credit cards can help maximize rewards because each card can serve a different purpose. One card can be used for high-value bonus categories, while the second card can cover all other purchases.

For example, a card that earns strong points on groceries and restaurants may not be accepted at every merchant. A second card from Visa or Mastercard can fill that gap. This is especially useful in Canada, where some stores accept only certain card networks.

The goal is not to collect too many cards. The goal is to build a simple system: one primary rewards card and one reliable backup card.

## What is the best two-card setup for travel rewards in Canada?

A strong travel-focused combination for 2026 is:

- **Primary card:** [American Express Cobalt Card](/credit-cards/cobalt)
- **Backup card:** [Rogers Red Mastercard](/credit-cards/rogers-red), [Rogers Red World Elite Mastercard](/credit-cards/rogers-world-elite), [Tangerine Money-Back Credit Card](/credit-cards/tangerine-money-back), or [MBNA Rewards World Elite Mastercard](/credit-cards/mbna-rewards-world-elite)

The American Express Cobalt Card is often a strong primary card because it earns 5 points per $1 on eligible eats and drinks in Canada, including eligible restaurants, cafés, grocery stores, and food delivery, up to a monthly cap. It also earns 3 points per $1 on eligible streaming subscriptions, 2 points per $1 on eligible gas, transit, and ride share purchases in Canada, and 1 point per $1 everywhere else.

This makes it useful for people who spend regularly on food, groceries, subscriptions, commuting, and urban lifestyle purchases. The backup card should be used where American Express is not accepted or where a flat cash back card performs better.

## What is the best two-card setup for cash back?

A simple cash back setup for Canadians is:

- **Primary card:** [TD Cash Back Visa Infinite](/credit-cards/td-cashback-infinite) or [Tangerine Money-Back Credit Card](/credit-cards/tangerine-money-back)
- **Backup card:** [Rogers Red Mastercard](/credit-cards/rogers-red) or another no-fee Mastercard

The TD Cash Back Visa Infinite earns 3% cash back on grocery, gas and electric vehicle charging, public transit, recurring bill payments, streaming, digital gaming, and media purchases, plus 1% cash back on other purchases.

The Tangerine Money-Back Credit Card is useful for people who prefer no annual fee and flexible categories. It offers 2% cash back in up to three customizable categories and 0.5% back on other purchases.

This type of setup works well for people who want simple rewards, easy redemption, and less effort compared with managing travel points.

## Cash back vs travel points Canada: which is better in 2026?

The answer depends on how the cardholder spends and redeems.

**Cash back** is better for people who want simple value. It is easy to understand, easy to redeem, and useful for everyday expenses. A cash back card is usually a good fit for families, students, new cardholders, or anyone who does not want to track point values.

**Travel points** are better for people who travel, compare redemption options, and want higher potential value. Points can sometimes be worth more when redeemed for flights, hotels, or travel credits. However, they may require more planning.

The best choice depends on your lifestyle. If you travel once or twice a year and like optimizing value, travel points may be better. If you want guaranteed simplicity, cash back is usually easier. Our [credit card rewards guide](/credit-card-rewards-canada-guide) breaks down how to value points across every major Canadian program.

## What is the best credit card combination for grocery and restaurant spending?

For grocery and restaurant spending, a strong combination is the **American Express Cobalt Card + a Mastercard backup**.

The Cobalt Card is strong for eligible groceries, restaurants, cafés, and food delivery in Canada. However, because not every grocery store or merchant accepts American Express, a Mastercard backup can help.

For the backup role, the [MBNA Rewards World Elite Mastercard](/credit-cards/mbna-rewards-world-elite) is worth considering because it earns 5 points per $1 on eligible restaurant, grocery, digital media, membership, and household utility purchases until the annual category cap is reached.

This pairing can work well for people whose spending is concentrated in food, digital services, and household bills.

## What is the best credit card combination for Rogers, Fido, Shaw, or Comwave customers?

For eligible Rogers, Fido, Shaw, or Comwave customers, a [Rogers Red Mastercard](/credit-cards/rogers-red) or [Rogers Red World Elite Mastercard](/credit-cards/rogers-world-elite) can be a strong backup or even a primary card. Rogers Bank states that the Rogers Red Mastercard has no annual fee and offers a 3% cash back value exclusively with Rogers, and that eligible Rogers, Fido, Comwave, or Shaw customers can unlock 2% unlimited cash back on eligible purchases.

A practical combination is the **American Express Cobalt Card for bonus categories + Rogers Red Mastercard for everything else**. The Cobalt Card can cover high-value food, grocery, transit, gas, and streaming categories, while the Rogers card covers non-Amex merchants and general spending.

## How should Canadians decide their own best combination?

The easiest way is to look at monthly spending. Check where most of your money goes: groceries, restaurants, gas, transit, bills, streaming, travel, or online purchases. Then ask:

- Which card gives the highest return in my top categories?
- Which card is accepted at the stores I use most?
- Does the annual fee make sense?
- Do I want cash back or travel points?
- Will I pay the balance in full every month?
- Do I qualify for the income requirement?
- Are there spending caps on bonus categories?

A good credit card combination should feel easy to use. If the setup is too complicated, it may not be worth it. The [ClearFin calculator](/#tool) does this math for you — enter your real monthly spending and it ranks every Canadian card by what it would actually earn you.

## Final answer: What is the best credit card combination Canada users should choose in 2026?

For many Canadians, the best credit card combination to start with in 2026 is a high-earning rewards card such as the [American Express Cobalt Card](/credit-cards/cobalt) paired with a reliable Mastercard or Visa backup such as the [Rogers Red Mastercard](/credit-cards/rogers-red), [Tangerine Money-Back Credit Card](/credit-cards/tangerine-money-back), or [MBNA Rewards World Elite Mastercard](/credit-cards/mbna-rewards-world-elite).

For people who prefer simplicity, a cash back setup may be better. For people who travel and enjoy maximizing value, points can offer more flexibility. The right choice in the cash back vs travel points decision depends on spending habits, card acceptance, annual fees, and redemption goals.`,
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

-- ClearFin blog: table, RLS, and the two launch posts.
-- Run in the Supabase SQL editor. Until this runs, the site serves the same
-- two posts from the static fallback in src/lib/blog.ts — once rows exist
-- here, they take over (keep slugs identical to update content in place).

create table if not exists blog_posts (
  slug         text primary key,
  title        text not null,
  description  text not null,
  body_md      text not null,
  cover_img    text,
  tags         text[] not null default '{}',
  author       text not null default 'ClearFin Team',
  published    boolean not null default true,
  published_at timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table blog_posts enable row level security;

drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts"
  on blog_posts for select
  using (published = true);

insert into blog_posts (slug, title, description, tags, published_at, updated_at, body_md) values
(
  'how-credit-card-points-work-canada',
  'How Credit Card Points Actually Work in Canada',
  'Aeroplan, Scene+, Membership Rewards, BMO Rewards — every program values a point differently. Here''s how to convert any points card into a real percentage return.',
  array['points','basics'],
  '2026-07-07T00:00:00Z',
  '2026-07-07T00:00:00Z',
  $md$Every Canadian bank advertises points, but none of them advertise what a point is worth. "5x points on groceries" sounds like 5% back — it usually isn't. This guide shows you how to translate any points card into a plain percentage so you can compare it against a simple cashback card.

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

Our calculator converts every points card to an estimated dollar return using conservative point values, so a "5x" card and a "4%" card are compared on the same scale. Try it with your own spending — the ranking usually surprises people.$md$
),
(
  'two-card-strategy-canada',
  'The Two-Card Strategy That Beats Any Single Card',
  'No single Canadian credit card wins every category. Pairing one category card with one flat-rate card typically adds $200–$400 a year over the best solo card.',
  array['strategy','cashback'],
  '2026-07-07T00:00:00Z',
  '2026-07-07T00:00:00Z',
  $md$Ask "what's the best credit card in Canada?" and you'll get a different answer from every blog. That's because the question is wrong. The best *card* loses to the best *pair* for almost every spending profile.

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

Run your real monthly numbers through the ClearFin calculator to find your category card, then use the compare tool to test it against a flat-rate partner. The right pair depends entirely on where your money actually goes.$md$
)
on conflict (slug) do update set
  title        = excluded.title,
  description  = excluded.description,
  body_md      = excluded.body_md,
  tags         = excluded.tags,
  updated_at   = now();

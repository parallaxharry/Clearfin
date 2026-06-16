# Card Detail Pages — Design Spec

**Date:** 2026-06-15
**Status:** Approved direction, pilot in progress
**Pilot card:** `amex-aeroplan` (richest `card_catalog` row)

## Goal

A FinlyWealth-style individual information page per credit card, driven by the rich
`card_catalog` data in Supabase. **No affiliate/rebate claims** — we do not yet have
FinlyWealth affiliate links, so the page must not promise anything we cannot honor.

## Key decisions

- **CTA:** link to the bank's official application page (`bankUrl` today; swap in
  `affiliate_url` later with no redesign). Logged via existing `/api/track-click`.
- **Rollout:** perfect ONE page (`amex-aeroplan`) with screenshot review, then generate all ~122.
- **Data source (Approach A):** new `/credit-cards/[id]` server component reads that card's
  row from `card_catalog` via the Supabase server client, merged with static `cards.ts` as
  fallback for core fields. `generateStaticParams` over all ids + ISR revalidate so Supabase
  edits go live without a redeploy. Existing homepage/tool/compare/top-picks stay on static
  `cards.ts` and are untouched.

## Honesty guardrails (hard requirements)

- No "rebate", "exclusive offer", "sign in to get this offer", "stacks on top of welcome bonus".
- No third-party trust marks we don't own (Trustpilot ratings, "paid out to Canadians", payout FX).
- No invented data. A section renders only when its `card_catalog` field is present and real
  (e.g. a card with no welcome bonus does not render the welcome-bonus section).
- CTA wording is a plain link to the bank, never implying a special deal.

## Page sections

1. **Hero** — card image, name, issuer; factual headline from `welcome_bonus.headline`;
   card `badge`; primary CTA "Apply on the {issuer} site →".
2. **Key-stats strip** — Annual Fee · Welcome Bonus value (`estimated_value_cad`) · top earn
   rate · Min income · est. credit-score range.
3. **How to earn the welcome bonus** — `welcome_bonus.stages`, `eligibility`, `offer_end_date`.
4. **Earn rates** — `rewards[]` with category icons.
5. **Fees & rates table** — `annual_fee`, `purchase_apr`, `fx_fee`, `min_income_personal`,
   `min_income_household`, credit-score range. Missing fields omitted, never invented.
6. **Built-in perks & coverage** — grid of `benefits[]` `{title, description}` with check icons.
7. **Pros / cons** — two columns from `pros[]` / `cons[]`.
8. **Footer CTA + disclosure** — repeat apply button; honest disclosure line → `/disclosures`.

## Data layer

- `getCard(id)` — server-side; fetch one `card_catalog` row; merge `cards.ts` fallback for
  core fields (name, issuer, annualFee, rates, img, bankUrl). Returns a typed `CardDetail`.
- `getAllCardIds()` — for `generateStaticParams`.
- Types model the rich jsonb shapes: `welcome_bonus`, `benefits[]`, `credit_score`,
  `earn_caps`, plus `rewards[] / pros[] / cons[]` text arrays.

## Routing / SEO

- Route: `src/app/credit-cards/[id]/page.tsx` (Next 16 App Router).
- `generateStaticParams`, ISR `revalidate`, `generateMetadata` (per-card title/description).
- **Read `node_modules/next/dist/docs/` before writing route code** (AGENTS.md: this Next has
  breaking changes vs. training data).

## Out of scope (for now)

- Wiring the rest of the site to `card_catalog` (future "B2").
- Affiliate links (slot into `affiliate_url` when FinlyWealth resumes).
- Pages for cards with empty `card_catalog` rows (revisit after enrichment).

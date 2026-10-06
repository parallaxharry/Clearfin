# Blog Content Pipeline — Design

**Date:** 2026-10-05
**Status:** Approved, ready for implementation plan

## Goal

Publish two solid blog posts every day, drafted by Claude against live card data
and approved by a human before they go live.

At roughly 60 posts a month the bottleneck is not writing, it is the publishing
mechanism and the accuracy guarantees. This spec covers both.

## Current state

Five posts exist, all hardcoded:

| Source | Posts |
| --- | --- |
| `src/lib/editorialBlogPosts.ts` | 2 (both render at top-level routes via a `path` override) |
| `src/lib/blog.ts` `FALLBACK_POSTS` | 3 |

`getPosts()` queries the `blog_posts` table first and falls back to these when the
query returns nothing. It always falls back today, for two independent reasons:

1. The table is empty (0 rows).
2. **RLS is enabled on `blog_posts` with no policies at all.** `card_catalog` and
   `card_cpp` each have a `Public read` policy; `blog_posts` has none, so the anon
   key the app reads with can never see a row even after rows are inserted.

Rendering is `ReactMarkdown` + `remarkGfm` in `BlogPostArticle`, so post bodies are
markdown with full GFM table support.

## Decision: posts are markdown files in the repo

One file per post at `content/blog/<slug>.md`.

```
---
title: Credit Cards With No Foreign Transaction Fees in Canada
description: Only five of the 122 cards we track waive the 2.5% FX fee.
tags: [travel, fees]
publishedAt: 2026-10-05
coverImg: /blog/no-fx-fees.jpg
---

## Body in markdown. GFM tables render.
```

Chosen over the two alternatives:

- **Supabase `blog_posts`** — would need an RLS policy plus a manual SQL paste from
  the user every single day, and posts would live outside git.
- **Appending to `editorialBlogPosts.ts`** — that file is already 14KB for two posts.

Files give per-post git history, no manual step for the user, and no RLS work.

### Loader

New `src/lib/blogFiles.ts`, roughly 40 lines: read `content/blog/*.md` at build
time, parse the frontmatter, return `BlogPost[]` in the existing shape. No new
dependency — the frontmatter is a fixed, small set of keys.

### Precedence

`getPosts()` becomes: database rows → file posts → `CODE_POSTS`.

The five existing posts keep working untouched. Nothing is migrated on day one.

### `blog_posts` table

Out of scope. With files chosen it is dead weight. Flagged for a later decision:
add a read policy, or drop the table. Not touched by this work.

## Daily workflow

1. User opens a session: "today's posts".
2. Claude takes the next two topics from the backlog.
3. Claude verifies every card fact against `card_catalog` live.
4. Claude drafts both `.md` files and shows the rendered result on localhost.
5. User approves or sends back.
6. Claude commits and pushes; Vercel deploys.

## Post shape

Each post is 1200–1600 words and contains:

- A first H2 of **"The Short Answer"** that answers the query outright, before
  any setup.
- At least one GFM table built from live catalog data — the piece of the post a
  competitor cannot copy without the same dataset.
- A worked example in dollars, using a realistic Canadian spend profile.
- Internal links to every card named (`/credit-cards/<id>`) and to the relevant
  best-X page.
- A short closing section on who the advice does *not* suit. Posts that only
  argue one side read as marketing.

No FAQ-schema padding, no restating the title as a heading, no filler sections
that exist to hit a word count.

## Competitive reference: FinlyWealth

Reviewed 2026-10-05. FinlyWealth is the affiliate partner and the closest
structural comparison.

| | FinlyWealth | ClearFin |
| --- | --- | --- |
| Post URL | `/blog/<category>/<slug>` | `/blog/<slug>` |
| Category pages | **None** — `/blog/credit-cards` 404s; filters are client-side | None |
| Archive size | ~29 pages of pagination | 5 posts |
| Index card | category, title, description, author, date, read time | tag, title, description, read time |
| Article page | breadcrumbs, TOC, fact-checked badge, author bios, FAQ, newsletter, affiliate CTAs | breadcrumbs, Article JSON-LD |
| Body | 2,200–2,400 words, prose only — no tables, no inline images | markdown with GFM tables available |

Two takeaways:

1. Their category-shaped URLs have no landing pages behind them. Copying the URL
   shape without the pages copies the defect, which is why this spec stays flat.
2. They write *about* cards in prose. The differentiator available here is
   publishing the numbers — live tables from 122 cards. This is already required
   by the Post shape section and is the main reason to keep that requirement.

Worth adopting from them: a table of contents, and "The Short Answer" as the
first H2 so the query is answered visibly, not just early.

## Page features

Decided 2026-10-05. Recorded so they are not revisited each session.

- **Table of contents — yes.** Auto-generated from the post's H2s.
- **Author bio and fact-check badge — no.** Deferred.
- **FAQ block with FAQPage schema — no.** Google has pulled back on showing these.
- **Related posts — no.** Revisit once the archive is large enough to make the
  links worth following.

## Accuracy rules

These are binding on every post.

- **Card facts come from `card_catalog` at draft time**, never from memory. Rates,
  fees, caps and bonuses change.
- **Merit ordering only.** Posts rank cards on the numbers, never on affiliate
  payout. The site's five disclosure statements depend on calculator, compare and
  best-X staying merit-ordered; posts arguing for specific cards sit in the same
  trust position.
- **Every card named links to its `/credit-cards/<id>` page.**
- **Rate and fee claims carry a date**, since they change.
- **No cents-per-point valuations.** The rate columns mix raw and cpp-baked
  conventions across issuers, and `point_value_cpp` is null on 51 of 122 cards.

## Data availability

Verified 2026-10-05 against the live catalog. Determines which topics are writable.

| Field | Coverage | Usable |
| --- | --- | --- |
| `fx_fee` | 121 / 122 | Yes |
| `earn_caps` | 122 / 122 non-empty | Yes |
| `annual_fee`, `first_year_free` | 122 / 122 | Yes |
| `purchase_apr` | 114 / 122 | Yes |
| `reward_program` | 108 / 122 | Yes |
| `rewards`, `pros` | 122 / 120 | Yes |
| `min_income_personal` | 56 / 122 | Partial — scope posts to the 56 |
| `point_value_cpp` | 71 / 122 | No — plus the convention problem above |
| `network` | 20 / 122 | No |
| `benefits` | **0 / 122 non-empty** | No — every value is `{}` |

`benefits` and `network` need a data backfill before any post can lean on them.
That backfill is its own piece of work, not part of this spec.

## Topic backlog

Ranked by search demand x data strength x gap in current coverage.

| # | Post | Leans on |
| --- | --- | --- |
| 1 | No Foreign Transaction Fee Credit Cards in Canada | `fx_fee` — only 5 of 122 |
| 2 | Which Bonus Categories Stop Paying: Earn Rate Caps | `earn_caps`, all 122 |
| 3 | Minimum Income Requirements, Card by Card | 56 cards, 8 need $100k+ |
| 4 | First-Year-Free Cards: Worth It After Year One? | 24 cards, $29–$199 |
| 5 | Credit Card Interest in Canada: What the APR Costs You | `purchase_apr`, 114 |
| 6 | Reward Programs Compared: Which Currency Suits You | 32 programs |
| 7 | No-Fee vs Paid: Where the Break-Even Actually Is | fees + rates |
| 8 | Credit Cards for Newcomers to Canada | income + credit score |
| 9 | Premium Cards Over $150: What You Get | 19 cards |
| 10 | Building Credit From Zero | credit score |
| 11 | Store Cards: Walmart, Shoppers, Amazon | catalog |
| 12 | Cash Back vs Points: The Honest Comparison | rates |

First two to be written: #1 and #2.

## Success criteria

- A new post is published by adding one file and pushing — no SQL, no code edit.
- The five existing posts keep rendering unchanged.
- `/blog` lists file posts alongside them, newest first.
- Every card fact in a published post matches `card_catalog` on its publish date.
- File posts render a table of contents; the five existing posts are unaffected
  whether or not they gain one.

## Known issue, not addressed here

The two editorial posts render at both `/blog/<slug>` (via the generic route) and
their top-level `path`. Whether the canonical handles this correctly is worth a
check, but it predates this work and is out of scope.

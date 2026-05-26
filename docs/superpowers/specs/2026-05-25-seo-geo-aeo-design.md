# ClearFin SEO / GEO / AEO Implementation Design

**Date:** 2026-05-25  
**Audit scores:** SEO 5/10 · GEO 4/10 · AEO 3/10  
**Scope:** All improvements are purely additive — no existing UI or functionality is changed.

---

## Context

ClearFin is a pre-launch, single-page Next.js 16 app (7 sections + `/privacy` + `/disclosures`) targeting Canadian credit card optimisation. The site has a strong factual foundation and clean technical setup but is almost entirely invisible to search and AI engines due to missing infrastructure. No robots.txt, no sitemap, no schema markup, no About page, no FAQ.

---

## What We're Building

Four layers of improvement, in priority order:

### Layer 1 — Technical crawlability (Critical, < 2 hrs total)

- `public/robots.txt` — allow all crawlers, point to sitemap
- `public/sitemap.xml` — list `/`, `/privacy`, `/disclosures` with `<lastmod>` and `<priority>`
- Explicit `<link rel="canonical">` set per-page via Next.js metadata
- `og:image` and `og:url` added to Open Graph metadata in `layout.tsx`
- Twitter Card meta tags added to `layout.tsx`

### Layer 2 — Schema markup (Critical, ~2 hrs total)

All schema added as JSON-LD `<script>` tags via Next.js `<Script>` or inline in `layout.tsx`/`page.tsx`. No visual change.

- **Organization** schema on every page (via layout): name, url, logo, contactPoint, sameAs (social links), address (Calgary AB)
- **WebSite** schema on homepage: name, url, potentialAction (SearchAction stub for future)
- **SoftwareApplication** schema on homepage: name, applicationCategory, operatingSystem, offers, description of the calculator
- **FAQPage** schema (added once FAQ section exists — deferred to Layer 4)

### Layer 3 — E-E-A-T infrastructure (High priority, ~1 dev-day)

New pages/sections, no changes to existing content:

- `/about` page: Company story, mission, founder/team section with names and brief bios, Calgary origin, independence statement
- `/about` includes **Person** schema for any named team members
- Footer updated to include social profile links (LinkedIn, X/Twitter) which feed the entity graph

### Layer 4 — AEO content (Medium priority, ~1 dev-day)

- `/faq` page: 10–15 Q&A pairs covering "which card is best for groceries in Canada," "how does ClearFin work," "is ClearFin free," etc. — each pair in a format eligble for PAA boxes
- FAQ page marked up with **FAQPage** JSON-LD schema
- Homepage H2 headings updated to incorporate target keywords while retaining brand voice (e.g., "How much cashback are you leaving behind?")
- Direct-answer paragraph (40–60 words) added below each question-format H2
- Card comparison bar chart converted to an accessible HTML `<table>` for table snippet eligibility
- **HowTo** schema added for the 5-step calculator process
- `<meta name="description">` expanded to 150–160 chars with CTA on all pages

---

## What We Are NOT Changing

- Visual design, animations, colour palette — untouched
- Section copy, hero headline, stats — untouched (stats are already strong GEO signals)
- Component architecture — no refactors
- Waitlist flow, Supabase integration — untouched
- Privacy and Disclosures page content — untouched

---

## Architecture

### Files modified
| File | Change |
|---|---|
| `src/app/layout.tsx` | Add og:image, og:url, twitter:*, canonical; add Organization + WebSite JSON-LD |
| `public/robots.txt` | New file |
| `public/sitemap.xml` | New file |
| `src/app/page.tsx` | Add SoftwareApplication JSON-LD; update H2s; add answer paragraphs; convert bar chart to table |

### Files created
| File | Purpose |
|---|---|
| `src/app/about/page.tsx` | About/Team page with Person schema |
| `src/app/faq/page.tsx` | FAQ page with FAQPage schema |
| `public/sitemap.xml` | Sitemap (static, update when pages added) |
| `public/robots.txt` | Crawl directives |

---

## Success Criteria

- `robots.txt` and `sitemap.xml` return 200 with correct content
- Google Rich Results Test passes for Organization and SoftwareApplication schema
- FAQPage schema validates in Google's Rich Results tester
- `/about` and `/faq` render correctly and are linked from footer nav
- No existing Lighthouse scores regress
- Meta description on all pages is 150–160 chars

---

## Out of Scope

- Backlink strategy (requires off-site work)
- Core Web Vitals optimisation (separate initiative)
- Google Search Console / Bing Webmaster Tools setup (user action, not code)
- Blog / content marketing (future initiative)
- Speakable schema (deferred — low ROI at this stage)

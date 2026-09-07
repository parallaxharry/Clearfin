# ClearFin QA roadmap — 6 September 2026

Progress: **9/38 implemented and tested**. Release verification is recorded in each batch's pull request.
Batch 1: CF-01, CF-04, CF-09, CF-10, CF-30. Batch 2: CF-06, CF-07, CF-08, CF-15.
Source: supplied "ClearFin — website QA and animation roadmap", reviewed against live-source commit c2d617271a14a0d0b457f7a5512ec4c8bb9842cf.
This is a tracked backlog, not a promise that untested findings are confirmed bugs.

## Core reliability

- [x] CF-01 — Keep calculator answers when moving between pages. (Batch 1)
- [ ] CF-02 — Calculate rewards with caps and merchant conditions.
- [ ] CF-03 — Use consistent card fees and rates across the site.
- [x] CF-04 — Check offer expiry against today's date. (Batch 1)
- [ ] CF-05 — Handle missing eligibility data and household-income alternatives.
- [x] CF-09 — Keep edited answers when pressing Back. (Batch 1)
- [x] CF-10 — Reset spending, income and credit score together. (Batch 1)
- [ ] CF-11 — Open the first calculator question from the main CTA.
- [ ] CF-13 — Save selected comparison cards in a shareable link.
- [ ] CF-14 — Highlight the actual comparison winner, including ties.
- [ ] CF-20 — Show exact fees consistently, including cents.
- [x] CF-30 — Test keyboard reentry and cancel abandoned step timers. (Batch 1; regression risk, not a confirmed pointer-click skip)

## Access and usability

- [x] CF-06 — Make comparison selectors work with the keyboard. (Batch 2)
- [x] CF-07 — Fix modal/search focus, Escape and return focus. (Batch 2)
- [x] CF-08 — Label inputs and announce form outcomes. (Batch 2)
- [ ] CF-12 — Add catalogue search, filters, sorting and result count.
- [x] CF-15 — Fix search keyboard shortcuts and selected-result behaviour. (Batch 2)
- [ ] CF-16 — Improve small comparison labels and spacing.
- [ ] CF-17 — Add carousel pause and respect reduced motion.
- [ ] CF-18 — Keep content visible if reveal animations fail.
- [ ] CF-19 — Add missing page headings without changing their wording.
- [ ] CF-21 — Improve waitlist validation and failure recovery.
- [ ] CF-22 — Add chat timeout, stop and retry.
- [ ] CF-29 — Add helpful not-found and error screens.

## Verification and maintenance

- [ ] CF-23 — Test mobile navigation and overlays on real phones.
- [ ] CF-24 — Test mobile comparison, forms and long card pages.
- [ ] CF-25 — Measure performance before adding richer animations.
- [ ] CF-26 — Check all card offers/content against current issuer terms.
- [ ] CF-27 — Verify tracking, consent and private-data exclusions.
- [ ] CF-28 — Verify API limits and deployment protections safely.
- [ ] CF-31 — Simplify styles and scroll handling after a visual baseline.
- [ ] CF-32 — Check long articles, FAQ, footer and information pages.

## Animation — after reliability, accessibility and performance checks

- [ ] AN-01 — Add a restrained layered-card hero animation.
- [ ] AN-02 — Add depth to the app-preview phone artwork.
- [ ] AN-03 — Add gentle card-grid entry and hover effects.
- [ ] AN-04 — Evaluate optional background movement.
- [ ] AN-05 — Add quick, nonblocking calculator/comparison feedback.
- [ ] AN-06 — Add restrained CTA-area movement.

## Batch 1 policy and boundaries

- One root-layout profile serves homepage, Calculator and Compare. Inputs save immediately.
- Profile exists only in memory while navigating within a tab. Full reload, a new tab or Restart uses the original defaults: dining $400, groceries $600, gas $150, travel $300, other $500, income $60,000 and credit score 720. No financial answers are added to browser storage or analytics.
- Date-only offer deadlines are inclusive through the stated date in America/Toronto. Explicit time-zone timestamps keep their exact instant. Unknown/ambiguous dates are not guessed; issuer freshness remains CF-26.
- Existing five-minute, request-driven page revalidation is retained. A first stale response can show the prior page while regeneration runs; this is not guaranteed midnight real-time switching.
- Preserve the current design, fonts, card economics and consent logic in this batch.
- Prioritize CF-02/03/05 as a coordinated, source-verified data/model change; do not guess 127 cards' caps or qualification rules.
- Real-phone testing, issuer verification, account-side analytics receipt and infrastructure protections are separate checks, not implied by a successful build.
- Animations are optional improvements, not required remedies for the confirmed reliability defects.

## Verification log

- 17 automated tests pass (8 profile/date checks and 9 existing consent/Meta checks).
- Focused ESLint and TypeScript pass; production build generates 162 routes. Local build used static fallback card data, not production database credentials.
- Isolated Chrome against the production-mode local server: grocery $1,000 retained across Back/forward and Calculator/Compare round trip; all seven answers reset; reload clears answers; repeated click/Enter advances once; leaving mid-transition and revisiting is safe; no uncaught browser errors.
- No real waitlist/chat/application submissions or new analytics profile fields.
- Run `npm run test:qa`; for browser checks, run a local production server on port 3100 then `npm run test:qa:browser` with Playwright installed or `PLAYWRIGHT_MODULE` pointing to an existing installation. `QA_BASE_URL` selects a verified deployment; `QA_BROWSER_CHANNEL=chrome` uses installed Chrome in an isolated test profile.
- Published in [PR #17](https://github.com/parallaxharry/Clearfin/pull/17), merged to main as e08d8e9bc187420cb8e415025f5d100a5730d30a.
- Vercel preview CPngq3f34jUqHKw6o4VTQ8hshcLX succeeded. [Production deployment](https://vercel.com/harrys-projects-9929d12d/clearfin/8UJwA4Q4ArjdTY4oce2PBDwavfGk) verified Ready for www.clearfin.ca, sourced from that main commit.
- Live browser check on www.clearfin.ca: dining $800 and groceries $1,000 retained across Back/forward, Compare (both columns), and return to Calculator. No warning/error logs in that checked journey; optional tracking declined. Full seven-field reset/reentry and offer-date boundary checks were performed locally, not by changing production data/time.
- Batch 1 left 33 items open; batch 2 below brings that to 29. Keep subsequent work in small verified batches, with the larger CF-02/03/05 product-model work separately source-verified.

## Batch 2 — keyboard, focus and input accessibility

- Based on current main 4a04dedb89bac099b2cdd80c90a0f23e2fb94c7a. No card economics, SEO copy, tracking configuration or backend routes changed.
- CF-06: native comparison trigger/clear buttons; labelled searchable comboboxes with Arrow/Enter selection, selected-option semantics, Escape/focus return, visible focus and clean Tab exit. Unknown searches keep a usable empty state.
- CF-07: one shared native-modal wrapper for Search, Top Picks and calculator card details. Initial focus, Tab/Shift+Tab wrapping, inert background, Escape, close buttons, return focus and nested-modal restoration. Calculator result cards also open from the keyboard.
- CF-08: slider labels/value descriptions, comparison search labels, early-access email autocomplete/label, persistent form success/error live regions, chat question label and error alerts. No new form submissions or personal-data collection were introduced.
- CF-15: only the search input handles Arrow/Enter shortcuts. Result/open and Compare actions are separate buttons in a labelled result grid; active-result IDs, visual grouping order and scrolling agree. Close/remove/Compare buttons keep their native Enter behaviour.
- Related small-screen corrections: restored the existing search icon on phones; stacked search actions/labels so result names remain readable. Existing colours/fonts/artwork retained.
- Automated browser coverage: comparison open/search/select/clear/empty/Escape/Tab; search nested controls and active-result navigation; all three modal flows plus nesting; input names and mocked form/chat outcome announcements; 390px/320px viewport checks. Existing calculator navigation/back/reset/reentry tests also pass.
- All 17 existing unit tests, focused ESLint, TypeScript and production build pass (162 generated routes; local static fallback catalogue). Test requests to waitlist, chat and click endpoints are intercepted with fixtures, not submitted to real services.
- Re-run with `npm run test:qa:accessibility`, using the same Playwright/runtime variables as the first browser suite. Small-screen screenshots are temporary QA outputs, not website assets.
- These are implementation and browser/ARIA checks, not a formal screen-reader certification or physical iOS/Android device audit; CF-23/24 remain open.
- References: [W3C modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [native dialog behaviour](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). Checked 6 September 2026.
- Release evidence is added to this batch's GitHub pull request after preview and production verification. Next compact backlog: shareable comparisons and correct winner emphasis (CF-13/14), plus missing headings/exact fee precision (CF-19/20).

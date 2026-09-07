# ClearFin QA roadmap — 6 September 2026

Progress: **20/38 implemented and tested**. Batches 1–4 are live; batch 5 release verification is recorded in its pull request.
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
- [x] CF-11 — Open the first calculator question from the main CTA. (Batch 4)
- [x] CF-13 — Save selected comparison cards in a shareable link. (Batch 3)
- [x] CF-14 — Highlight the actual comparison winner, including ties. (Batch 3)
- [x] CF-20 — Show exact fees consistently, including cents. (Batch 3)
- [x] CF-30 — Test keyboard reentry and cancel abandoned step timers. (Batch 1; regression risk, not a confirmed pointer-click skip)

## Access and usability

- [x] CF-06 — Make comparison selectors work with the keyboard. (Batch 2)
- [x] CF-07 — Fix modal/search focus, Escape and return focus. (Batch 2)
- [x] CF-08 — Label inputs and announce form outcomes. (Batch 2)
- [ ] CF-12 — Add catalogue search, filters, sorting and result count.
- [x] CF-15 — Fix search keyboard shortcuts and selected-result behaviour. (Batch 2)
- [x] CF-16 — Improve small comparison labels and spacing. (Batch 4)
- [x] CF-17 — Add carousel pause and respect reduced motion. (Batch 4)
- [x] CF-18 — Keep content visible if reveal animations fail. (Batch 4)
- [x] CF-19 — Add missing page headings without changing their wording. (Batch 3)
- [x] CF-21 — Improve waitlist validation and failure recovery. (Batch 5)
- [x] CF-22 — Add chat timeout, stop and retry. (Batch 5)
- [x] CF-29 — Add helpful not-found and error screens. (Batch 5)

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

## Batch 3 — comparison sharing, outcomes, headings and fee precision

- CF-13: selected cards are URL state, including deliberately empty slots. Unknown/repeated IDs cannot create duplicate panels. Manual changes, reload, Back/Forward and search-driven navigation preserve the pair. Copy comparison link shares only card IDs; recipients use their own spending defaults/profile. Clipboard failure exposes a selectable link.
- CF-14: winner emphasis follows the displayed whole-dollar net estimate, independent of slot order. Equal rounded estimates show the same tie label and styling; incomplete pairs have no winner.
- CF-19: Calculator, Compare and /blog/how-clearfin-helps have one primary heading and one main landmark. Calculator headings remain present through questions/results. Existing headline wording and class-based styling retained; homepage sections remain h2.
- CF-20: shared exact-cost formatting preserves cents in comparison fees, calculator results/modal fees, catalogue/search chips, card detail and additional-card fees. Estimated rewards retain whole-dollar rounding. Fee/rate source values and reward formulas were not changed; data reconciliation is still CF-03.
- Validation: 20 unit tests, focused ESLint, TypeScript and production build pass (162 routes). Browser checks pass for server/client headings, reload/history/copy/clear/invalid links, same-page search, winner swaps/ties, fee precision, clipboard fallback and 390px/320px layouts. Existing accessibility suite passes. Local build uses static catalogue fallback; real-phone testing remains open.
- Added npm run test:qa:comparison. Browser test submissions are mocked and the copy test uses an isolated clipboard fixture. No financial profile values are encoded in shared links.
- Release evidence is recorded in the batch 3 pull request. Progress: 13/38 implemented/tested; 25 remain. Next compact tasks: calculator entry CTA (CF-11), comparison label readability (CF-16), reduced-motion/pause controls (CF-17), and content visibility when animation fails (CF-18).

## Batch 4 — calculator entry, readability and motion controls

- CF-11: primary homepage/navigation CTAs open the first editable calculator question and focus its slider. The ordinary calculator URL retains its introduction. Existing in-memory answers and reset rules are unchanged.
- CF-16: comparison labels are at least 14px with clearer contrast and spacing. Full card names and issuer labels are no longer clipped; artwork fits its column. Panels stack on narrow screens. Browser checks cover 1440px, 720px reflow, 390px, 320px and 200% CSS zoom; physical-device and native browser-zoom certification remain separate.
- CF-17: visible pause/resume and previous/next controls; paused preference persists for the tab visit. Focus pauses until explicitly resumed. Hover, offscreen state, hidden tabs and reduced motion stop automatic rotation. Manual controls remain available; inactive cards are excluded from keyboard navigation and automatic updates are not announced.
- CF-18: reveal content and chart bars are visible by default. Optional Web Animations enhancement safely falls back if observers/animation APIs fail; reduced motion cancels entry animations.
- Validation: 20 unit tests, focused ESLint, TypeScript and a 162-route production build pass. New isolated Chrome suite verifies the entry CTA, real rotation/pause interval, visit persistence, manual/reduced-motion/offscreen controls, comparison text/artwork bounds and visibility with JavaScript disabled or animation/observer failures. Existing calculator Back/forward/profile/reset/reentry suite passes. Screenshots reviewed; local build uses static catalogue fallback.
- Run `npm run test:qa:usability` with the same Playwright/runtime variables as earlier suites. Browser write endpoints are mocked; no real waitlist/chat/application submissions. No card rates, fees, SEO URLs, tracking configuration or backend changes.
- References checked 7 September 2026: [W3C carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) and [Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate). These checks are not formal accessibility certification.
- Release evidence will be attached to this batch's pull request after preview and production verification. Progress: 17/38 implemented/tested; 21 remain. Next compact candidates: waitlist recovery CF-21, chat timeout/retry CF-22, helpful error/not-found screens CF-29.

## Batch 5 — recoverable signups, chat and page failures

- CF-21: API rejects malformed JSON/body types, invalid or overlong email addresses and invalid source values before storage. Valid addresses are trimmed/lowercased; duplicate success and new-lead-only tracking remain unchanged. Both waitlists have a 15-second timeout, input-preserving errors and explicit retry. In-flight/unmounted requests cannot update later attempts; malformed success responses are not treated as confirmed signups.
- CF-22: chat has Stop and Retry question controls. Requests stop after 20 seconds without data or 60 seconds overall; closing the panel cancels the current request. Failed/incomplete responses are discarded, with the question retained for manual retry and no duplicated history turn. Email and allowance gates remain enforced. Retrying may use another prompt allowance; the UI explains this. Browser cancellation does not guarantee backend work or accounting is rolled back.
- CF-29: branded 404, segment-error and global-error pages use the existing fonts/colours and safe recovery destinations. Next 16.2's unstable_retry refreshes and retries failed content. Recovery links use full navigation so they do not depend on a possibly broken client router. Error details are not shown. No loading boundary was added, to avoid changing existing response streaming/status behaviour.
- Validation: 21 unit tests (including API normalization, malformed bodies, duplicate/new lead outcomes), focused ESLint, TypeScript and production build pass. Browser fixtures verify both waitlist forms, network/malformed responses, timeouts, chat offline/error/empty/slow/stalled/broken streams, total deadline, stop/close/retry, email gates and allowance limits. Timers are advanced with the browser test clock. All write endpoints are intercepted; no real leads, emails or paid chat requests are sent.
- A temporary local-only route threw a real component error; the branded error boundary appeared and Try again restored the page after the injected failure was cleared. The fixture was removed before the final release build (162 routes). Unknown route returns an actual 404 with noindex; recovery links and 1280/390/320px reflow checked. Global fallback compiles with its own fonts/styles; a production root-layout failure was not induced.
- Re-run with npm run test:qa:recovery using the existing Playwright variables. QA_ERROR_FIXTURE=1 is local-only and requires recreating the temporary test component; do not add a public failure-trigger route. No issuer data, SEO content, analytics configuration or chat API quota policy changes. API-rate-limit/infrastructure validation remains CF-28.
- Release evidence is recorded in this batch's pull request. Progress: 20/38 implemented/tested; 18 remain. Next compact candidates: catalogue search/filter/sort CF-12 and long-article/footer checks CF-32. Source-verified card-model work, real phones, performance and optional animation items remain separate.

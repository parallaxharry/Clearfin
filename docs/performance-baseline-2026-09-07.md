# Performance baseline and scoped scroll cleanup — 7 September 2026

CF-31 is implemented for the shared homepage/early-access effects and progress bar. CF-25 remains **open**: this is a repeatable lab baseline, not physical-phone, field-performance or motion-prototype sign-off.

## Scope

Baseline: main `bb3e7d2bac8c1f140e6e539787ed21ddb8356712`. Removed obsolete section/hidden-rail processing from PageEffects, replaced scroll-driven React state with a coalesced animation-frame transform update, and consolidated the two progress-bar CSS rules. Resize and body-height changes update the indicator; listeners, observers and pending frames are cleaned up. Existing reveal fallbacks, reduced-motion handling and legacy hash destinations are retained.

This is not a whole-stylesheet refactor. Card economics, content, SEO URLs, tracking consent, APIs, fonts and artwork are unchanged. No new animations, packages or website image assets were added.

## Repeatable method

- Production-mode local Next build, static fallback catalogue, Chrome 152.0.7977.76, isolated contexts; three fresh-context runs per route before and after.
- 390 × 844 CSS-pixel viewport, DPR 1, normal motion, CDP 4× CPU slowdown, cache disabled, 150 ms network latency, 200,000 bytes/s download and 93,750 bytes/s upload.
- Initial navigation waits for network idle plus 1.8 seconds. Record LCP, FCP, initial encoded JavaScript bytes and maximum-session-window CLS excluding recent input. Then scroll top to bottom over 120 animation frames, recording frame intervals, browser layout counts, scripting time and legacy section-query counts.
- Action readiness measures automation wall time until the search dialog appears, calculator ArrowRight finishes, or catalogue Cobalt search yields one card. This is not field INP. Event Timing entries are diagnostics only; absent entries do not mean zero latency.
- Optional tracking is declined; waitlist, chat and click write endpoints are intercepted. No real submissions or paid chat requests.
- These are browser emulation results, not Lighthouse scores, cold-server guarantees, representative hardware or production traffic. Server/image caches, background work and external image availability can vary. Small timing differences are noise, not proof of a load-speed gain.

## Results — median of three runs

| Route | LCP ms before → after | CLS before → after | Scroll layouts before → after | Scroll JS ms before → after | Frame p95 ms before → after | Action ready ms before → after |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | 2128 → 2132 | 0.00090 → 0.00090 | 125 → 14 | 90.479 → 49.393 | 16.8 → 16.7 | 132 → 130 |
| Calculator, first question | 2140 → 2140 | 0.02446 → 0.02446 | 0 → 0 | 37.740 → 37.863 | 16.8 → 16.8 | 33 → 32 |
| Card catalogue | 2120 → 2128 | 0.05307 → 0.05307 | 35 → 34 | 46.802 → 43.663 | 16.8 → 16.7 | 64 → 64 |

Homepage legacy section lookups fell from 960 to zero and section bounding-box reads from 480 to zero in every controlled scroll. Median scroll scripting fell about 45%; this does **not** mean the website loads 45% faster. No additional CLS appeared during the observed scroll window. Initial encoded script transfer changed by only eight bytes per route; no bundle-size improvement is claimed.

Raw records: [before](performance/2026-09-07-before.json), [after](performance/2026-09-07-after.json), [visual comparison](performance/2026-09-07-visual.json).

## Functional and visual checks

- Progress positions 0%, 50% and 100% pass on homepage and early-access at 1440px and 390px widths. Body-height changes update progress without a new scroll. Old tool/compare/waitlist/hero hash links still reach their expected destinations; no uncaught browser errors.
- Twelve before/after screenshots reviewed. Eleven have no detected pixel differences. Desktop homepage at the bottom differs by 931 pixels (0.072%), limited to existing asynchronously loaded Amex/Scotiabank logos versus their text fallbacks. Layout and progress placement remain stable; those image sources/fallbacks were not changed. Screenshots remain temporary QA artifacts rather than shipped assets.
- 23 unit tests, focused ESLint, TypeScript and production build pass (162 routes). Existing usability/reduced-motion/failure-fallback regression checks also pass; final release results are recorded in the batch pull request.

## Run again

Use an installed Playwright package or set PLAYWRIGHT_MODULE to its location; QA_BROWSER_CHANNEL=chrome selects installed Chrome. Run a production-mode local server on port 3100, then:

```sh
npm run test:qa:performance
QA_CHECK_RESIZE=1 npm run test:qa:scroll
```

QA_BASE_URL selects the verified target; QA_RUNS defaults to 3; QA_ARTIFACT_DIR saves JSON or screenshots. Compare screenshot directories with `node scripts/qa-visual-diff.cjs before after`; PNG_MODULE and PIXELMATCH_MODULE can point to existing installations. The visual comparator permits less than 0.1% differing pixels per image, but differences still require human review.

## Still open before richer motion

CF-25 requires representative real-phone checks, field data when sufficient traffic exists, and a motion prototype tested against an agreed budget. None is claimed complete here. Standard field targets are LCP ≤ 2.5 seconds, INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile; a local median is not evidence that visitors meet them. See [Core Web Vitals](https://web.dev/articles/vitals).

Proposed, not yet owner-approved, lab guardrails for later motion work: no animation-induced CLS, frame-interval p95 ≤ 20 ms under these conditions, and investigate repeatable LCP regressions exceeding both 10% and 100 ms. These do not replace physical-device checks or field thresholds. Keep richer optional motion deferred while these checks remain open.

Preview, merge and public-site verification are recorded in the batch 7 pull request after deployment.

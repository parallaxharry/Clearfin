# Interaction feedback and closing CTA motion — 7 September 2026

Batch 11 completes AN-05 and AN-06 against production main 268e6596a0d30b98651e8a8701b211ce62e6ac47. The current blue/white design, visible wording, card economics and form behavior remain unchanged.

## Implemented

- Calculator values receive a 240 ms opacity/position confirmation whenever the displayed value changes. The value updates immediately; no count-up, delay, timer or focus change.
- Comparison value panels receive a 360 ms blue-tint confirmation when a selected card or its displayed estimate changes. Existing winner/tie labels and calculation order are unchanged.
- Homepage and early-access closing waitlists share one decorative background component: two soft blue light forms and two translucent card shapes. They have one 720–900 ms entrance and then remain completely still. The email form, copy, buttons and their hit areas never move.
- All new movement is CSS-only and runs only when the browser reports no motion reduction preference. Reduced-motion users receive the complete static experience. There is no ongoing animation to pause offscreen or in a hidden tab.
- Decorative elements are aria-hidden, ignore pointer input and are paint/layout contained behind the content. They cannot receive focus or cover the form. No new image, font, animation library, dependency, analytics field or network request.

## Verification

- 46 unit tests, focused ESLint, TypeScript and 162-route production build pass.
- New isolated Chrome suite checks immediate calculator value updates, comparison selection feedback, reduced-motion computed styles, one animation iteration, aria-hidden/pointer-safe decorations, unchanged form position after the entrance, no horizontal overflow and no browser errors at 390 px.
- Existing calculator and comparison browser suites pass: Back/navigation/reset/reentry, shareable pairs, winner/tie outcomes, fee precision and 390/320 px layouts. Page write endpoints are intercepted; no signup, chat, click or application is submitted.
- Desktop and 390 px full-page screenshots of homepage and early access were reviewed. The blue glass shapes stay at the outer edges and preserve the reading/form hierarchy. Screenshots are temporary QA artifacts, not shipped assets.

## Controlled mobile lab comparison

Three fresh runs per route before and after: production-mode local builds, Chrome 152, 390 × 844 CSS pixels, DPR 1, 4× CPU slowdown, cache disabled, 150 ms latency and 1.6 Mbps download. Initial navigation waited for network idle plus 1.2 seconds. The relevant interaction/scroll then settled for 950 ms. These are lab diagnostics, not physical-phone testing, field Core Web Vitals or conversion evidence.

| Route | LCP ms before → after | CLS before → after | Script bytes before → after | Action/settle ms before → after |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 1512 → 1572 | 0.00106 → 0.00090 | 247,910 → 247,948 | 1019 → 1010 |
| Early access | 1832 → 1856 | 0.00071 → 0.00071 | 235,644 → 235,671 | 1020 → 1021 |
| Calculator | 1688 → 1688 | 0.00079 → 0.00079 | 240,174 → 240,212 | 984 → 981 |
| Compare | 1840 → 1864 | 0.01236 → 0.01236 | 237,958 → 238,001 | 1092 → 1091 |

No route added observed layout shift. LCP changes were 0–60 ms and below both prior proposed investigation thresholds (more than 10% and more than 100 ms). Script transfer increased by 27–43 bytes. Interaction measurements include the fixed 950 ms observation wait and are useful only as relative lab checks. Raw local output is reproducible with npm run test:qa:motion-performance using QA_BEFORE_URL and QA_AFTER_URL.

## Boundaries

- AN-05 and AN-06 are implementation/browser checks, not proof that animation improves conversion.
- CF-23/24 physical-phone checks and CF-25 field data/real-hardware motion sign-off remain open. The restrained CSS effects stay within the recorded lab guardrails but do not complete those tasks.
- Optional layered hero, app-depth, catalogue-card and background-motion tasks AN-01–04 remain open. This batch does not imply their visual direction is approved.
- No issuer data, reward formula, SEO content/path, analytics consent, API, database, hosting setting or dependency version changed.

Release evidence and final public-site checks are recorded in the pull request.

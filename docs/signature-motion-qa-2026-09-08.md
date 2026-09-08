# ClearFin signature-motion QA — 2026-09-08

## Result

- AN-01: the existing hero cards assemble into their layered fan over 1.45 seconds, then use only the existing card rotation and a very small fine-pointer depth response. Text and calls to action do not move.
- AN-02: the app-preview phone, screen layers and two small callouts settle once as the section enters view. Desktop artwork receives a tiny scroll-linked offset; mobile receives the shorter static-friendly treatment.
- AN-03: Top Picks and newly visible catalogue cards enter once. Fine-pointer hover adds a light reflection over artwork; touch does not depend on hover.
- AN-04: optional background movement was evaluated and kept to two existing decorative layers. They move at different speeds within an 18-pixel total page-scroll budget. No new asset, canvas, WebGL scene or animation library was added.
- Reduced-motion mode removes the hero, phone, grid, sheen and background animations. All base content remains visible if observers or the Web Animations API are unavailable.

## Browser verification

Isolated Chrome checks confirm:

- the hero entrance is finite, between 1.2 and 1.8 seconds, and has one iteration;
- pointer movement changes only the hero artwork depth and resets on exit;
- the app preview and its layers animate once after entering view;
- Top Picks and catalogue cards animate only when first seen in the current mounted view;
- sheen is restricted to hover-capable fine pointers;
- the 390-pixel touch layout has no horizontal overflow;
- reduced-motion mode has no signature-motion animations;
- no uncaught browser errors or form/application submissions occurred.

Settled desktop screenshots of the hero, card grid and app preview were reviewed before release.

## Controlled mobile-width performance comparison

Chrome 152, 390×844, DPR 1, four-times CPU slowdown, 150 ms latency, 1.6 Mbps download, cache disabled, three fresh contexts per route. Both variants were local production builds from the same product-data baseline; the after build differed only by this motion batch.

| Route | LCP before → after | CLS before → after | Script bytes before → after | Action ready before → after |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 1,484 → 1,516 ms | 0.00090 → 0.00090 | 250,042 → 251,238 | 1,013 → 999 ms |
| Early access | 1,852 → 1,868 ms | 0.00071 → 0.00069 | 237,716 → 238,505 | 993 → 998 ms |
| Calculator | 1,692 → 1,704 ms | 0.00079 → 0.00079 | 242,306 → 242,998 | 982 → 982 ms |
| Compare | 1,848 → 1,840 ms | 0.01236 → 0.01236 | 240,139 → 240,831 | 1,090 → 1,086 ms |

Median LCP differences ranged from -8 to +32 ms; action readiness ranged from -14 to +5 ms. No median layout shift increased. Script transfer rose by 692–1,196 bytes. These small lab differences are treated as within run noise, not as proof of faster or slower field performance.

Run `npm run test:qa:signature-motion` for behavior and `npm run test:qa:motion-performance` for the repeated measurement. This is a lab validation, not physical-phone or field Core Web Vitals evidence; CF-23, CF-24 and CF-25 remain open for that external evidence.

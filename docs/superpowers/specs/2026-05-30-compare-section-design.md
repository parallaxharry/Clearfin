# Compare Section — Design Spec
**Date:** 2026-05-30  
**Status:** Approved

---

## Overview

Replace the static bar-chart placeholder in Section 05 with an interactive side-by-side card comparison tool. Users pick two Canadian credit cards via searchable dropdowns and see a full breakdown of each card's value against their spending profile — identical in content to the card detail modal in the calculator.

---

## Layout & UX

- **Two cards only** — not three. Side-by-side columns, equal width.
- **"vs" badge** between the two selector slots.
- Each card column is visually and informationally identical to the existing card detail modal in `InteractiveTool.tsx`:
  - Card image (spinner style)
  - Badge (e.g. "🍽️ Best for Dining")
  - Card name + issuer
  - Net value / year (large, accent-coloured)
  - Perks list (✦ dots)
  - "How we calculated this" breakdown table: Category / Monthly / Rate / Per year rows, then Gross rewards → Annual fee (red) → Net value
  - Apply button linking to `bankUrl`
- Rank bar at the top of each column (#1 Best for your spend / #2) based on net value score.

### Card Selector

- Two slots, each with a searchable text input.
- Dropdown filters the full `CARDS` array by name or issuer as user types.
- Dropdown items show: card name, issuer, and net value for current spend.
- Selected card shows name + ✕ to clear.
- Default on load: top 2 cards scored against current `spend`.

### Empty / partial state

- If `spend` is all zeros (calculator not yet run), use default spend values: `{ dining: 400, grocery: 600, gas: 150, travel: 300, other: 500 }`.
- If only one card is selected, show one full column and a placeholder column prompting the user to pick a second card.

---

## Architecture

### New file: `src/lib/cards.ts`

Extract from `InteractiveTool.tsx` into a shared module:
- `CardDef` interface
- `SpendKey` type
- `CARDS` array
- `CAT_LABELS` record
- `fmt(n)` helper
- `fmtRate(r)` helper
- `getBreakdown(card, spend)` helper
- `scoreCard(card, spend)` helper
- `getTopCards(spend, n)` helper
- `STEPS` array

### Modified: `src/components/InteractiveTool.tsx`

- Remove all extracted symbols (import from `@/lib/cards` instead).
- Accept `spend` and `onSpendChange` props instead of owning `spend` state internally:
  ```ts
  interface InteractiveToolProps {
    spend: Record<SpendKey, number>;
    onSpendChange: (spend: Record<SpendKey, number>) => void;
  }
  ```

### Modified: `src/app/page.tsx`

- Lift `spend` state up:
  ```ts
  const [spend, setSpend] = useState<Record<SpendKey, number>>({
    dining: 400, grocery: 600, gas: 150, travel: 300, other: 500,
  });
  ```
- Pass to InteractiveTool: `<InteractiveTool spend={spend} onSpendChange={setSpend} />`
- Replace static Section 05 with: `<CompareSection spend={spend} />`
- Import `SpendKey` from `@/lib/cards`.

### New file: `src/components/CompareSection.tsx`

- `"use client"`
- Props: `{ spend: Record<SpendKey, number> }`
- Internal state:
  - `selectedIds: [string | null, string | null]` — defaults to top 2 card IDs by score
  - `queries: [string, string]` — search input values
  - `openSlot: 0 | 1 | null` — which dropdown is open
- Renders:
  - Section shell (`<section id="compare">`) with section number, header text
  - Two selector slots with search inputs and filtered dropdowns
  - Two card columns (or one + placeholder)
  - Disclaimer text

---

## Styling

- Follows existing CSS variable system (`--bg`, `--ink`, `--accent`, `--accent-warm`, etc.)
- Card A accent: `--accent` (`#9BC5FF`) — blue
- Card B accent: `--accent-warm` (`#E7D9B7`) — warm
- Annual fee row: `#FF8B8B` (red, same as modal)
- All new CSS goes into `globals.css` under a `/* ── COMPARE SECTION ── */` block
- Section structure matches existing sections (`section-num`, `feat-wrap`-style layout, `section-divider-bottom`)

---

## Nav

Add a "Compare" link to `Nav.tsx`: `<a href="#compare">Compare</a>` alongside the existing Calculator / Cards / Features / Waitlist links.

---

## Out of scope

- Mobile responsive layout (can be addressed in a follow-up)
- Sharing/saving a comparison
- More than 2 cards

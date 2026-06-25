# Site-wide Search — Design Spec

**Date:** 2026-06-24
**Status:** Approved (brainstorming) — pending implementation plan

## Goal

A global search bar that lets a visitor find anything on ClearFin — credit cards
and pages — and jump straight to the relevant page. A compact "Search… ⌘K" box
in the nav expands into a centered overlay palette with live, grouped results.

## Interaction model (decided)

- **Compact box → overlay palette.** A small "Search… ⌘K" box sits in the nav.
  Clicking it (or pressing **⌘K / Ctrl-K** anywhere) opens a centered overlay
  palette: large input + live results.
- Results are **grouped** and each links to its page; selecting a result closes
  the palette and navigates.

## Scope

**Indexed content (decided: "search anything"):**

- **Cards** (~121): match on `name` + `issuer` → `/credit-cards/{id}`.
- **Guides**: `/best-credit-cards-canada`, `/best-cashback-credit-cards-canada`,
  `/best-travel-credit-cards-canada`, `/best-student-credit-cards-canada`,
  `/best-no-fee-credit-cards-canada`, `/credit-card-rewards-canada-guide`.
- **Pages**: `/faq`, `/about`, `/disclosures`.
- **Tools** (home anchors): Calculator (`/#tool`), Compare (`/#compare`).

**Out of scope:** full-text search of page body content; typo/fuzzy tolerance;
recent-search history; search analytics. (Possible follow-ups.)

## Architecture (Option A — root-layout provider)

The site has **three** separate nav surfaces (home `Nav`, the shared `seo-nav`
in `SeoLayout`, and the card-detail page header). To be truly site-wide, the
search index + palette live **once** at the root layout; a small trigger is
dropped into each nav.

- **`getSearchCards()`** — server function (in `cardDetail.ts`): selects
  `id, name, issuer, img` from `card_catalog`, with `cards.ts` fallback, wrapped
  in `cache()`. Returns `SearchCard[]`.
- **`src/lib/searchIndex.ts`** — static `PAGES` manifest (`title`, `group`,
  `href`, `keywords[]`) for guides/pages/tools, plus the shared types and a
  pure `searchAll(query, cards)` matcher used by the palette.
- **Root layout** (`src/app/layout.tsx`, made `async`) — calls
  `getSearchCards()` and wraps `{children}` in `<SearchProvider cards={...}>`.
- **`SearchProvider`** (`src/context/SearchContext.tsx`, client) — context with
  `{ isOpen, open(), close() }`; holds the card list; registers the global
  ⌘K/Ctrl-K listener; renders `<SearchPalette>` once (fixed overlay).
- **`SearchTrigger`** (`src/components/SearchTrigger.tsx`, client) — the compact
  "Search… ⌘K" box; calls `open()`. Added to `Nav.tsx`, `SeoLayout` `seo-nav`,
  and the card-detail page header. Collapses to an icon on narrow widths.
- **`SearchPalette`** (`src/components/SearchPalette.tsx`, client) — the overlay:
  autofocused input, live grouped results, keyboard nav, links out.

## Data shapes

```ts
interface SearchCard { id: string; name: string; issuer: string; img: string }
interface SearchPage { title: string; group: "Guide" | "Page" | "Tool"; href: string; keywords: string[] }
// Unified result rendered in the palette:
interface SearchResult { type: "card" | "page"; label: string; sublabel: string; href: string; img?: string; group: string }
```

## Search behavior

- Query is lowercased + trimmed.
- **Cards**: include if `name` or `issuer` contains the query; rank
  `name.startsWith(query)` first, then other matches; cap at **6**.
- **Pages/Guides/Tools**: include if `title` or any `keyword` contains the query;
  small set, no cap.
- **Empty query**: show a short default list — the Guides + Tools, with a hint
  "Type to search 120+ cards". (No card results until the user types.)
- **No matches**: "No results for '<query>'".
- **Group order** in the palette: Cards · Guides · Pages · Tools.

## Keyboard & interaction

- **Open**: click the trigger, or ⌘K / Ctrl-K anywhere.
- **Close**: Esc, click backdrop, or after navigating.
- **↑ / ↓**: move the highlight across the flat (cross-group) result list;
  **Enter** navigates the highlighted result.
- Input autofocuses on open; body scroll is locked while open; focus returns to
  the trigger on close.

## Styling (matches the site's dark theme)

- Backdrop `rgba(0,0,0,.6)` + `backdrop-filter: blur`; panel = dark surface,
  rounded, `1px var(--line-strong)` border; highlighted row tinted with
  `--accent-warm`; group labels + the ⌘K hint in JetBrains Mono.
- Card results show a small thumbnail (fallback: issuer initials block).
- Z-index above the nav (nav is `z 100`; palette backdrop ~`1000`).
- `@media (prefers-reduced-motion: reduce)`: no transitions.

## Accessibility

- Overlay `role="dialog" aria-modal="true"`; input `aria-label="Search ClearFin"`.
- Result list announces the active option (aria-activedescendant or simple
  highlighted `<Link>`s); Esc closes; focus management as above.

## Edge cases

- **Supabase down** → `getSearchCards()` returns the `cards.ts` fallback; search
  still works.
- **Card with no image** → initials/issuer placeholder thumbnail.
- **Id alias** (`cobalt` vs `Amex-cobalt`) → index keys off `cards.ts` ids;
  dedupe by id; links use that id (the detail route already resolves the alias).
- **Three navs** → `SearchTrigger` is one shared component; verify it fits each
  nav (home `nav-links`, `seo-nav` logo+CTA, card header logo+CTA); icon-only
  variant on small screens.

## Files touched

- **New**: `src/lib/searchIndex.ts`, `src/context/SearchContext.tsx`,
  `src/components/SearchTrigger.tsx`, `src/components/SearchPalette.tsx`.
- **Edit**: `src/lib/cardDetail.ts` (+`getSearchCards`), `src/app/layout.tsx`
  (async + provider), `src/components/Nav.tsx`, `src/components/SeoLayout.tsx`,
  `src/app/credit-cards/[id]/page.tsx` (header trigger), `src/app/globals.css`
  (palette + trigger styles).

## Verification

- `tsc` clean; dev build compiles.
- Manual: ⌘K opens on home, a `/best-*` page, and a detail page; typing
  "cobalt" → card result → `/credit-cards/cobalt`; "cashback" → guide page;
  "faq" → `/faq`; Esc and backdrop close; arrow-key + Enter navigation works.

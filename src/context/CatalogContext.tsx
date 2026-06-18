"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CardDef } from "@/lib/cards";
import type { CatalogDisplay } from "@/lib/cardDetail";

/*
 * Supplies Supabase card_catalog DISPLAY fields to the home page's client
 * components. The catalog is fetched server-side (page.tsx) and passed in here.
 * Only display fields are overlaid — rates / annual fee / all reward MATH stay
 * on the static cards.ts, so the calculator's numbers are unchanged.
 */

export type CatalogMap = Record<string, CatalogDisplay>;

const CatalogContext = createContext<CatalogMap>({});

export function CatalogProvider({ map, children }: { map: CatalogMap; children: ReactNode }) {
  return <CatalogContext.Provider value={map}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogMap {
  return useContext(CatalogContext);
}

/**
 * Overlay catalog display fields onto a static card, matched by id.
 * Falls back to the card's own value when the catalog lacks a field or the id
 * isn't in the catalog. `perks` is replaced by the catalog's `rewards` list.
 * Never touches `rates` or `annualFee` (the calculator's math inputs).
 */
export function withCatalog<T extends CardDef>(card: T, map: CatalogMap): T {
  const info = map[card.id];
  if (!info) return card;
  return {
    ...card,
    name: info.name ?? card.name,
    issuer: info.issuer ?? card.issuer,
    img: info.img ?? card.img,
    badge: info.badge ?? card.badge,
    bankUrl: info.bankUrl ?? card.bankUrl,
    perks: info.rewards.length > 0 ? info.rewards : card.perks,
  };
}

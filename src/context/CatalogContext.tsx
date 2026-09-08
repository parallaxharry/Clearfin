"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CardDef } from "@/lib/cards";
import type { CatalogDisplay } from "@/lib/cardDetail";

/*
 * Supplies one server-resolved product record to client views. Card detail,
 * catalogue, calculator and comparison therefore use the same fee/rate version.
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
 * Overlay the authoritative server-resolved fields onto a static card.
 * Calculator-only cap rules remain on the local card definition.
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
    annualFee: info.annualFee,
    rates: info.rates,
  };
}

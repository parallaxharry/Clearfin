"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CatalogDisplay } from "@/lib/cardDetail";

// Server-fetched display, eligibility and reviewed calculation inputs.
export type CatalogMap = Record<string, CatalogDisplay>;

const CatalogContext = createContext<CatalogMap>({});

export function CatalogProvider({ map, children }: { map: CatalogMap; children: ReactNode }) {
  return <CatalogContext.Provider value={map}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogMap {
  return useContext(CatalogContext);
}

export { withCatalog } from "@/lib/rewardModel";

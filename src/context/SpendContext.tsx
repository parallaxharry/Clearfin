"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SpendKey, DEFAULT_SPEND } from "@/lib/cards";

interface SpendContextValue {
  spend: Record<SpendKey, number>;
  setSpend: (spend: Record<SpendKey, number>) => void;
}

const SpendContext = createContext<SpendContextValue>({
  spend: DEFAULT_SPEND,
  setSpend: () => {},
});

export function SpendProvider({ children }: { children: ReactNode }) {
  const [spend, setSpend] = useState<Record<SpendKey, number>>(DEFAULT_SPEND);
  return (
    <SpendContext.Provider value={{ spend, setSpend }}>
      {children}
    </SpendContext.Provider>
  );
}

export function useSpend() {
  return useContext(SpendContext);
}

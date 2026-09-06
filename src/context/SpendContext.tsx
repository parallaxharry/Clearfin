"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { SpendKey } from "@/lib/cards";
import { createDefaultProfile, spendProfileReducer, type SpendProfile } from "@/lib/spendProfile";

interface SpendContextValue extends SpendProfile {
  setSpend: (spend: Record<SpendKey, number>) => void;
  setIncome: (income: number) => void;
  setCredit: (credit: number) => void;
  resetProfile: () => void;
}

const SpendContext = createContext<SpendContextValue | null>(null);

export function SpendProvider({ children }: { children: ReactNode }) {
  // Root-layout state survives internal navigation. A reload/new tab starts fresh;
  // financial answers are not written to browser storage or sent to analytics.
  const [profile, dispatch] = useReducer(spendProfileReducer, undefined, createDefaultProfile);
  return (
    <SpendContext.Provider value={{
      ...profile,
      setSpend: (value) => dispatch({ type: "spend", value }),
      setIncome: (value) => dispatch({ type: "income", value }),
      setCredit: (value) => dispatch({ type: "credit", value }),
      resetProfile: () => dispatch({ type: "reset" }),
    }}>
      {children}
    </SpendContext.Provider>
  );
}

export function useSpend() {
  const context = useContext(SpendContext);
  if (!context) throw new Error("useSpend must be used within SpendProvider");
  return context;
}

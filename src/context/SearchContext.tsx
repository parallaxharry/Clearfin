"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { SearchCard } from "@/lib/searchIndex";
import SearchPalette from "@/components/SearchPalette";

interface SearchContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

/**
 * Site-wide search. Fed the card index from the server (root layout). Owns the
 * open/close state, the global ⌘K / Ctrl-K shortcut, and renders the palette.
 */
export function SearchProvider({ cards, children }: { cards: SearchCard[]; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchContext.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && <SearchPalette cards={cards} onClose={close} />}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  return useContext(SearchContext);
}

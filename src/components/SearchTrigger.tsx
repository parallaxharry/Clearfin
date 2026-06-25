"use client";

import { useSearch } from "@/context/SearchContext";

/** Magnifying-glass icon button that opens the search palette. */
export default function SearchTrigger({ className = "" }: { className?: string }) {
  const { open } = useSearch();

  return (
    <button
      type="button"
      className={`search-trigger ${className}`.trim()}
      onClick={open}
      aria-label="Search"
      title="Search (⌘K)"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );
}

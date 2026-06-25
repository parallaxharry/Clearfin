"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchAll, GROUP_ORDER, type SearchCard } from "@/lib/searchIndex";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function SearchPalette({
  cards,
  onClose,
}: {
  cards: SearchCard[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchAll(query, cards), [query, cards]);
  const isPopular = query.trim() === "";

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r.href);
    }
  };

  // Grouped rows for the typed state; flat index drives arrow-key nav.
  let flatIdx = -1;
  const sections = GROUP_ORDER.map((g) => ({
    group: g,
    items: results.filter((r) => r.group === g),
  })).filter((s) => s.items.length > 0);

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search ClearFin"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel" onKeyDown={onKeyDown}>
        <div className="search-input-row">
          <span className="search-input-icon">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search cards, guides, pages…"
            aria-label="Search ClearFin"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-esc" onClick={onClose} aria-label="Close search">
            esc
          </button>
        </div>

        <div className="search-results">
          {isPopular ? (
            <div className="search-pop">
              <div className="search-group-label">Popular searches</div>
              <div className="search-pills">
                {results.map((r, i) => (
                  <button
                    key={r.key}
                    className={`search-pill${i === active ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            sections.map((section) => (
              <div className="search-group" key={section.group}>
                <div className="search-group-label">{section.group}</div>
                {section.items.map((r) => {
                  flatIdx += 1;
                  const idx = flatIdx;
                  return (
                    <button
                      key={r.key}
                      className={`search-item${idx === active ? " is-active" : ""}`}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(r.href)}
                    >
                      {r.type === "card" && r.img ? (
                        <span className="search-item-thumb">
                          <Image src={r.img} alt="" width={44} height={28} />
                        </span>
                      ) : (
                        <span className="search-item-ico" aria-hidden="true">
                          ↗
                        </span>
                      )}
                      <span className="search-item-text">
                        <span className="search-item-label">{r.label}</span>
                        {r.sublabel && <span className="search-item-sub">{r.sublabel}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="search-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

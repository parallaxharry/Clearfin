"use client";

import { useState, useMemo, useEffect, useRef, useCallback, useId } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchAll, GROUP_ORDER, type SearchCard, type RichSearchCard } from "@/lib/searchIndex";
import Modal from "@/components/Modal";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// Rich index survives palette open/close for the session; refetched per page load.
let richIndexCache: RichSearchCard[] | null = null;

/** Wraps matched terms in <mark> so the user sees why a result surfaced. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const escaped = terms
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark className="search-mark" key={i}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
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
  const [rich, setRich] = useState<RichSearchCard[] | null>(richIndexCache);
  // Cards tagged for comparison (max 2). Only cards.ts cards are comparable —
  // the compare page's math needs their rates.
  const [compare, setCompare] = useState<{ id: string; name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const router = useRouter();
  const comparableIds = useMemo(() => new Set(cards.map((c) => c.id)), [cards]);

  // Load the rich attribute index once per session. Until it arrives the lean
  // name/issuer search works; results silently upgrade when it lands.
  useEffect(() => {
    if (richIndexCache) return;
    let alive = true;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: RichSearchCard[] | null) => {
        if (data && alive) {
          richIndexCache = data;
          setRich(data);
        }
      })
      .catch(() => {}); // search still works on the lean index
    return () => {
      alive = false;
    };
  }, []);

  // Keyboard order must match the visually grouped order, including page results.
  const results = useMemo(() => {
    const matches = searchAll(query, cards, rich);
    return query.trim() ? GROUP_ORDER.flatMap((group) => matches.filter((r) => r.group === group)) : matches;
  }, [query, cards, rich]);
  const isPopular = query.trim() === "";
  const activeIndex = Math.min(active, Math.max(0, results.length - 1));
  useEffect(() => {
    document.getElementById(`${resultsId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results, resultsId]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const toggleCompare = (id: string, name: string) => {
    setCompare((prev) => {
      if (prev.some((c) => c.id === id)) return prev.filter((c) => c.id !== id);
      if (prev.length >= 2) return [prev[1], { id, name }]; // keep the newest two
      return [...prev, { id, name }];
    });
  };

  const goCompare = () => {
    if (compare.length !== 2) return;
    const ids = compare.map((c) => c.id);
    onClose();
    router.push(`/compare-credit-cards-canada?compare=${ids.join(",")}`);
    // Same-page case: the compare page is already mounted and listens for this.
    window.dispatchEvent(new CustomEvent("clearfin:compare", { detail: { ids } }));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.max(0, Math.min(activeIndex + 1, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIndex];
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
    <Modal label="Search ClearFin" onClose={onClose} initialFocusRef={inputRef}>
    <div
      className="search-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel">
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
            role="combobox"
            aria-haspopup="grid"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls={results.length ? resultsId : undefined}
            aria-activedescendant={results.length ? `${resultsId}-${activeIndex}` : undefined}
            value={query}
            onChange={(e) => { setActive(0); setQuery(e.target.value); }}
            onKeyDown={onKeyDown}
          />
          <button className="search-esc" onClick={onClose} aria-label="Close search">
            esc
          </button>
        </div>

        <div className="search-results" id={resultsId} role={results.length ? "grid" : undefined} aria-label={results.length ? "Search results" : undefined}>
          {isPopular ? (
            <div className="search-pop" role="rowgroup" aria-label="Popular searches">
              <div className="search-group-label" aria-hidden="true">Popular searches</div>
              <div className="search-pills">
                {results.map((r, i) => (
                  <div key={r.key} role="row" id={`${resultsId}-${i}`} aria-selected={i === activeIndex}>
                  <div role="gridcell">
                  <button
                    type="button"
                    className={`search-pill${i === activeIndex ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                  >
                    {r.label}
                  </button>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty" role="status">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            sections.map((section) => (
              <div className="search-group" key={section.group} role="rowgroup" aria-label={section.group}>
                <div className="search-group-label" aria-hidden="true">{section.group}</div>
                {section.items.map((r) => {
                  flatIdx += 1;
                  const idx = flatIdx;
                  const inCompare = compare.some((c) => c.id === r.key);
                  const canCompare = r.type === "card" && comparableIds.has(r.key);
                  return (
                    <div
                      key={r.key}
                      role="row"
                      id={`${resultsId}-${idx}`}
                      aria-selected={idx === activeIndex}
                      className={`search-item${idx === activeIndex ? " is-active" : ""}`}
                      onMouseEnter={() => setActive(idx)}
                      onFocusCapture={() => setActive(idx)}
                    >
                      <div role="gridcell" className="search-open-cell">
                      <button type="button" className="search-result-open" onClick={() => go(r.href)}>
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
                        <span className="search-item-row">
                          <span className="search-item-label">{r.label}</span>
                          {r.fee && (
                            <span className={`search-chip${r.fee === "No fee" ? " search-chip-free" : ""}`}>
                              {r.fee}
                            </span>
                          )}
                          {r.badgeChip && <span className="search-chip">{r.badgeChip}</span>}
                        </span>
                        {r.snippet ? (
                          <span className="search-item-snippet">
                            <span className="search-snip-check" aria-hidden="true">✓</span>
                            <Highlight text={r.snippet} terms={r.terms ?? []} />
                          </span>
                        ) : (
                          r.sublabel && <span className="search-item-sub">{r.sublabel}</span>
                        )}
                      </span>
                      </button>
                      </div>
                      {canCompare && (
                        <div role="gridcell">
                        <button
                          type="button"
                          className={`search-cmp-btn${inCompare ? " is-on" : ""}`}
                          aria-pressed={inCompare}
                          aria-label={
                            inCompare
                              ? `Remove ${r.label} from comparison`
                              : `Add ${r.label} to comparison`
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(r.key, r.label);
                          }}
                        >
                          {inCompare ? "✓" : "+"} Compare
                        </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {compare.length > 0 && (
          <div className="search-tray">
            <span className="search-tray-label">Compare</span>
            {compare.map((c) => (
              <span className="search-tray-chip" key={c.id}>
                {c.name}
                <button
                  type="button"
                  className="search-tray-x"
                  aria-label={`Remove ${c.name}`}
                  onClick={() => setCompare((prev) => prev.filter((p) => p.id !== c.id))}
                >
                  ✕
                </button>
              </span>
            ))}
            {compare.length < 2 ? (
              <span className="search-tray-hint">pick one more card</span>
            ) : (
              <button type="button" className="search-tray-go" onClick={goCompare}>
                Compare side by side →
              </button>
            )}
          </div>
        )}

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
    </Modal>
  );
}

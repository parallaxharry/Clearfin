"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useEffect, useRef, useId } from "react";
import { useSearchParams } from "next/navigation";
import { comparisonQuery, comparisonWinner, resolveComparison, type ComparisonPair } from "@/lib/comparison";
import { formatCost } from "@/lib/money";
import {
  CARDS, CardDef, SpendKey,
  fmt, fmtRate, getBreakdown, scoreCard, getTopCards,
} from "@/lib/cards";
import { useSpend } from "@/context/SpendContext";
import { useCatalog, withCatalog } from "@/context/CatalogContext";
import { trackMetaAction } from "@/lib/metaPixel";
import { trackApplyClick } from "@/lib/trackApplyClick";

function CardColumn({
  card,
  spend,
  rank,
  outcome,
}: {
  card: CardDef & { netValue: number };
  spend: Record<SpendKey, number>;
  rank: number;
  outcome: "winner" | "tie" | null;
}) {
  const { rows, gross } = getBreakdown(card, spend);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className={`cmp-card-col cmp-col-b${outcome === "winner" ? " cmp-winner" : ""}`}>
      <div className="cmp-panel-top">
        <div className="cmp-panel-identity">
          <div className="cmp-panel-index">0{rank}</div>
          {outcome && <div className="cmp-outcome">{outcome === "winner" ? "Higher estimated value" : "Same rounded estimate"}</div>}
          <div className="card-modal-badge">{card.badge}</div>
          <h3 className="card-modal-name">{card.name}</h3>
          <div className="card-modal-issuer">{card.issuer}</div>
        </div>
        <div className="cmp-card-spinner">
          <div className="cmp-card-spin-front">
            {card.img && !imgErr ? (
              <Image
                src={card.img}
                alt={card.name}
                fill
                sizes="180px"
                style={{ objectFit: "contain", borderRadius: "inherit" }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="cmp-card-img-fallback">{card.issuer}</div>
            )}
            <div className="cmp-card-sheen" />
          </div>
        </div>
      </div>

      <div className="cmp-panel-value">
        <div><span>Estimated net value</span><strong>{fmt(card.netValue)}</strong><small>per year after fees</small></div>
        <p>Gross {fmt(gross)} <i>−</i> fee {formatCost(card.annualFee)}</p>
      </div>

      <div className="modal-breakdown">
        <div className="modal-breakdown-label">Category earnings</div>
        <div className="modal-bd-table">
          <div className="modal-bd-head">
            <span>Category</span><span>Monthly</span><span>Rate</span><span>Yearly</span>
          </div>
          {rows.map((row) => (
            <div key={row.key} className="modal-bd-row">
              <span className="modal-bd-cat">{row.label}</span>
              <span className="modal-bd-monthly">{fmt(spend[row.key])}</span>
              <span className="modal-bd-rate">{fmtRate(row.rate)}</span>
              <span className="modal-bd-earn">{fmt(row.annual)}</span>
            </div>
          ))}
          <div className="modal-bd-row bd-net">
            <span className="modal-bd-cat">Net annual value</span><span /><span />
            <span className="modal-bd-earn">{fmt(card.netValue)}</span>
          </div>
        </div>
      </div>

      <div className="cmp-panel-actions">
        <a href={card.bankUrl} target="_blank" rel="noopener noreferrer" className="card-modal-cta cmp-apply"
          onClick={() => trackApplyClick(card.id)}>
          Apply at {card.issuer} →
        </a>
        <Link href={`/credit-cards/${card.id}`} className="card-modal-view cmp-view">View full details</Link>
        <span>Issuer terms apply · ClearFin is independent</span>
      </div>
    </div>
  );
}

function CardSlot({
  label,
  selectedId,
  otherSelectedId,
  query,
  isOpen,
  spend,
  onOpen,
  onClose,
  onSelect,
  onClear,
  onQueryChange,
}: {
  label: string;
  selectedId: string | null;
  otherSelectedId: string | null;
  query: string;
  isOpen: boolean;
  spend: Record<SpendKey, number>;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (id: string) => void;
  onClear: () => void;
  onQueryChange: (q: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  const catalog = useCatalog();
  const selectedBase = selectedId ? CARDS.find((c) => c.id === selectedId) : null;
  const selectedCard = selectedBase ? withCatalog(selectedBase, catalog) : null;

  const PRIORITY_ISSUERS = [
    "American Express",
    "Scotiabank",
    "BMO",
    "CIBC",
    "RBC",
    "TD Bank",
  ];

  const issuerRank = (issuer: string) => {
    const i = PRIORITY_ISSUERS.indexOf(issuer);
    return i === -1 ? PRIORITY_ISSUERS.length : i;
  };

  const filtered = CARDS
    .filter((c) => {
      if (c.id === otherSelectedId) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const aHasImg = !!a.img;
      const bHasImg = !!b.img;
      const aRank = issuerRank(a.issuer);
      const bRank = issuerRank(b.issuer);

      // No image always goes to the bottom
      if (aHasImg && !bHasImg) return -1;
      if (!aHasImg && bHasImg) return 1;

      // Both have images or both missing: sort by priority issuer first
      if (aRank !== bRank) return aRank - bRank;

      // Same issuer group: alphabetical by name
      return a.name.localeCompare(b.name);
    });

  const activeIndex = Math.min(active, Math.max(0, filtered.length - 1));
  useEffect(() => {
    if (isOpen) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, listId, query]);

  const dismiss = () => { onClose(); triggerRef.current?.focus(); };
  const select = (id: string) => { onSelect(id); dismiss(); };

  return (
    <div className="cmp-slot-wrap" ref={wrapRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(event) => {
        if (isOpen && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dismiss(); }
      }}
    >
      <div
        className={`cmp-slot${selectedCard ? " cmp-slot-filled" : ""}${isOpen ? " cmp-slot-open" : ""}`}
      >
        <button type="button" ref={triggerRef} className="cmp-slot-trigger"
          aria-label={`${label}: ${selectedCard?.name ?? "Search cards"}`}
          aria-expanded={isOpen} aria-haspopup="listbox" aria-controls={isOpen ? listId : undefined}
          onClick={() => { setActive(0); if (isOpen) onClose(); else onOpen(); }}
        >
          {selectedCard ? <span className="cmp-slot-name">{selectedCard.name}</span> : (
            <span className="cmp-slot-placeholder">{isOpen ? "" : "Search cards…"}</span>
          )}
        </button>
        {selectedCard && (
            <button
              type="button"
              className="cmp-slot-x"
              aria-label={`Clear ${label.toLowerCase()}: ${selectedCard.name}`}
              onClick={() => { setActive(0); onClear(); }}
            >
              ✕
            </button>
        )}
      </div>

      {isOpen && (
        <div className="cmp-dropdown">
          <div className="cmp-dropdown-input">
            <span className="cmp-search-icon">⌕</span>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label={`Search ${label.toLowerCase()} by card or issuer`}
              aria-expanded="true"
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={filtered.length ? `${listId}-${activeIndex}` : undefined}
              placeholder="Search by card or issuer…"
              value={query}
              onChange={(e) => { setActive(0); onQueryChange(e.target.value); }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive(Math.max(0, Math.min(activeIndex + (event.key === "ArrowDown" ? 1 : -1), filtered.length - 1)));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  if (filtered[activeIndex]) select(filtered[activeIndex].id);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {filtered.length === 0 && <div className="cmp-dropdown-empty" role="status">No cards match &ldquo;{query}&rdquo;</div>}
          <div className="cmp-dropdown-list" role="listbox" tabIndex={-1} id={listId} aria-label={`${label} matches`}>
            {filtered.map((c, index) => (
              <div
                key={c.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className="cmp-dropdown-item"
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => select(c.id)}
              >
                <div className="cmp-di-left">
                  <div className="cmp-di-name">{catalog[c.id]?.name ?? c.name}</div>
                  <div className="cmp-di-issuer">{catalog[c.id]?.issuer ?? c.issuer}</div>
                </div>
                <div className="cmp-di-val">{fmt(scoreCard(c, spend))}/yr</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const comparableIds = new Set(CARDS.map((card) => card.id));

function CompareCards({ compareParam }: { compareParam: string | null }) {
  const { spend: effectiveSpend } = useSpend();

  const [defaultIds] = useState<ComparisonPair>(() => getTopCards(effectiveSpend, 2).map((c) => c.id) as ComparisonPair);
  const selectedIds = resolveComparison(compareParam, defaultIds, comparableIds);
  const [queries, setQueries] = useState<[string, string]>(["", ""]);
  const [openSlot, setOpenSlot] = useState<0 | 1 | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [manualLink, setManualLink] = useState("");

  const updatePair = (pair: ComparisonPair) => {
    const url = new URL(window.location.href);
    url.searchParams.set("compare", comparisonQuery(pair));
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setCopyStatus("");
    setManualLink("");
  };

  const copyLink = async () => {
    const url = new URL("/compare-credit-cards-canada", window.location.origin);
    url.searchParams.set("compare", comparisonQuery(selectedIds));
    try {
      await navigator.clipboard.writeText(url.href);
      setCopyStatus("Comparison link copied.");
      setManualLink("");
    } catch {
      setManualLink(url.href);
      setCopyStatus("Select and copy the link below.");
    }
  };

  const selectCard = (slot: 0 | 1, id: string) => {
    if (selectedIds[slot] !== id && selectedIds[slot === 0 ? 1 : 0]) {
      trackMetaAction("CardComparison");
    }
    const next: ComparisonPair = [...selectedIds];
    next[slot] = id;
    updatePair(next);
    setQueries((prev) => {
      const next: [string, string] = [...prev] as [string, string];
      next[slot] = "";
      return next;
    });
  };

  const clearSlot = (slot: 0 | 1) => {
    const next: ComparisonPair = [...selectedIds];
    next[slot] = null;
    updatePair(next);
    setOpenSlot(slot);
  };

  const catalog = useCatalog();
  const scoredCards = selectedIds.map((id) => {
    if (!id) return null;
    const card = CARDS.find((c) => c.id === id);
    if (!card) return null;
    // Display fields from Supabase; scoreCard uses cards.ts rates/fee (math unchanged).
    return withCatalog({ ...card, netValue: scoreCard(card, effectiveSpend) }, catalog);
  }) as [(CardDef & { netValue: number }) | null, (CardDef & { netValue: number }) | null];
  const winner = comparisonWinner([scoredCards[0]?.netValue ?? null, scoredCards[1]?.netValue ?? null]);

  return (
    <>
        {/* Selectors */}
        <div className="cmp-selector-row">
          <CardSlot
            label="First card"
            selectedId={selectedIds[0]}
            otherSelectedId={selectedIds[1]}
            query={queries[0]}
            isOpen={openSlot === 0}
            spend={effectiveSpend}
            onOpen={() => setOpenSlot(0)}
            onClose={() => setOpenSlot(null)}
            onSelect={(id) => selectCard(0, id)}
            onClear={() => clearSlot(0)}
            onQueryChange={(q) =>
              setQueries((prev) => [q, prev[1]])
            }
          />

          <div className="cmp-vs">vs</div>

          <CardSlot
            label="Second card"
            selectedId={selectedIds[1]}
            otherSelectedId={selectedIds[0]}
            query={queries[1]}
            isOpen={openSlot === 1}
            spend={effectiveSpend}
            onOpen={() => setOpenSlot(1)}
            onClose={() => setOpenSlot(null)}
            onSelect={(id) => selectCard(1, id)}
            onClear={() => clearSlot(1)}
            onQueryChange={(q) =>
              setQueries((prev) => [prev[0], q])
            }
          />
        </div>

        <div className="cmp-share">
          <button type="button" onClick={copyLink} disabled={!selectedIds[0] || !selectedIds[1]}>Copy comparison link</button>
          <span>Shares the cards. Estimates use each visitor&apos;s spending.</span>
          <span role="status" aria-live="polite">{copyStatus}</span>
          {manualLink && <input aria-label="Comparison link" readOnly value={manualLink} onFocus={(event) => event.currentTarget.select()} />}
        </div>

        {/* Comparison grid */}
        <div className="cmp-grid">
          {([0, 1] as const).map((i) => {
            const card = scoredCards[i];
            if (!card) {
              return (
                <div key={i} className="cmp-empty-col">
                  <div className="cmp-empty-inner">
                    <div className="cmp-empty-num">0{i + 1}</div>
                    <div className="cmp-empty-text">
                      Click above to pick<br />a card to compare
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <CardColumn key={card.id} card={card} spend={effectiveSpend} rank={i + 1} outcome={winner === i ? "winner" : winner === "tie" ? "tie" : null} />
            );
          })}
        </div>

        <p className="cmp-disclaimer-foot">
          Points and miles are shown as estimated cash value using publicly available reward rates.
          Actual rewards may vary · ClearFin is independent of card issuers ·{" "}
          <a href="/credit-card-rewards-canada-guide">View our methodology</a>
        </p>
    </>
  );
}

function CompareFromUrl() {
  const searchParams = useSearchParams();
  return <CompareCards compareParam={searchParams.get("compare")} />;
}

export default function CompareSection({ pageHeading = false }: { pageHeading?: boolean }) {
  const Heading = pageHeading ? "h1" : "h2";
  return (
    <section id="compare">
      <div className="section-num">04 / Compare Cards</div>
      <div className="cmp-wrap">
        <div className="cmp-header">
          <div className="cmp-eyebrow">Side-by-side card analysis</div>
          <Heading className="cmp-title">Which card puts <span className="ital">more</span> back in your wallet?</Heading>
          <p className="cmp-sub">Choose two cards and ClearFin will calculate the stronger fit for your spending.
            We include annual fees and show exactly where each card earns more.</p>
        </div>
        <Suspense fallback={<CompareCards compareParam={null} />}><CompareFromUrl /></Suspense>
      </div>
      <div className="section-divider-bottom" />
    </section>
  );
}

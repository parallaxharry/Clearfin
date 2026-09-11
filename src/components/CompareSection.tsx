"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  CARDS, CardDef, SpendKey,
  fmt, fmtRate, getBreakdown, scoreCard, getTopCards,
} from "@/lib/cards";
import { useSpend } from "@/context/SpendContext";
import { useCatalog, withCatalog } from "@/context/CatalogContext";
import { trackMetaAction } from "@/lib/metaPixel";

function CardColumn({
  card,
  spend,
  rank,
}: {
  card: CardDef & { netValue: number };
  spend: Record<SpendKey, number>;
  rank: number;
}) {
  const { rows, gross } = getBreakdown(card, spend);
  const isTop = rank === 1;
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className={`cmp-card-col${isTop ? " cmp-col-a" : " cmp-col-b"}`}>
      <div className="cmp-panel-top">
        <div className="cmp-panel-identity">
          <div className="cmp-panel-index">0{rank}</div>
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
        <p>Gross {fmt(gross)} <i>−</i> fee {card.annualFee === 0 ? "$0" : fmt(card.annualFee)}</p>
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
          onClick={() => {
            trackMetaAction("ApplyClick");
            fetch("/api/track-click", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({cardId:card.id}) }).catch(() => {});
          }}>
          Apply at {card.issuer} →
        </a>
        <Link href={`/credit-cards/${card.id}`} className="card-modal-view cmp-view">View full details</Link>
        <span>Issuer terms apply · ClearFin is independent</span>
      </div>
    </div>
  );
}

function CardSlot({
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

  return (
    <div className="cmp-slot-wrap" ref={wrapRef}>
      <div
        className={`cmp-slot${selectedCard ? " cmp-slot-filled" : ""}${isOpen ? " cmp-slot-open" : ""}`}
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        {selectedCard ? (
          <>
            <span className="cmp-slot-name">{selectedCard.name}</span>
            <button
              className="cmp-slot-x"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
            >
              ✕
            </button>
          </>
        ) : (
          <span className="cmp-slot-placeholder">
            {isOpen ? "" : "Search cards…"}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="cmp-dropdown">
          <div className="cmp-dropdown-input">
            <span className="cmp-search-icon">⌕</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by card or issuer…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="cmp-dropdown-list">
            {filtered.length === 0 && (
              <div className="cmp-dropdown-empty">No cards match &ldquo;{query}&rdquo;</div>
            )}
            {filtered.map((c) => (
              <div
                key={c.id}
                className="cmp-dropdown-item"
                onClick={() => { onSelect(c.id); onClose(); }}
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

export default function CompareSection() {
  const { spend: effectiveSpend } = useSpend();

  const defaultIds = getTopCards(effectiveSpend, 2).map((c) => c.id) as [string, string];
  const [selectedIds, setSelectedIds] = useState<[string | null, string | null]>(defaultIds);
  const [queries, setQueries] = useState<[string, string]>(["", ""]);
  const [openSlot, setOpenSlot] = useState<0 | 1 | null>(null);

  // Compare-from-search: ?compare=a,b on page load, and the clearfin:compare
  // event when the palette is used while this section is already mounted.
  useEffect(() => {
    const apply = (ids: string[]) => {
      const valid = ids.filter((id) => CARDS.some((c) => c.id === id)).slice(0, 2);
      if (valid.length === 2) setSelectedIds([valid[0], valid[1]]);
      else if (valid.length === 1) setSelectedIds((prev) => [valid[0], prev[1]]);
    };
    const fromUrl = new URLSearchParams(window.location.search).get("compare");
    if (fromUrl) apply(fromUrl.split(","));
    const onCompare = (e: Event) => {
      const ids = (e as CustomEvent<{ ids?: string[] }>).detail?.ids;
      if (ids) apply(ids);
    };
    window.addEventListener("clearfin:compare", onCompare);
    return () => window.removeEventListener("clearfin:compare", onCompare);
  }, []);

  const selectCard = (slot: 0 | 1, id: string) => {
    if (selectedIds[slot] !== id && selectedIds[slot === 0 ? 1 : 0]) {
      trackMetaAction("CardComparison");
    }
    setSelectedIds((prev) => {
      const next: [string | null, string | null] = [...prev] as [string | null, string | null];
      next[slot] = id;
      return next;
    });
    setQueries((prev) => {
      const next: [string, string] = [...prev] as [string, string];
      next[slot] = "";
      return next;
    });
  };

  const clearSlot = (slot: 0 | 1) => {
    setSelectedIds((prev) => {
      const next: [string | null, string | null] = [...prev] as [string | null, string | null];
      next[slot] = null;
      return next;
    });
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

  return (
    <section id="compare">
      <div className="section-num">04 / Compare Cards</div>
      <div className="cmp-wrap">

        {/* Header */}
        <div className="cmp-header">
          <div className="cmp-eyebrow">Side-by-side card analysis</div>
          <h2 className="cmp-title">
            Which card puts <span className="ital">more</span> back in your wallet?
          </h2>
          <p className="cmp-sub">
            Choose two cards and ClearFin will calculate the stronger fit for your spending.
            We include annual fees and show exactly where each card earns more.
          </p>
        </div>

        {/* Selectors */}
        <div className="cmp-selector-row">
          <CardSlot
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
              <CardColumn key={card.id} card={card} spend={effectiveSpend} rank={i + 1} />
            );
          })}
        </div>

        <p className="cmp-disclaimer-foot">
          Points and miles are shown as estimated cash value using publicly available reward rates.
          Actual rewards may vary · ClearFin is independent of card issuers ·{" "}
          <a href="/credit-card-rewards-canada-guide">View our methodology</a>
        </p>
      </div>
      <div className="section-divider-bottom" />
    </section>
  );
}

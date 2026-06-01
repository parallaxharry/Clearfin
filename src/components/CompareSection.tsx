"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  CARDS, CardDef, SpendKey,
  fmt, fmtRate, getBreakdown, scoreCard, getTopCards,
} from "@/lib/cards";
import { useSpend } from "@/context/SpendContext";

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
      <div className="cmp-card-body">

        {/* Left: all text details */}
        <div className="card-modal-left cmp-modal-left">
          <div className="card-modal-badge">{card.badge}</div>
          <h3 className="card-modal-name">{card.name}</h3>
          <div className="card-modal-issuer">{card.issuer}</div>
          <div className="card-modal-net-row">
            <span className="card-modal-net">{fmt(card.netValue)}</span>
            <span className="card-modal-net-label">net / year for your spend</span>
          </div>
          <div className="card-modal-perks">
            {card.perks.map((p, i) => (
              <div className="card-modal-perk" key={i}>
                <span className="card-modal-perk-dot">✦</span>
                {p}
              </div>
            ))}
          </div>

          <div className="modal-breakdown">
            <div className="modal-breakdown-label">How we calculated this</div>
            <div className="modal-bd-table">
              <div className="modal-bd-head">
                <span>Category</span>
                <span>Monthly</span>
                <span>Rate</span>
                <span>Yearly</span>
              </div>
              {rows.map((r) => (
                <div key={r.key} className="modal-bd-row">
                  <span className="modal-bd-cat">{r.label}</span>
                  <span className="modal-bd-monthly">{fmt(spend[r.key])}</span>
                  <span className="modal-bd-rate">{fmtRate(r.rate)}</span>
                  <span className="modal-bd-earn">{fmt(r.annual)}</span>
                </div>
              ))}
              <div className="modal-bd-row bd-gross">
                <span className="modal-bd-cat">Gross rewards</span>
                <span /><span />
                <span className="modal-bd-earn">{fmt(gross)}</span>
              </div>
              <div className="modal-bd-row bd-fee">
                <span className="modal-bd-cat">Annual fee</span>
                <span /><span />
                <span className="modal-bd-earn">
                  {card.annualFee === 0 ? "None" : `-$${card.annualFee}`}
                </span>
              </div>
              <div className="modal-bd-row bd-net">
                <span className="modal-bd-cat">Net value</span>
                <span /><span />
                <span className="modal-bd-earn">{fmt(gross - card.annualFee)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: card image + apply */}
        <div className="cmp-card-side">
          <div className="cmp-card-spinner">
            <div className="cmp-card-spin-front">
              {card.img && !imgErr ? (
                <Image
                  src={card.img}
                  alt={card.name}
                  fill
                  sizes="180px"
                  style={{ objectFit: "cover", borderRadius: "inherit" }}
                  onError={() => setImgErr(true)}
                />
              ) : (
                <div className="cmp-card-img-fallback">{card.issuer}</div>
              )}
              <div className="cmp-card-sheen" />
            </div>
          </div>
          <a
            href={card.bankUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-modal-cta cmp-apply"
            onClick={() =>
              fetch("/api/track-click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardId: card.id }),
              }).catch(() => {})
            }
          >
            Apply at {card.issuer} →
          </a>
          <div className="card-modal-disclaimer cmp-disclaimer">
            Issuer terms apply. Not affiliated.
          </div>
        </div>

      </div>
    </div>
  );
}

function CardSlot({
  slotIndex,
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
  slotIndex: number;
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

  const selectedCard = selectedId ? CARDS.find((c) => c.id === selectedId) : null;

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
        <span className="cmp-slot-num">0{slotIndex + 1}</span>
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
                  <div className="cmp-di-name">{c.name}</div>
                  <div className="cmp-di-issuer">{c.issuer}</div>
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

  const selectCard = (slot: 0 | 1, id: string) => {
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

  const scoredCards = selectedIds.map((id) => {
    if (!id) return null;
    const card = CARDS.find((c) => c.id === id);
    if (!card) return null;
    return { ...card, netValue: scoreCard(card, effectiveSpend) };
  }) as [(CardDef & { netValue: number }) | null, (CardDef & { netValue: number }) | null];

  return (
    <section id="compare">
      <div className="section-num">05 / Compare Cards</div>
      <div className="cmp-wrap">

        {/* Header */}
        <div className="cmp-header">
          <div className="cmp-eyebrow">2 cards · Your spend profile</div>
          <h2 className="cmp-title">
            See the <span className="ital">difference</span><br />side by side.
          </h2>
          <p className="cmp-sub">
            Pick any two Canadian cards. We&apos;ll show exactly how each one performs
            against your spending — category by category, fee included.
          </p>
        </div>

        {/* Selectors */}
        <div className="cmp-selector-row">
          <span className="cmp-selector-label">Comparing:</span>

          <CardSlot
            slotIndex={0}
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
            slotIndex={1}
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
          Cards that earn points or miles are shown as an estimated cash value.{" "}
          <a href="/credit-card-rewards-canada-guide">See the Rewards Guide</a> for how we convert points to a percentage.
        </p>
        <p className="cmp-disclaimer-foot cmp-disclaimer-fine">
          Estimates based on publicly available reward rates · Actual rewards may vary · ClearFin is not affiliated with any card issuer
        </p>
      </div>
      <div className="section-divider-bottom" />
    </section>
  );
}

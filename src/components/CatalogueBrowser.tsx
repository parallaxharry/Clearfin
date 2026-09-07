"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FinlyRebateBadge from "@/components/FinlyRebateBadge";
import type { CatalogListCard } from "@/lib/cardDetail";
import { formatCost } from "@/lib/money";
import { DEFAULT_CATALOGUE_FILTERS, filterCatalogue } from "@/lib/catalogueFilters";

export default function CatalogueBrowser({ cards: allCards }: { cards: CatalogListCard[] }) {
  const [filters, setFilters] = useState(DEFAULT_CATALOGUE_FILTERS);
  const cards = filterCatalogue(allCards, filters);
  const issuers = [...new Set(allCards.map(card => card.issuer).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  const reset = () => setFilters({ ...DEFAULT_CATALOGUE_FILTERS });
  return <>
    <div className="catalog-controls" role="search" aria-label="Filter credit card catalogue">
      <label className="catalog-query">Search cards<input type="search" maxLength={100} placeholder="Card name or issuer" value={filters.query} onChange={e => setFilters({ ...filters, query: e.target.value })} /></label>
      <label>Issuer<select aria-label="Issuer" value={filters.issuer} onChange={e => setFilters({ ...filters, issuer: e.target.value })}><option value="">All issuers</option>{issuers.map(issuer => <option key={issuer}>{issuer}</option>)}</select></label>
      <label>Annual fee<select aria-label="Annual fee" value={filters.fee} onChange={e => setFilters({ ...filters, fee: e.target.value })}><option value="">Any fee</option><option value="free">No annual fee</option><option value="paid">Has annual fee</option><option value="unknown">Fee not listed</option></select></label>
      <label>Reward type<select aria-label="Reward type" value={filters.reward} onChange={e => setFilters({ ...filters, reward: e.target.value })}><option value="">All rewards</option><option value="cashback">Cash back</option><option value="points">Points / miles</option><option value="unknown">Not classified</option></select></label>
      <label>Sort by<select aria-label="Sort by" value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}><option value="original">Catalogue order</option><option value="name">Card name A–Z</option><option value="fee-asc">Annual fee: low to high</option><option value="fee-desc">Annual fee: high to low</option></select></label>
      <button type="button" onClick={reset}>Reset filters</button>
    </div>
    <p className="catalog-filter-note">Fees shown are the listed annual fees, before any conditional waiver. Some cards do not have a classified reward type; find them under “Not classified”.</p>
    <p className="catalog-results" role="status" aria-live="polite" aria-atomic="true">{cards.length} of {allCards.length} cards shown</p>
    {cards.length === 0 && <div className="catalog-empty"><h3>No matching cards</h3><p>Try a different search or clear your filters to browse the full collection.</p><button type="button" onClick={reset}>Show all cards</button></div>}
          <div className="catalog-grid">
            {cards.map((card) => (
              <Link href={`/credit-cards/${card.id}`} className="catalog-card" key={card.id}>
                <div className="catalog-card-art">
                  <FinlyRebateBadge cardId={card.id} applicationUrl={card.bankUrl} />
                  <Image src={card.img} alt={card.name} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 280px" style={{ objectFit: "contain" }} />
                </div>
                <div className="catalog-card-copy">
                  <span>{card.issuer}</span>
                  <h3>{card.name}</h3>
                  <p>{card.badge}</p>
                  <div>
                    <small>Annual fee</small>
                    <strong>{card.annualFee === null ? "See details" : formatCost(card.annualFee)}</strong>
                  </div>
                  <em>View card details <b>→</b></em>
                </div>
              </Link>
            ))}
          </div>
  </>;
}

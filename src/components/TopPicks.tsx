"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CARDS } from "@/lib/cards";
import { useCatalog } from "@/context/CatalogContext";

interface PickCard {
  id: string;
  category: string;
  name: string;
  issuer: string;
  rate: string;
  desc: string;
  img: string;
  bankUrl: string;
  perks: string[];
}

/* Editorial curation only: which cards are featured, the category label, and the
   headline highlight. All factual data (name, issuer, image, perks, description,
   apply link) is pulled from the verified card database in lib/cards.ts so it can
   never drift out of sync. */
const CURATION: { id: string; category: string; rate: string }[] = [
  { id: "cobalt",       category: "Best for Dining",    rate: "5x on dining" },
  { id: "scotia-gold",  category: "Best for Groceries", rate: "6x on groceries" },
  { id: "td-aeroplan",  category: "Best for Travel",    rate: "1.5x on Air Canada" },
  { id: "bmo-eclipse",  category: "Best for Gas",       rate: "5x on gas" },
  { id: "wealthsimple", category: "Best Flat-Rate Cashback", rate: "2% on everything" },
  { id: "rbc-avion",    category: "Most Flexible",      rate: "30+ transfer partners" },
];

const PICKS: PickCard[] = CURATION.flatMap((pick) => {
  const card = CARDS.find((c) => c.id === pick.id);
  if (!card) return [];
  return [{
    id: card.id,
    category: pick.category,
    name: card.name,
    issuer: card.issuer,
    rate: pick.rate,
    desc: card.description,
    img: card.img,
    bankUrl: card.bankUrl,
    perks: card.perks,
  }];
});

async function trackClick(cardId: string) {
  try {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
    });
  } catch {
    // Silent because analytics should not block the user.
  }
}

export default function TopPicks() {
  const [selectedCard, setSelectedCard] = useState<PickCard | null>(null);
  const catalog = useCatalog();

  // Overlay Supabase display fields onto each curated pick (perks ← rewards).
  const picks: PickCard[] = PICKS.map((p) => {
    const info = catalog[p.id];
    if (!info) return p;
    return {
      ...p,
      name: info.name ?? p.name,
      issuer: info.issuer ?? p.issuer,
      img: info.img ?? p.img,
      bankUrl: info.bankUrl ?? p.bankUrl,
      perks: info.rewards.length > 0 ? info.rewards : p.perks,
    };
  });

  useEffect(() => {
    document.body.style.overflow = selectedCard ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCard]);

  return (
    <>
      <section id="showcase">
        <div className="section-num">03 / Top Picks</div>
        <div className="top-picks-wrap">
          <div className="top-picks-head reveal">
            <div className="top-picks-eyebrow">Curated - Updated continuously</div>
            <h2 className="top-picks-title">
              Best card for <span className="ital">every</span> category.
            </h2>
            <p className="top-picks-disclaimer">
              Independent comparison. ClearFin is not affiliated with banks or credit card issuers.
            </p>
          </div>

          <div className="top-picks-grid">
            {picks.map((card) => (
              <button
                key={card.id}
                type="button"
                className="pick-card reveal"
                onClick={() => setSelectedCard(card)}
              >
                <div className="pick-card-img">
                  <Image
                    src={card.img}
                    alt={card.name}
                    fill
                    sizes="280px"
                    style={{ objectFit: "contain", padding: "36px 16px 14px" }}
                  />
                  <span className="pick-cat-badge">{card.category}</span>
                </div>
                <div className="pick-card-body">
                  <div className="pick-card-name">{card.name}</div>
                  <div className="pick-card-issuer">{card.issuer}</div>
                  <div className="pick-card-rate">{card.rate}</div>
                  <div className="pick-card-desc">{card.desc}</div>
                  <div className="pick-card-link">
                    View rewards <span>-&gt;</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

      {selectedCard && (
        <div className="card-modal-overlay" onClick={() => setSelectedCard(null)}>
          <div
            className="card-modal top-picks-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedCard.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="card-modal-close"
              aria-label="Close card details"
              onClick={() => setSelectedCard(null)}
            >
              x
            </button>

            <div className="card-modal-left">
              <div className="card-modal-badge">{selectedCard.category}</div>
              <h3 className="card-modal-name">{selectedCard.name}</h3>
              <div className="card-modal-issuer">{selectedCard.issuer}</div>
              <div className="card-modal-net-row">
                <span className="card-modal-net">{selectedCard.rate}</span>
                <span className="card-modal-net-label">reward highlight</span>
              </div>
              <div className="card-modal-perks">
                {selectedCard.perks.map((perk) => (
                  <div className="card-modal-perk" key={perk}>
                    <span className="card-modal-perk-dot">*</span>
                    {perk}
                  </div>
                ))}
              </div>
              <a
                href={selectedCard.bankUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-modal-cta"
                onClick={() => trackClick(selectedCard.id)}
              >
                Apply at {selectedCard.issuer} -&gt;
              </a>
              <Link href={`/credit-cards/${selectedCard.id}`} className="card-modal-view">
                View full details
              </Link>
              <div className="card-modal-disclaimer">
                Issuer terms apply. ClearFin is not affiliated with this provider.
              </div>
            </div>

            <div className="card-modal-right">
              <div className="card-modal-spinner top-picks-modal-card">
                <div className="card-modal-spin-front">
                  <Image
                    src={selectedCard.img}
                    alt={selectedCard.name}
                    fill
                    sizes="320px"
                    style={{ objectFit: "contain" }}
                  />
                  <div className="card-modal-sheen" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

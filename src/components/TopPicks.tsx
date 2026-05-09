"use client";

import Image from "next/image";

interface PickCard {
  id: string;
  category: string;
  name: string;
  issuer: string;
  rate: string;
  desc: string;
  img: string;
  bankUrl: string;
}

const PICKS: PickCard[] = [
  {
    id: "amex-cobalt",
    category: "🍽️ Best for Dining",
    name: "Amex Cobalt",
    issuer: "American Express",
    rate: "5x on dining",
    desc: "5x points on restaurants & food delivery. Massive welcome bonus. Canada's top dining card.",
    img: "/cards/amex-cobalt.avif",
    bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/cobalt-card/",
  },
  {
    id: "scotia-gold",
    category: "🛒 Best for Groceries",
    name: "Scotiabank Gold Amex",
    issuer: "Scotiabank",
    rate: "6x on groceries",
    desc: "6x Scene+ points on grocery stores + 5x dining. Best everyday Canadian card.",
    img: "/cards/scotia-gold-amex.webp",
    bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/american-express/gold-american-express-card.html",
  },
  {
    id: "td-aeroplan",
    category: "✈️ Best for Travel",
    name: "TD Aeroplan Visa Infinite",
    issuer: "TD Bank",
    rate: "3x on travel",
    desc: "3x Aeroplan points on Air Canada & travel purchases. Top choice for frequent flyers.",
    img: "/cards/td-aeroplan-infinite.jpeg",
    bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/",
  },
  {
    id: "bmo-eclipse",
    category: "⛽ Best for Gas",
    name: "BMO Eclipse Visa Infinite",
    issuer: "BMO",
    rate: "5x on gas",
    desc: "5x points on gas, grocery & dining + $50 annual lifestyle credit. Great all-rounder.",
    img: "/cards/bmo-eclipse.webp",
    bankUrl: "https://www.bmo.com/en-ca/main/personal/credit-cards/eclipse-visa-infinite/",
  },
  {
    id: "wealthsimple",
    category: "💸 Best No-Fee Card",
    name: "Wealthsimple Card",
    issuer: "Wealthsimple",
    rate: "1% on everything",
    desc: "1% cashback in cash or crypto. No annual fee. The cleanest everyday backup card.",
    img: "/cards/wealthsimple.webp",
    bankUrl: "https://www.wealthsimple.com/en-ca/spend",
  },
  {
    id: "rbc-avion",
    category: "🔄 Most Flexible",
    name: "RBC Avion Visa Infinite",
    issuer: "RBC",
    rate: "1.25x on everything",
    desc: "1.25x on all purchases. Transfer to 30+ airline partners. Suits diverse spenders.",
    img: "/cards/rbc-avion-infinite.webp",
    bankUrl: "https://www.rbc.com/creditcards/avion-visa-infinite.html",
  },
];

async function trackClick(cardId: string) {
  try {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
    });
  } catch {
    // Silent — don't block the user
  }
}

export default function TopPicks() {
  return (
    <section id="showcase">
      <div className="section-num">03 / Top Picks</div>
      <div className="top-picks-wrap">
        <div className="top-picks-head reveal">
          <div className="top-picks-eyebrow">Curated · Updated continuously</div>
          <h2 className="top-picks-title">
            Best card for <span className="ital">every</span> category.
          </h2>
        </div>

        <div className="top-picks-grid">
          {PICKS.map((card) => (
            <a
              key={card.id}
              href={card.bankUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pick-card reveal"
              onClick={() => trackClick(card.id)}
            >
              <div className="pick-card-img">
                <Image
                  src={card.img}
                  alt={card.name}
                  fill
                  sizes="280px"
                  style={{ objectFit: "contain", padding: "16px" }}
                />
                <span className="pick-cat-badge">{card.category}</span>
              </div>
              <div className="pick-card-body">
                <div className="pick-card-name">{card.name}</div>
                <div className="pick-card-issuer">{card.issuer}</div>
                <div className="pick-card-rate">{card.rate}</div>
                <div className="pick-card-desc">{card.desc}</div>
                <div className="pick-card-link">
                  Apply at {card.issuer} <span>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="section-divider-bottom" />
    </section>
  );
}

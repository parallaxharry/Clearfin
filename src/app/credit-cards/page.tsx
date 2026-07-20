import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCatalogOrderedCards } from "@/lib/cardDetail";
import type { SearchCard } from "@/lib/searchIndex";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

// ISR: Supabase card_catalog edits (names, art, order, new cards) go live within ~5 min.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Credit Cards (2026) | ClearFin",
  description:
    "Browse every Canadian credit card we track, grouped by issuer. Tap any card for full earn rates, fees, welcome bonus and benefits.",
  alternates: { canonical: "/credit-cards" },
};

export default async function AllCardsPage() {
  const cards = await getCatalogOrderedCards();

  // Cluster same-issuer cards together (preserving Supabase table order within
  // each issuer), order the issuer clusters alphabetically, then render as one
  // flat list — no category headers.
  const byIssuer = new Map<string, SearchCard[]>();
  for (const card of cards) {
    const bucket = byIssuer.get(card.issuer);
    if (bucket) bucket.push(card);
    else byIssuer.set(card.issuer, [card]);
  }
  const ordered: SearchCard[] = [...byIssuer.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en", { sensitivity: "base" }))
    .flatMap(([, issuerCards]) => issuerCards);

  return (
    <div className="cardpg">
      <Nav />

      <main className="cardpg-main cardsidx-main">
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="seo-breadcrumb-sep" aria-hidden="true">
            {" "}›{" "}
          </span>
          <span aria-current="page">All Cards</span>
        </nav>

        <header className="cardsidx-head">
          <h1 className="cardsidx-title">All Credit Cards</h1>
          <p className="cardsidx-lede">
            Every Canadian card we track, grouped by issuer. Tap any card to see its full earn
            rates, fees, welcome bonus and benefits.
          </p>
          <p className="cardsidx-count">{cards.length} cards</p>
        </header>

        <ul className="cardsidx-list">
          {ordered.map((card) => (
            <li key={card.id}>
              <Link href={`/credit-cards/${card.id}`} className="cardsidx-item">
                <span className="cardsidx-thumb">
                  {card.img ? (
                    <Image
                      src={card.img}
                      alt={card.name}
                      fill
                      sizes="283px"
                      style={{ objectFit: "contain" }}
                    />
                  ) : null}
                </span>
                <span className="cardsidx-name">{card.name}</span>
                <span className="cardsidx-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="cardpg-disclosure cardsidx-disclosure">
          Issuer terms apply. ClearFin is independent and not affiliated with any card issuer.{" "}
          <Link href="/disclosures">How we make money</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

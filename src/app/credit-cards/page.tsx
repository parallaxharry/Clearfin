import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import { getCatalogOrderedCards } from "@/lib/cardDetail";
import CatalogueBrowser from "@/components/CatalogueBrowser";
import { FINLY_REBATES_CHECKED_AT, getFinlyRebate } from "@/lib/finlyRebates";

export const metadata: Metadata = {
  title: "All Credit Cards (2026) | ClearFin",
  description:
    "Browse every Canadian credit card we track, grouped by issuer. Tap any card for full earn rates, fees, welcome bonus and benefits.",
  alternates: { canonical: "/credit-cards" },
};

export const revalidate = 300;

export default async function CreditCardsPage() {
  const cards = await getCatalogOrderedCards();
  const issuerCount = new Set(cards.map((card) => card.issuer)).size;
  const rebateCount = cards.filter((card) => getFinlyRebate(card.id, card.bankUrl)).length;

  return (
    <>
      <Nav />
      <main className="catalog-page">
        <header className="catalog-hero">
          <div className="catalog-eyebrow">The ClearFin card catalogue</div>
          <h1>Your next card<br /><span>starts here.</span></h1>
          <p>Compare options from {issuerCount} issuers, with fees, reward structures, and key benefits presented in one consistent format—then use ClearFin to find the strongest match for your spending.</p>
          <div className="catalog-summary">
            <div><strong>{cards.length}</strong><span>cards listed</span></div>
            <div><strong>{issuerCount}</strong><span>issuers covered</span></div>
            <div><strong>Independent</strong><span>comparison approach</span></div>
          </div>
        </header>

        <section className="catalog-list" aria-labelledby="catalog-title">
          <div className="catalog-list-head">
            <div><span>Canadian credit cards</span><h2 id="catalog-title">Browse the full collection</h2></div>
            <Link href="/credit-card-calculator-canada">Find my best card →</Link>
          </div>
          {rebateCount > 0 ? (
            <div className="catalog-rebate-note">
              <span aria-hidden="true">$</span>
              <p>
                <strong>{rebateCount} cards currently include a verified FinlyWealth cash rebate.</strong>
                Look for the rebate ribbon. Rebates require an eligible application through ClearFin and approval; terms apply. Amounts checked {FINLY_REBATES_CHECKED_AT}.
              </p>
            </div>
          ) : null}
          <CatalogueBrowser cards={cards} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

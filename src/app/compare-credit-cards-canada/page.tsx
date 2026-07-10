import type { Metadata } from "next";
import Logo from "@/components/Logo";
import Nav from "@/components/Nav";
import CompareSection from "@/components/CompareSection";
import { SpendProvider } from "@/context/SpendContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { getCatalogDisplayMap } from "@/lib/cardDetail";

// ISR: card display refreshes from Supabase card_catalog every ~5 min.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Compare Credit Cards in Canada Side by Side | ClearFin",
  description:
    "Compare any two Canadian credit cards side by side. See exactly how each card performs for your spending — rewards by category, annual fee, and net value per year.",
  keywords: [
    "compare credit cards in Canada",
    "compare Canadian credit card rewards",
    "credit card comparison Canada",
    "credit card comparison tool",
    "compare credit cards side by side",
  ],
  alternates: { canonical: "/compare-credit-cards-canada" },
  openGraph: {
    title: "Compare Credit Cards in Canada Side by Side | ClearFin",
    description:
      "Compare any two Canadian credit cards side by side — rewards by category, annual fee, and net value per year.",
    url: "https://www.clearfin.ca/compare-credit-cards-canada",
    siteName: "ClearFin",
    type: "website",
    locale: "en_CA",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ClearFin Credit Card Comparison Tool",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://www.clearfin.ca/compare-credit-cards-canada",
  description:
    "Compare any two Canadian credit cards side by side. See rewards by spending category, annual fee, and estimated net value per year.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  creator: { "@type": "Organization", name: "ClearFin", url: "https://www.clearfin.ca" },
};

export default async function CompareCreditCardsPage() {
  const catalog = await getCatalogDisplayMap();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <div className="grain" />
      <Nav />

      <SpendProvider>
        <CatalogProvider map={catalog}>
          <CompareSection />
        </CatalogProvider>
      </SpendProvider>

      <footer className="footer">
        <div className="footer-guides">
          <div className="footer-guides-title">Credit Card Guides</div>
          <div className="footer-guides-grid">
            <a href="/best-credit-cards-canada">Best Credit Cards</a>
            <a href="/best-cashback-credit-cards-canada">Best Cashback Cards</a>
            <a href="/best-travel-credit-cards-canada">Best Travel Cards</a>
            <a href="/best-grocery-credit-cards-canada">Best Grocery Cards</a>
            <a href="/best-no-fee-credit-cards-canada">Best No-Fee Cards</a>
            <a href="/best-student-credit-cards-canada">Best Student Cards</a>
            <a href="/credit-card-rewards-canada-guide">Rewards Guide</a>
            <a href="/blog">Blog</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-info">© 2026 ClearFin Digital Inc · Calgary, AB</div>
          <div className="footer-links">
            <Logo className="footer-logo footer-logo-big" priority={false} />
            <a href="/about">About</a>
            <a href="/faq">FAQ</a>
            <a href="/privacy">Privacy</a>
            <a href="/disclosures">Disclosures</a>
            <a href="mailto:info@clearfin.ca">Contact</a>
          </div>
        </div>
        <div className="footer-disclaimer">
          ClearFin is independent and is not affiliated with any bank, issuer, or credit
          card provider. For corrections, removals, or updates, contact{" "}
          <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
        </div>
      </footer>
    </>
  );
}

import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import Nav from "@/components/Nav";
import CompareSection from "@/components/CompareSection";
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

      <CatalogProvider map={catalog}>
        <CompareSection />
      </CatalogProvider>

      <SiteFooter />
    </>
  );
}

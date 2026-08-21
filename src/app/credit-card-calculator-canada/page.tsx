import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import Nav from "@/components/Nav";
import InteractiveTool from "@/components/InteractiveTool";
import { SpendProvider } from "@/context/SpendContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { getCatalogDisplayMap } from "@/lib/cardDetail";

// ISR: card display refreshes from Supabase card_catalog every ~5 min.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Credit Card Rewards Calculator Canada | ClearFin",
  description:
    "Answer 7 quick questions about your spending, income, and credit score. ClearFin calculates your reward leak and ranks the Canadian credit cards you qualify for by real net value.",
  keywords: [
    "credit card calculator Canada",
    "credit card rewards calculator",
    "cashback calculator Canada",
    "credit card comparison calculator",
    "best credit card for my spending",
  ],
  alternates: { canonical: "/credit-card-calculator-canada" },
  openGraph: {
    title: "Credit Card Rewards Calculator Canada | ClearFin",
    description:
      "Answer 7 quick questions and see which Canadian credit cards earn you the most for your actual spending.",
    url: "https://www.clearfin.ca/credit-card-calculator-canada",
    siteName: "ClearFin",
    type: "website",
    locale: "en_CA",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClearFin Credit Card Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://www.clearfin.ca/credit-card-calculator-canada",
  description:
    "Compare 120+ Canadian credit cards based on your actual monthly spending. Find which card earns you the most cashback and rewards across dining, groceries, gas, travel, and other spend.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
  },
  creator: {
    "@type": "Organization",
    name: "ClearFin",
    url: "https://www.clearfin.ca",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find your best Canadian credit card with ClearFin",
  description:
    "Answer 7 quick questions about your spending, income, and credit score. ClearFin calculates your exact reward leak and shows which Canadian credit cards you qualify for earn you the most.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Open the ClearFin calculator",
      text: "Click 'Open the Calculator' or 'Start in 30 seconds' on the ClearFin homepage.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter your monthly dining spend",
      text: "Enter how much you spend each month on restaurants, cafes, takeout, and food delivery.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Enter your monthly grocery budget",
      text: "Enter your monthly spend at supermarkets, Costco, and grocery stores.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Enter your monthly gas spend",
      text: "Enter your monthly fuel costs including petrol, diesel, and EV charging.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Enter your monthly travel spend",
      text: "Enter your average monthly travel budget including flights, hotels, and car rentals.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Enter your remaining monthly spend",
      text: "Enter everything else: shopping, utilities, subscriptions, and services.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "Review your personalized card recommendations",
      text: "ClearFin calculates your estimated annual earnings across 120+ Canadian cards and ranks them by net value for your specific spending profile.",
    },
  ],
};

export default async function CalculatorPage() {
  const catalog = await getCatalogDisplayMap();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="grain" />
      <Nav />

      <SpendProvider>
        <CatalogProvider map={catalog}>
          <InteractiveTool />
        </CatalogProvider>
      </SpendProvider>

      <SiteFooter />
    </>
  );
}

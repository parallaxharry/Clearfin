import type { Metadata } from "next";
import Link from "next/link";
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
    "Answer 7 questions about your spending, income and credit score. ClearFin ranks eligible Canadian cards by estimated annual rewards after fees.",
  keywords: [
    "credit card calculator Canada",
    "credit card rewards calculator Canada",
    "cash back calculator Canada",
    "best credit card for my spending Canada",
  ],
  alternates: { canonical: "/credit-card-calculator-canada" },
  openGraph: {
    title: "Credit Card Rewards Calculator Canada | ClearFin",
    description:
      "Answer 7 questions and compare Canadian credit cards based on your actual spending, annual fees and eligibility profile.",
    url: "https://www.clearfin.ca/credit-card-calculator-canada",
    siteName: "ClearFin",
    type: "website",
    locale: "en_CA",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClearFin Credit Card Rewards Calculator Canada",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://www.clearfin.ca/credit-card-calculator-canada",
  description:
    "Estimate which Canadian credit cards may deliver more annual reward value based on your monthly spending, annual fees, income and credit profile.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
  },
  creator: { "@id": "https://www.clearfin.ca/#organization" },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to compare Canadian credit cards for your spending with ClearFin",
  description:
    "Enter your spending and eligibility profile, then review Canadian credit cards ranked by estimated annual reward value after fees.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Start the ClearFin calculator",
      text: "Open the calculator. No signup or card number is required to use the comparison tool.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter your monthly spending",
      text: "Answer five spending questions covering dining, groceries, gas, travel and other purchases.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Enter your annual income",
      text: "Provide an approximate annual income so cards with stated income requirements can be matched more appropriately.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Enter an estimated credit score",
      text: "Provide an approximate credit score to help filter cards using ClearFin's eligibility estimates.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Review the ranked cards",
      text: "Compare estimated annual reward value after annual fees and review each card's current issuer terms before applying.",
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

      <main>
        <h1 className="sr-only">Credit card rewards calculator for Canada</h1>

        <SpendProvider>
          <CatalogProvider map={catalog}>
            <InteractiveTool />
          </CatalogProvider>
        </SpendProvider>

        <div
          className="mx-auto w-full max-w-[1400px] px-6 py-20 text-[color:var(--ink)] md:px-10 md:py-24"
          aria-labelledby="calculator-method"
        >
          <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                What the calculator actually does
              </p>
              <h2 id="calculator-method" className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Your best card depends on the mix of your spending, not one advertised reward rate.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-7 text-[color:var(--ink-mute)]">
                <p>
                  ClearFin starts with five monthly spending categories: dining, groceries, gas,
                  travel and other purchases. It then uses your approximate income and credit score
                  to avoid presenting every card as equally realistic when a product has stated
                  eligibility requirements.
                </p>
                <p>
                  The calculator estimates how much each card could earn across those categories over
                  a year and subtracts the annual fee. That creates an estimated net annual value you
                  can use as a starting point when comparing cards with very different fee structures
                  and reward programs.
                </p>
                <p>
                  The calculation is an estimate, not a promise of rewards or approval. Merchant
                  category coding, reward caps, point valuations, redemption choices and issuer terms
                  can change the final result. Income and credit-score information is also used only
                  for matching; the card issuer makes the actual approval decision.
                </p>
              </div>
            </div>

            <aside className="self-start rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-8">
              <h2 className="text-xl font-semibold tracking-[-0.02em]">What you&apos;ll need</h2>
              <div className="mt-5 space-y-5 text-sm leading-6 text-[color:var(--ink-mute)]">
                <div>
                  <h3 className="font-semibold text-[color:var(--ink)]">Your approximate monthly spending</h3>
                  <p>A reasonable estimate is enough. You can adjust the amounts and rerun the calculator whenever your spending changes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--ink)]">Income and credit estimates</h3>
                  <p>These help narrow the results. They do not pre-qualify you for a card and are not an approval decision.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--ink)]">No signup or card numbers</h3>
                  <p>You can use the calculator without creating an account or entering existing credit-card numbers.</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-sm leading-6 text-[color:var(--ink-mute)]">
            Already deciding between two specific cards? Open the{" "}
            <Link className="font-semibold text-[color:var(--accent)] hover:underline" href="/compare-credit-cards-canada">
              side-by-side Canadian credit card comparison
            </Link>
            . For broader research, see our{" "}
            <Link className="font-semibold text-[color:var(--accent)] hover:underline" href="/best-credit-cards-canada">
              best credit cards in Canada guide
            </Link>
            {" "}and our{" "}
            <Link className="font-semibold text-[color:var(--accent)] hover:underline" href="/credit-card-rewards-canada-guide">
              reward-value methodology
            </Link>
            .
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

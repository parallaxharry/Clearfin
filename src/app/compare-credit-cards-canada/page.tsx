import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
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
    "Compare two Canadian credit cards side by side using your spending. See rewards by category, annual fees and estimated net annual value.",
  keywords: [
    "compare credit cards in Canada",
    "Canadian credit card comparison",
    "credit card comparison Canada",
    "compare credit cards side by side",
  ],
  alternates: { canonical: "/compare-credit-cards-canada" },
  openGraph: {
    title: "Compare Credit Cards in Canada Side by Side | ClearFin",
    description:
      "Compare two Canadian credit cards side by side using your spending, including rewards by category, annual fees and estimated net value.",
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
    "Compare two Canadian credit cards side by side using your spending, including rewards by category, annual fees, and estimated net annual value.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  creator: { "@id": "https://www.clearfin.ca/#organization" },
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

      <main>
        <header className="mx-auto max-w-5xl px-6 pt-32 pb-4 text-center md:pt-36">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
            Canadian credit card comparison
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[color:var(--ink)] md:text-6xl">
            Compare credit cards in Canada <span className="text-[color:var(--accent)]">side by side.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[color:var(--ink-mute)] md:text-lg">
            Pick any two cards and compare how they perform for your monthly spending, including
            category rewards, annual fees and estimated net value after fees.
          </p>
        </header>

        <SpendProvider>
          <CatalogProvider map={catalog}>
            <CompareSection />
          </CatalogProvider>
        </SpendProvider>

        <section
          className="mx-auto max-w-5xl px-6 py-20 text-[color:var(--ink)] md:py-24"
          aria-labelledby="how-clearfin-compares"
        >
          <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                How the comparison works
              </p>
              <h2 id="how-clearfin-compares" className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                A card can look great on paper and still be the wrong fit for your spending.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-7 text-[color:var(--ink-mute)]">
                <p>
                  ClearFin compares cards using the spending profile in the calculator rather than
                  ranking every card by one headline earn rate. A grocery-heavy household can get a
                  very different result from someone who spends more on dining, travel or general
                  purchases.
                </p>
                <p>
                  For each selected card, the comparison estimates category earnings over a year and
                  subtracts the card&apos;s annual fee. The result is an estimated net annual value that
                  makes it easier to see whether a higher-fee card actually earns enough for your
                  spending to justify that cost.
                </p>
                <p>
                  Reward values are estimates, not guaranteed cash returns. Merchant coding, earning
                  caps, redemption choices, issuer program changes and eligibility rules can all change
                  what a card ultimately delivers. ClearFin keeps those assumptions visible so the
                  comparison stays useful without pretending every reward point has one fixed value.
                </p>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-8">
              <h2 className="text-xl font-semibold tracking-[-0.02em]">What to compare before applying</h2>
              <div className="mt-5 space-y-5 text-sm leading-6 text-[color:var(--ink-mute)]">
                <div>
                  <h3 className="font-semibold text-[color:var(--ink)]">Rewards where you actually spend</h3>
                  <p>Look beyond the largest advertised multiplier and check the categories that make up most of your budget.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--ink)]">Annual fee after the first year</h3>
                  <p>A first-year waiver can be useful, but the ongoing fee matters when deciding whether a card is worth keeping.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--ink)]">Eligibility and issuer terms</h3>
                  <p>Income, credit history and issuer underwriting still determine approval. A ClearFin ranking is not an approval guarantee.</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-sm leading-6 text-[color:var(--ink-mute)]">
            Want a personalized starting point instead? Use the{" "}
            <Link className="font-semibold text-[color:var(--accent)] hover:underline" href="/credit-card-calculator-canada">
              Canadian credit card rewards calculator
            </Link>
            {" "}or browse our{" "}
            <Link className="font-semibold text-[color:var(--accent)] hover:underline" href="/best-credit-cards-canada">
              best credit cards in Canada guide
            </Link>
            . You can also review the{" "}
            <Link className="font-semibold text-[color:var(--accent)] hover:underline" href="/credit-card-rewards-canada-guide">
              ClearFin rewards methodology
            </Link>
            {" "}to see how estimated reward values are calculated.
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

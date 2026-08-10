import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

const pageUrl = "https://www.clearfin.ca/blog/how-clearfin-helps";
const pageTitle = "How ClearFin Helps You Compare Canadian Credit Cards";
const pageDescription =
  "Credit card rewards look simple until you try to compare them. Here's how ClearFin turns your real spending into a calmer, more practical card choice.";

export const metadata: Metadata = {
  title: `${pageTitle} | ClearFin Blog`,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "ClearFin",
    locale: "en_CA",
    type: "article",
  },
};

export default function HowClearFinHelpsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    datePublished: "2026-08-10",
    dateModified: "2026-08-10",
    author: { "@type": "Organization", name: "ClearFin Team", url: "https://www.clearfin.ca" },
    publisher: { "@type": "Organization", name: "ClearFin", url: "https://www.clearfin.ca" },
    mainEntityOfPage: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Nav />
      <main className="catalog-page how-helps-page">
        <nav className="blog-index-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">How ClearFin helps</span>
        </nav>

        <section className="home-seo-intro" aria-labelledby="home-seo-intro-title">
          <div className="home-seo-intro-inner">
            <div className="home-seo-intro-heading">
              <div className="home-seo-kicker">How ClearFin helps</div>
              <h2 id="home-seo-intro-title">
                Compare Canadian credit cards around the way you <span>actually spend.</span>
              </h2>
              <p className="home-seo-lede">
                Credit card rewards look simple until you try to compare them.
                Grocery rates can depend on the store, travel points can change
                value depending on how you redeem them, and a large welcome offer
                does not always make up for an annual fee. ClearFin brings those
                details into one place so you can make a calmer, more practical
                choice.
              </p>
              <Link href="/credit-cards" className="home-seo-catalog-link">
                Explore the card catalogue <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="home-seo-story">
              <article className="home-seo-card">
                <div className="home-seo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 7.5h16v10H4zM4 10.5h16M7 14.5h4" /></svg>
                </div>
                <div>
                  <h3>Start with your real spending</h3>
                  <p>
                    Start with our{" "}
                    <Link href="/credit-card-calculator-canada">
                      Canadian credit card calculator
                    </Link>{" "}
                    and enter the categories that matter in your household. We use that
                    spending mix to estimate which cards may return more value after
                    the annual fee. You can then open the card details, compare
                    alternatives side by side, and check the issuer&apos;s current
                    terms before applying.
                  </p>
                </div>
              </article>

              <article className="home-seo-card">
                <div className="home-seo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 19V10M12 19V5M19 19v-7M3 19h18" /></svg>
                </div>
                <div>
                  <h3>See the trade-offs clearly</h3>
                  <p>
                    ClearFin is most useful when your spending is uneven. Maybe
                    groceries and recurring bills are the big categories, or perhaps
                    dining and travel matter more. Instead of assuming the same card is
                    best for everyone, the comparison follows your numbers. You can
                    also browse our guides to understand{" "}
                    <Link href="/best-cashback-credit-cards-canada">cash back</Link>,{" "}
                    <Link href="/best-travel-credit-cards-canada">travel rewards</Link>,
                    and{" "}
                    <Link href="/best-no-fee-credit-cards-canada">
                      no-annual-fee cards
                    </Link>{" "}
                    in plain language.
                  </p>
                </div>
              </article>

              <article className="home-seo-card home-seo-card-independent">
                <div className="home-seo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="m12 3 7 3v5c0 4.6-2.8 8.1-7 10-4.2-1.9-7-5.4-7-10V6zM9 12l2 2 4-4" /></svg>
                </div>
                <div>
                  <h3>Independent by design</h3>
                  <p>
                    ClearFin is not a bank or digital wallet, and it does not move your
                    money. It is an independent comparison and education tool. The goal
                    is straightforward: help you understand the trade-offs, choose a
                    card that fits your real routine, and avoid paying for benefits you
                    are unlikely to use.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

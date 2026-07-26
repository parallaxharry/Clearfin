import Link from "next/link";
import type { Metadata } from "next";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import SeoCardActions from "@/components/SeoCardActions";
import SeoCardImage from "@/components/SeoCardImage";
import SeoLayout from "@/components/SeoLayout";

export const revalidate = 300;

const pageUrl = "https://www.clearfin.ca/best-grocery-credit-cards-canada";
const pageTitle = "Best Grocery Credit Cards in Canada for 2026";
const pageDescription =
  "Compare Canadian grocery credit cards by store acceptance, earn rate, annual fee and spending limits. Find a card that fits where your household shops.";

export const metadata: Metadata = {
  title: "Best Grocery Credit Cards Canada 2026 | ClearFin",
  description: pageDescription,
  keywords: [
    "best grocery credit card Canada",
    "best credit card for groceries Canada",
    "grocery rewards credit cards Canada",
    "cash back groceries Canada",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: "article",
    locale: "en_CA",
    siteName: "ClearFin",
  },
};

const cards = [
  {
    name: "Scotiabank Gold American Express",
    issuer: "Scotiabank",
    label: "For Scene+ grocery partners",
    detail:
      "6 Scene+ points per dollar at participating Sobeys-family grocers, 5 points at other eligible grocery stores and on eligible dining, and a $120 annual fee.",
    take:
      "The strongest rate depends on where you shop, and American Express acceptance should be checked before applying.",
  },
  {
    name: "American Express Cobalt Card",
    issuer: "American Express",
    label: "For food spending",
    detail:
      "5 Membership Rewards points per dollar on eligible eats and drinks in Canada, including qualifying grocery stores, up to the published monthly limit.",
    take:
      "Useful when food is a major category and you can get enough value from the points to cover the $15.99 monthly fee.",
  },
  {
    name: "CIBC Dividend Visa Infinite",
    issuer: "CIBC",
    label: "For cash back on groceries and gas",
    detail:
      "4% cash back on eligible groceries, gas and EV charging; 2% on several practical categories; 1% on other purchases; $120 annual fee.",
    take:
      "A clearer fit for someone who prefers cash back and wants Visa acceptance.",
  },
  {
    name: "BMO Eclipse Visa Infinite",
    issuer: "BMO",
    label: "For several everyday categories",
    detail:
      "5 BMO Rewards points per dollar on eligible groceries, dining, gas and transit; 1 point per dollar on other purchases; $120 annual fee.",
    take:
      "Five points are not the same as 5% cash back, so compare the redemption value you will actually use.",
  },
  {
    name: "PC Financial World Elite Mastercard",
    issuer: "PC Financial",
    label: "For participating Loblaw-banner stores",
    detail:
      "3% back in PC Optimum points at participating grocery stores and no annual fee, subject to eligibility and approval requirements.",
    take:
      "A store-specific choice: it can work well inside the PC Optimum ecosystem and much less well outside it.",
  },
];

export default function BestGroceryCreditCardsCanada() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: pageTitle,
    description: pageDescription,
    author: { "@type": "Organization", name: "ClearFin" },
    publisher: {
      "@type": "Organization",
      name: "ClearFin",
      url: "https://www.clearfin.ca",
    },
    datePublished: "2026-05-01",
    dateModified: "2026-07-26",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <SeoLayout
        title={pageTitle}
        subtitle="The grocery card with the biggest number is not always the best one—your store, card network and spending limit decide what you really earn."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Credit Cards", href: "/credit-cards" },
          { label: "Best Grocery Cards", href: pageUrl },
        ]}
        lastUpdated="July 26, 2026"
      >
        <p>
          Grocery rewards are unusually dependent on the details. Some cards
          pay their best rate only at a group of partner stores. Some warehouse
          clubs may be coded differently from a normal supermarket. American
          Express can be rewarding where it is accepted, but it should not be
          assumed to work at every checkout.
        </p>
        <p>
          We reviewed these cards by asking a practical question: who is each
          card actually for? Rates and fees were checked on issuer pages on July
          26, 2026. Temporary welcome offers are not the reason a card appears
          here.
        </p>

        <h2>Five grocery cards worth putting on your shortlist</h2>
        <div className="seo-card-grid">
          {cards.map((card) => (
            <div className="seo-card-box" key={card.name}>
              <div className="seo-card-box-rank">{card.label}</div>
              <SeoCardImage name={card.name} />
              <div className="seo-card-box-name">{card.name}</div>
              <div className="seo-card-box-issuer">{card.issuer}</div>
              <div className="seo-card-box-detail">{card.detail}</div>
              <div className="seo-card-box-highlight">{card.take}</div>
              <SeoCardActions name={card.name} />
            </div>
          ))}
        </div>

        <AffiliateDisclosure />

        <h2>Quick comparison</h2>
        <div className="seo-table-wrap">
          <table className="seo-table">
            <thead>
              <tr>
                <th>Card</th>
                <th>Fee</th>
                <th>Grocery strength</th>
                <th>Main trade-off</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Scotiabank Gold Amex</td>
                <td>$120/year</td>
                <td>6x at participating Scene+ grocers; 5x other eligible grocery</td>
                <td>Store and Amex acceptance</td>
              </tr>
              <tr>
                <td>American Express Cobalt</td>
                <td>$15.99/month</td>
                <td>5x on eligible Canadian eats and drinks</td>
                <td>Monthly cap and point valuation</td>
              </tr>
              <tr>
                <td>CIBC Dividend Visa Infinite</td>
                <td>$120/year</td>
                <td>4% on eligible grocery purchases</td>
                <td>Income requirement and category limits</td>
              </tr>
              <tr>
                <td>BMO Eclipse Visa Infinite</td>
                <td>$120/year</td>
                <td>5 BMO Rewards points per dollar</td>
                <td>Point value depends on redemption</td>
              </tr>
              <tr>
                <td>PC Financial World Elite</td>
                <td>$0</td>
                <td>3% in points at participating grocery stores</td>
                <td>Works best inside one store ecosystem</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Choose the store before the card</h2>
        <p>
          Write down the two stores where you buy most of your groceries. Then
          confirm which card network each store accepts and whether the issuer
          treats the merchant as a grocery store. This step can eliminate an
          otherwise impressive card immediately.
        </p>
        <p>
          A Scotiabank Gold Amex is especially interesting at participating
          Sobeys-family stores. A PC Financial card is built around
          participating Loblaw-banner stores and PC Optimum redemptions. If
          neither group reflects your routine, a broader grocery cash back card
          may be easier to use.
        </p>

        <h2>Points and percentages are not interchangeable</h2>
        <p>
          Five points per dollar does not automatically mean 5% back. With
          cash back, the percentage is direct. With points, the result depends
          on the program and redemption you choose. Compare the dollar value of
          a realistic redemption, not an optimistic “up to” estimate.
        </p>

        <h2>Check the spending cap</h2>
        <p>
          Grocery bonus rates often have monthly or annual limits. The Amex
          Cobalt food rate, for example, has a monthly purchase limit. Other
          cards apply their accelerated rate only to a set amount of annual
          category spending. If your household spends beyond the cap, include
          the lower rate in the rest of your calculation.
        </p>

        <h2>Do you need a backup card?</h2>
        <p>
          A high-earning American Express card can still be a good choice even
          when it is not accepted everywhere. The practical solution is often a
          no-fee Visa or Mastercard backup. Our guide to the{" "}
          <Link href="/best-credit-card-combination-in-canada-for-2026-how-to-pair-two-cards-for-maximum-rewards">
            best credit card combinations in Canada
          </Link>{" "}
          explains how to give each card a separate job without overcomplicating
          your wallet.
        </p>

        <h2>Our bottom line</h2>
        <p>
          For a Scene+ grocery shopper, Scotiabank Gold may be the first card to
          calculate. For broader food spending, Cobalt deserves a look. For
          direct cash back and Visa acceptance, CIBC Dividend is easier to
          value. BMO Eclipse covers several everyday categories, while PC
          Financial World Elite is a focused no-fee option for participating
          grocery stores. The best choice starts with your receipt, not the ad.
        </p>

        <h2>Official sources</h2>
        <p>
          Current details were checked on official pages from{" "}
          <a
            href="https://www.scotiabank.com/ca/en/personal/credit-cards/rewards.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scotiabank
          </a>
          ,{" "}
          <a
            href="https://www.americanexpress.com/ca/en/benefits/cobalt-card/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            American Express
          </a>
          ,{" "}
          <a
            href="https://www.cibc.com/en/personal-banking/credit-cards/cash-back-cards.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            CIBC
          </a>
          ,{" "}
          <a
            href="https://www.bmo.com/main/personal/credit-cards/bmo-eclipse-visa-infinite/"
            target="_blank"
            rel="noopener noreferrer"
          >
            BMO
          </a>
          , and{" "}
          <a
            href="https://www.pcfinancial.ca/en/credit-cards/world-elite/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PC Financial
          </a>
          .
        </p>
      </SeoLayout>
    </>
  );
}

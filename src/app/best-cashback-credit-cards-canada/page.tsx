import Link from "next/link";
import type { Metadata } from "next";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import SeoCardActions from "@/components/SeoCardActions";
import SeoCardImage from "@/components/SeoCardImage";
import SeoLayout from "@/components/SeoLayout";

export const revalidate = 300;

const pageUrl = "https://www.clearfin.ca/best-cashback-credit-cards-canada";
const pageTitle = "Best Cashback Credit Cards in Canada for 2026";
const pageDescription =
  "Compare Canadian cash back credit cards for groceries, gas, recurring bills and everyday purchases, with annual fees and spending caps explained.";

export const metadata: Metadata = {
  title: "Best Cash Back Credit Cards Canada 2026 | ClearFin",
  description: pageDescription,
  keywords: [
    "best cash back credit cards Canada",
    "best cashback credit cards Canada",
    "cash back credit cards Canada 2026",
    "best credit card for groceries and gas Canada",
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
    name: "Tangerine Money-Back Credit Card",
    issuer: "Tangerine",
    label: "Flexible no-fee option",
    detail:
      "2% cash back in two selected categories, or three when rewards are deposited to a Tangerine Savings Account; 0.5% on other purchases; $0 annual fee.",
    take:
      "A sensible pick if your largest spending categories can be covered by Tangerine's category list.",
  },
  {
    name: "CIBC Dividend Visa Infinite",
    issuer: "CIBC",
    label: "Strong for groceries and driving",
    detail:
      "4% on eligible groceries, gas and EV charging; 2% on eligible transit, dining, recurring payments and CIBC by Expedia travel; 1% on other purchases; $120 annual fee.",
    take:
      "Worth a closer look when groceries and fuel are large, predictable parts of the household budget.",
  },
  {
    name: "Scotiabank Momentum Visa Infinite",
    issuer: "Scotiabank",
    label: "Strong for groceries and recurring bills",
    detail:
      "4% on eligible groceries and recurring bill payments; 2% on eligible gas, EV charging and daily transit; 1% on other purchases; $120 annual fee.",
    take:
      "The recurring-bill category can be useful, but merchant coding and annual spending limits still matter.",
  },
  {
    name: "BMO CashBack World Elite Mastercard",
    issuer: "BMO",
    label: "Several everyday bonus categories",
    detail:
      "5% on eligible groceries, 4% on transit, 3% on gas and EV charging, 2% on recurring bills and 1% on other purchases; $120 annual fee.",
    take:
      "The headline rates are attractive, but check each category's monthly cap before estimating your return.",
  },
  {
    name: "SimplyCash Card from American Express",
    issuer: "American Express",
    label: "Simple no-fee Amex",
    detail:
      "2% on eligible Canadian gas and grocery purchases, with a grocery limit, and 1.25% on other eligible purchases; no annual fee.",
    take:
      "A straightforward card for someone who wants a useful base rate and shops where American Express is accepted.",
  },
];

export default function BestCashbackCreditCardsCanada() {
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
        subtitle="Cash back is easy to value, but the best card still depends on where you spend and how much of an annual fee you can recover."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Credit Cards", href: "/credit-cards" },
          { label: "Best Cashback", href: pageUrl },
        ]}
        lastUpdated="July 26, 2026"
      >
        <p>
          Cash back is the least mysterious credit card reward: one dollar of
          cash back is one dollar. The complicated part is everything around
          it. The biggest earn rate may apply only to one category, only up to a
          spending limit, and only when the merchant is coded the way the issuer
          expects.
        </p>
        <p>
          So this is not a universal ranking. These are five useful starting
          points for different types of Canadian spending. We checked the
          ongoing earn rates and annual fees on issuer pages on July 26, 2026.
          Welcome offers change often and are not used to decide the order.
        </p>

        <h2>Five cash back cards worth comparing</h2>
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
                <th>Annual fee</th>
                <th>Useful when...</th>
                <th>Watch for...</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tangerine Money-Back</td>
                <td>$0</td>
                <td>You want to choose your own bonus categories</td>
                <td>Only 0.5% outside selected categories</td>
              </tr>
              <tr>
                <td>CIBC Dividend Visa Infinite</td>
                <td>$120</td>
                <td>Groceries and gas or EV charging are major expenses</td>
                <td>Income requirement and category limits</td>
              </tr>
              <tr>
                <td>Scotia Momentum Visa Infinite</td>
                <td>$120</td>
                <td>You have large grocery and recurring-bill spending</td>
                <td>Accelerated rates have annual limits</td>
              </tr>
              <tr>
                <td>BMO CashBack World Elite</td>
                <td>$120</td>
                <td>You spend across groceries, transit, gas and bills</td>
                <td>Monthly category caps can change the result</td>
              </tr>
              <tr>
                <td>SimplyCash from Amex</td>
                <td>$0</td>
                <td>You value a 1.25% base rate with gas and grocery bonuses</td>
                <td>Amex acceptance and the grocery limit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>How to choose without guessing</h2>
        <h3>Start with the categories on your real statements</h3>
        <p>
          Add up three ordinary months of groceries, gas, transit, dining,
          recurring bills and everything else. Do not use a month with a major
          vacation or renovation unless that is typical for you. A category
          card only helps when your spending repeatedly lands in its strongest
          categories.
        </p>

        <h3>Check the cap, not only the percentage</h3>
        <p>
          BMO and several other issuers place monthly or annual limits on their
          highest rates. After the limit, the card earns a lower rate. That does
          not make the card bad; it means the headline percentage is not the
          whole calculation.
        </p>

        <h3>Make the annual fee earn its place</h3>
        <p>
          Compare a fee card with a realistic no-fee alternative. If a $120
          card earns only $70 more for your spending, the no-fee card leaves you
          ahead. Count insurance or other benefits only when you would have paid
          for an equivalent benefit yourself.
        </p>

        <h3>Do not carry interest for rewards</h3>
        <p>
          Rewards are valuable only when the account is managed well. Interest
          on a carried balance can quickly exceed the cash back earned. If you
          expect to carry a balance, compare low-interest cards before rewards
          cards.
        </p>

        <h2>A simple example</h2>
        <p>
          Suppose most of your monthly card spending is groceries and
          pre-authorized bills. Scotia Momentum may deserve a calculation
          because both categories earn its top published rate. If your spending
          is lighter and spread across restaurants, transit and home
          improvement, Tangerine&apos;s selectable categories may be easier to
          justify because there is no annual fee. The right answer comes from
          the spending pattern, not the louder advertisement.
        </p>
        <p>
          Try the{" "}
          <Link href="/credit-card-calculator-canada">
            ClearFin cash back calculator
          </Link>{" "}
          with your own numbers, then confirm the current offer, category
          definitions and limits on the issuer&apos;s website before applying.
        </p>

        <h2>Official sources</h2>
        <p>
          We checked the current product information on the official pages for{" "}
          <a
            href="https://www.tangerine.ca/en/personal/spend/credit-cards/money-back-credit-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tangerine
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
            href="https://www.scotiabank.com/ca/en/personal/loans-lines/help-me-choose-payments/momentum-visa-infinite.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scotiabank
          </a>
          ,{" "}
          <a
            href="https://www.bmo.com/en-ca/main/personal/credit-cards/what-are-credit-card-fees/"
            target="_blank"
            rel="noopener noreferrer"
          >
            BMO
          </a>
          , and{" "}
          <a
            href="https://www.americanexpress.com/en-ca/credit-cards/simply-cash/"
            target="_blank"
            rel="noopener noreferrer"
          >
            American Express
          </a>
          .
        </p>
      </SeoLayout>
    </>
  );
}

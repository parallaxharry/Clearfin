import Link from "next/link";
import type { Metadata } from "next";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import SeoCardActions from "@/components/SeoCardActions";
import SeoCardImage from "@/components/SeoCardImage";
import SeoLayout from "@/components/SeoLayout";

// ISR: Supabase card_catalog edits (for example, affiliate links) go live within ~5 min.
export const revalidate = 300;

const pageUrl = "https://www.clearfin.ca/best-credit-cards-canada";
const pageTitle = "Best Credit Cards in Canada for 2026";
const pageDescription =
  "Compare useful Canadian credit cards for food, cash back, travel and everyday spending, with current annual fees and important trade-offs explained.";

export const metadata: Metadata = {
  title: "Best Credit Cards in Canada 2026 | ClearFin",
  description: pageDescription,
  keywords: [
    "best credit cards Canada",
    "best credit cards in Canada 2026",
    "credit card rewards comparison Canada",
    "best credit card sign-up bonus Canada",
    "best credit card for online shopping Canada",
    "best credit card for everyday spending Canada",
    "best credit card for young professionals Canada",
    "best credit card for Amazon Canada",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "ClearFin",
    type: "article",
    locale: "en_CA",
  },
};

const cards = [
  {
    name: "American Express Cobalt Card",
    issuer: "American Express",
    label: "A food-first points card",
    detail:
      "5 Membership Rewards points per dollar on eligible Canadian eats and drinks, up to $2,500 in purchases each month; 3 points on eligible streaming, 2 on eligible gas and transit, and 1 on other eligible purchases. The fee is $15.99 per month.",
    take:
      "Worth considering when food is a large category and the places you use accept American Express. The monthly cap and the way you redeem points both matter.",
  },
  {
    name: "Scotiabank Gold American Express",
    issuer: "Scotiabank",
    label: "For Scene+ grocery and food spending",
    detail:
      "6 Scene+ points per dollar at participating Sobeys-family grocers, 5 points on other eligible groceries and dining, and a $120 annual fee.",
    take:
      "The strongest earn rate depends on the store. Check both the merchant list and American Express acceptance before treating the headline rate as your normal return.",
  },
  {
    name: "TD Aeroplan Visa Infinite",
    issuer: "TD Bank",
    label: "For regular Air Canada travellers",
    detail:
      "1.5 Aeroplan points per dollar on eligible gas, EV charging, groceries and purchases made directly with Air Canada; 1 point on other eligible purchases; $139 annual fee.",
    take:
      "The Aeroplan and Air Canada benefits are more useful when you fly with the airline often enough to use them. Otherwise, a simpler cash back card may be easier to value.",
  },
  {
    name: "CIBC Dividend Visa Infinite",
    issuer: "CIBC",
    label: "For practical cash back categories",
    detail:
      "4% cash back on eligible gas, EV charging and groceries; 2% on eligible transportation, dining, recurring payments and CIBC by Expedia travel; 1% on other purchases; $120 annual fee.",
    take:
      "A clear option when groceries and driving are large, predictable expenses and you prefer cash back to learning a points program.",
  },
  {
    name: "Tangerine Money-Back Credit Card",
    issuer: "Tangerine",
    label: "A flexible no-fee option",
    detail:
      "2% cash back in two selected categories, or three when rewards are deposited to a Tangerine Savings Account; 0.5% on other purchases; $0 annual fee.",
    take:
      "Useful when your largest expenses fit Tangerine's category list. Spending outside the selected categories earns a much lower rate.",
  },
];

const faqData = [
  {
    q: "What is the best credit card in Canada right now?",
    a: "There is no single best card for every household. Start with the categories where you spend the most, subtract the annual fee, and check whether you can use the rewards and benefits without changing your normal routine.",
  },
  {
    q: "Are no-annual-fee credit cards worth considering?",
    a: "Yes. A no-fee card can leave you with more net value when your spending is moderate or spread across categories that a premium card does not reward well. Compare the annual return after fees rather than assuming a paid card is automatically better.",
  },
  {
    q: "Should I choose a card for its welcome offer?",
    a: "A welcome offer can improve first-year value, but the spending requirement, eligibility rules and offer itself can change. Treat it as one part of the decision and compare the card's regular earn rates and annual fee as well.",
  },
  {
    q: "How many credit cards should I carry?",
    a: "Use the fewest cards that cover your important spending categories without making bills, due dates and redemptions difficult to manage. Some people prefer one simple card, while others use a second card for a category or payment network their primary card misses.",
  },
  {
    q: "What eligibility rules should I check before applying?",
    a: "Check the issuer's current income, residency, age and credit requirements on the application page. Approval is always the issuer's decision, and meeting a published minimum does not guarantee approval.",
  },
];

export default function BestCreditCardsCanadaPage() {
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
    articleSection: "Credit Card Guides",
    datePublished: "2026-01-15",
    dateModified: "2026-08-02",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SeoLayout
        title={pageTitle}
        subtitle="A useful card fits your spending, earns rewards you can actually use and still makes sense after the annual fee. These are practical starting points, not a universal ranking."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Credit Cards", href: "/credit-cards" },
          { label: "Best Credit Cards", href: "/best-credit-cards-canada" },
        ]}
        lastUpdated="August 2, 2026"
      >
        <h2>Five cards worth comparing for different reasons</h2>
        <p>
          A credit card can look excellent in an advertisement and still be a
          poor fit at home. The result changes with the stores you use, the
          amount you spend, the payment network merchants accept and whether
          you prefer cash back or travel points. Even a valuable insurance or
          airport benefit is worth little when you would not otherwise use it.
        </p>
        <p>
          The cards below cover five common situations rather than pretending
          one product wins for everyone. We checked the ongoing earn rates and
          annual fees on issuer pages on August 2, 2026. Welcome offers are not
          used to decide the order because they change frequently. Before
          applying, open the issuer source and confirm the current terms for
          your province and application.
        </p>

        <div className="seo-card-grid">
          {cards.map((card) => (
            <div className="seo-card-box" key={card.name}>
              <SeoCardImage name={card.name} />
              <h3>{card.name}</h3>
              <p>
                <strong>{card.label}</strong>
              </p>
              <p>{card.detail}</p>
              <p>{card.take}</p>
              <SeoCardActions name={card.name} />
            </div>
          ))}
        </div>

        <AffiliateDisclosure />

        <h2>A quick comparison before you calculate</h2>
        <div className="seo-table-wrap">
          <table className="seo-table">
            <thead>
              <tr>
                <th>Card</th>
                <th>Annual fee</th>
                <th>Useful when</th>
                <th>Check carefully</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>American Express Cobalt</td>
                <td>$15.99/month</td>
                <td>Eligible food spending is a major category</td>
                <td>Monthly food cap, point use and Amex acceptance</td>
              </tr>
              <tr>
                <td>Scotiabank Gold American Express</td>
                <td>$120/year</td>
                <td>You shop at participating Scene+ grocers</td>
                <td>Store-specific rates and Amex acceptance</td>
              </tr>
              <tr>
                <td>TD Aeroplan Visa Infinite</td>
                <td>$139/year</td>
                <td>You regularly use Air Canada and Aeroplan</td>
                <td>Benefit use, redemption value and eligibility</td>
              </tr>
              <tr>
                <td>CIBC Dividend Visa Infinite</td>
                <td>$120/year</td>
                <td>Groceries and driving are large expenses</td>
                <td>Category limits and income requirements</td>
              </tr>
              <tr>
                <td>Tangerine Money-Back</td>
                <td>$0</td>
                <td>Your spending fits two or three chosen categories</td>
                <td>Only 0.5% outside those categories</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Start with your spending, not the card name</h2>
        <p>
          Look at a few normal months and total groceries, restaurants, gas,
          transit, recurring bills, travel and everything else. Then compare
          what each card would earn in those categories and subtract its annual
          fee. Do not value a point at the best redemption someone else found;
          use the redemption you are realistically willing to book.
        </p>
        <p>
          ClearFin&apos;s{" "}
          <Link href="/credit-card-calculator-canada">
            Canadian credit card calculator
          </Link>{" "}
          applies card earn rates to the spending you enter. After that, use the{" "}
          <Link href="/compare-credit-cards-canada">
            side-by-side comparison tool
          </Link>{" "}
          to inspect the annual fee, category return and estimated net value.
          The estimate is a starting point, so confirm merchant coding, caps and
          issuer terms before applying.
        </p>

        <h2>What about sign-up bonuses?</h2>
        <p>
          The best credit card sign-up bonus in Canada can change while a guide
          is still being indexed. A large number is also not free value: you may
          need to meet a spending target, keep the account open for an
          anniversary offer or pay the annual fee before receiving every part.
          Check the application page on the day you apply and ignore any bonus
          that would require purchases you were not already planning.
        </p>

        <h2>Online shopping, Amazon and everyday purchases</h2>
        <p>
          For online shopping or Amazon.ca, look beyond a category headline.
          Marketplace purchases often earn a card&apos;s general rate unless the
          issuer identifies the merchant as an eligible bonus category. Payment
          network acceptance, purchase protection and the base earn rate may be
          more useful than a narrow promotion. Our guide to the{" "}
          <Link href="/best-credit-card-for-everyday-spending-in-canada-2026-picks">
            best credit cards for everyday spending
          </Link>{" "}
          compares cards around common household use rather than a single
          retailer.
        </p>

        <h2>A practical approach for young professionals</h2>
        <p>
          A card marketed as premium is not automatically the best credit card
          for a young professional in Canada. A no-fee card can make more sense
          while spending is modest, while a travel card may be reasonable for
          someone who flies often and would buy the included benefits anyway.
          Leave room in the budget to pay the statement balance and keep the
          number of cards easy to manage.
        </p>

        <h2>Choose a deeper guide for your main category</h2>

        <h3>Cash back</h3>
        <p>
          Cash back is easy to compare because the value is stated in dollars.
          Category limits and annual fees still matter. See the{" "}
          <Link href="/best-cashback-credit-cards-canada">
            best cash back credit cards in Canada
          </Link>.
        </p>

        <h3>Travel</h3>
        <p>
          Travel cards can offer more value when you understand the program and
          use its airline, transfer or airport benefits. Compare our{" "}
          <Link href="/best-travel-credit-cards-canada">
            Canadian travel credit card guide
          </Link>.
        </p>

        <h3>Groceries</h3>
        <p>
          Grocery rewards depend heavily on where the store sits in the
          issuer&apos;s merchant categories. Read the{" "}
          <Link href="/best-grocery-credit-cards-canada">
            grocery credit card comparison
          </Link>{" "}
          before assuming every supermarket earns the same rate.
        </p>

        <h3>No annual fee</h3>
        <p>
          A no-fee card can be a strong primary card or a useful backup for a
          payment network your other card does not cover. Start with the{" "}
          <Link href="/best-no-fee-credit-cards-canada">
            best no-annual-fee credit cards in Canada
          </Link>.
        </p>

        <h3>Students and credit builders</h3>
        <p>
          Approval requirements and responsible repayment matter more than a
          small reward difference when you are establishing credit. Our{" "}
          <Link href="/best-student-credit-cards-canada">
            student credit card guide
          </Link>{" "}
          explains the main trade-offs.
        </p>

        <div className="seo-tip">
          <div className="seo-tip-label">ClearFin tip</div>
          <p>
            Compare the card you are considering with one realistic no-fee
            alternative. If the paid card does not earn back its annual fee in
            your normal spending, the simpler card leaves you ahead.
          </p>
        </div>

        <h2>Frequently asked questions</h2>
        <div className="seo-faq">
          {faqData.map((item) => (
            <div className="seo-faq-item" key={item.q}>
              <div className="seo-faq-q">{item.q}</div>
              <div className="seo-faq-a">{item.a}</div>
            </div>
          ))}
        </div>

        <h2>Issuer sources checked</h2>
        <p>
          Product terms and promotions can change. We checked the following
          issuer pages on August 2, 2026:
        </p>
        <ul>
          <li>
            <a
              href="https://www.americanexpress.com/ca/en/benefits/cobalt-card/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              American Express Cobalt Card
            </a>
          </li>
          <li>
            <a
              href="https://www.scotiabank.com/ca/en/personal/credit-cards/rewards.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scotiabank rewards credit cards
            </a>
          </li>
          <li>
            <a
              href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              TD Aeroplan Visa Infinite
            </a>
          </li>
          <li>
            <a
              href="https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-infinite-card.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              CIBC Dividend Visa Infinite
            </a>
          </li>
          <li>
            <a
              href="https://www.tangerine.ca/en/personal/spend/credit-cards/money-back-credit-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tangerine Money-Back Credit Card
            </a>
          </li>
        </ul>

        <div className="seo-related">
          <h3>Related tools and guides</h3>
          <div className="seo-related-grid">
            <Link
              href="/credit-card-calculator-canada"
              className="seo-related-link"
            >
              Credit Card Calculator
              <span>Compare cards using the spending categories you enter.</span>
            </Link>
            <Link
              href="/compare-credit-cards-canada"
              className="seo-related-link"
            >
              Compare Two Cards
              <span>Review estimated annual value side by side.</span>
            </Link>
            <Link
              href="/credit-card-rewards-canada-guide"
              className="seo-related-link"
            >
              Rewards Guide
              <span>Understand cash back, points and redemption value.</span>
            </Link>
            <Link href="/credit-cards" className="seo-related-link">
              Browse All Cards
              <span>Open the full Canadian card catalogue.</span>
            </Link>
          </div>
        </div>
      </SeoLayout>
    </>
  );
}

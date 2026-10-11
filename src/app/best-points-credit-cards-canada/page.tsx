import Link from "next/link";
import type { Metadata } from "next";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import SeoCardActions from "@/components/SeoCardActions";
import SeoCardImage from "@/components/SeoCardImage";
import SeoLayout from "@/components/SeoLayout";

export const revalidate = 300;

const pageUrl = "https://www.clearfin.ca/best-points-credit-cards-canada";
const pageTitle = "Best Points Credit Cards in Canada for 2026";
const pageDescription =
  "Compare Canadian points credit cards for groceries, dining and travel. See earn rates, annual fees, reward programs and the trade-offs that matter.";

export const metadata: Metadata = {
  title: "Best Points Credit Cards in Canada 2026 | ClearFin",
  description: pageDescription,
  keywords: [
    "best points credit card Canada",
    "best credit card for points Canada",
    "points credit cards Canada",
    "credit card rewards points Canada",
    "best rewards points credit card Canada",
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
    label: "Flexible points for food-heavy spending",
    detail:
      "Earn 5 Membership Rewards points per $1 on eligible eats and drinks in Canada, up to $2,500 in purchases per month, 3 points on eligible streaming, 2 on eligible gas and transit, and 1 on other eligible purchases. The fee is $15.99 per month, or $191.88 annually.",
    take:
      "Cobalt is worth a close look when dining and grocery spending make up a large part of your budget and the merchants you use accept American Express. The food-category cap and your preferred redemption method both affect the real value.",
  },
  {
    name: "Scotiabank Gold American Express",
    label: "High Scene+ earn rates in everyday categories",
    detail:
      "Earn 6 Scene+ points per $1 CAD at participating Sobeys-family grocers in Canada, 5 points on eligible dining, food delivery, entertainment and other eligible groceries, 3 points on eligible gas, transit and select streaming, and 1 point on other eligible purchases. The annual fee is $120.",
    take:
      "The strongest earn rates are merchant- and category-specific. This card is most interesting when your normal stores fit those categories and American Express acceptance works for your routine.",
  },
  {
    name: "TD Aeroplan Visa Infinite",
    label: "Aeroplan points for regular Air Canada users",
    detail:
      "Earn 1.5 Aeroplan points per $1 on eligible gas, EV charging, grocery and purchases made directly with Air Canada, plus 1 point per $1 on other eligible purchases. The current annual fee is $139.",
    take:
      "Aeroplan points can be useful when you already travel with Air Canada or understand how you want to redeem them. The card should still make sense after the annual fee once any first-year promotion is gone.",
  },
  {
    name: "BMO Eclipse Visa Infinite",
    label: "BMO Rewards across several daily categories",
    detail:
      "Earn 5 BMO Rewards points per $1 on eligible groceries, dining, gas and transit, up to the program's applicable category limits, and 1 point per $1 on other purchases. The annual fee is $120, with the current first-year offer subject to BMO terms.",
    take:
      "The broad 5-points categories make the card easy to notice, but points per dollar are not the same thing as cash back. Check the BMO Rewards redemption you would realistically use before comparing it with another program.",
  },
  {
    name: "RBC Avion Visa Infinite",
    label: "Avion points with flexible travel redemptions",
    detail:
      "Earn 1 Avion point per $1 on purchases, with 25% more points on eligible travel-related purchases, for an effective 1.25 points per $1 in that category. The annual fee is $120.",
    take:
      "Avion can appeal to travellers who value a flexible rewards program rather than one airline-specific currency. Compare the redemption you expect to use, not just the number of points earned.",
  },
];

const faqData = [
  {
    q: "What is the best points credit card in Canada?",
    a: "There is no single points card that wins for every household. A useful choice depends on where you spend, the annual fee, merchant acceptance and how you plan to redeem the points. Compare the value of the rewards you would actually use rather than the largest advertised points multiplier.",
  },
  {
    q: "Are 5 points per dollar always better than 2 points per dollar?",
    a: "No. Different reward programs assign different value to a point, and redemption value can vary within the same program. Five points in one program can be worth less than two points in another depending on how you redeem them.",
  },
  {
    q: "Should I choose a points card for the welcome offer?",
    a: "A welcome offer can improve first-year value, but it changes more often than the card's regular earn structure. Check the current issuer terms when applying and make sure the ongoing card still fits your spending after the promotion ends.",
  },
  {
    q: "Should I use a points card or a cash back card?",
    a: "Cash back is usually easier to value because the reward is stated in dollars. Points can be more useful when you understand the program and have a redemption that gives you enough value to justify the extra complexity or annual fee.",
  },
];

export default function BestPointsCreditCardsCanadaPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: pageTitle,
    description: pageDescription,
    author: { "@id": "https://www.clearfin.ca/#organization" },
    publisher: { "@id": "https://www.clearfin.ca/#organization" },
    articleSection: "Credit Card Guides",
    datePublished: "2026-10-11",
    dateModified: "2026-10-11",
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
        subtitle="Points cards are useful only when the earn categories match your spending and the rewards program matches how you actually redeem. These five are practical starting points for different types of Canadian spenders."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Credit Cards", href: "/credit-cards" },
          { label: "Best Points Cards", href: "/best-points-credit-cards-canada" },
        ]}
        lastUpdated="October 11, 2026"
      >
        <h2>The short answer</h2>
        <p>
          The best points credit card is not necessarily the one with the biggest
          points number. A 5X category can look stronger than a 2X category, but
          those points can belong to completely different programs with different
          redemption values. Start with your normal monthly spending, then ask what
          one point is realistically worth to you in the program you would use.
        </p>
        <p>
          The five cards below cover several common approaches: flexible points,
          Scene+, Aeroplan, BMO Rewards and Avion. We use their regular earn rates
          and annual fees as the foundation rather than ranking them by temporary
          welcome bonuses. Issuer terms were checked on October 11, 2026 and can
          change, so confirm the current application page before applying.
        </p>

        <div className="seo-card-grid">
          {cards.map((card) => (
            <div className="seo-card-box" key={card.name}>
              <SeoCardImage name={card.name} />
              <h3>{card.name}</h3>
              <p><strong>{card.label}</strong></p>
              <p>{card.detail}</p>
              <p>{card.take}</p>
              <SeoCardActions name={card.name} />
            </div>
          ))}
        </div>

        <AffiliateDisclosure />

        <h2>Points cards side by side</h2>
        <div className="seo-table-wrap">
          <table className="seo-table">
            <thead>
              <tr>
                <th>Card</th>
                <th>Program</th>
                <th>Annual fee</th>
                <th>Where it stands out</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>American Express Cobalt</td>
                <td>Membership Rewards</td>
                <td>$191.88/year</td>
                <td>Eligible Canadian eats and drinks</td>
              </tr>
              <tr>
                <td>Scotiabank Gold American Express</td>
                <td>Scene+</td>
                <td>$120/year</td>
                <td>Participating groceries, dining and entertainment</td>
              </tr>
              <tr>
                <td>TD Aeroplan Visa Infinite</td>
                <td>Aeroplan</td>
                <td>$139/year</td>
                <td>Gas, groceries and direct Air Canada purchases</td>
              </tr>
              <tr>
                <td>BMO eclipse Visa Infinite</td>
                <td>BMO Rewards</td>
                <td>$120/year</td>
                <td>Groceries, dining, gas and transit</td>
              </tr>
              <tr>
                <td>RBC Avion Visa Infinite</td>
                <td>Avion Rewards</td>
                <td>$120/year</td>
                <td>Flexible travel rewards and eligible travel earn</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Points per dollar is not the same as return on spending</h2>
        <p>
          This is the most important distinction when comparing points cards.
          Issuers choose their own point currency. One Membership Rewards point,
          Scene+ point, Aeroplan point, BMO Rewards point and Avion point should
          not be treated as if they are interchangeable. The value can also change
          depending on whether you redeem for travel, statement credits, merchandise
          or another option.
        </p>
        <p>
          That is why ClearFin&apos;s calculator converts reward structures into an
          estimated annual value instead of sorting cards by the largest multiplier.
          Use the{" "}
          <Link href="/credit-card-calculator-canada">credit card rewards calculator</Link>{" "}
          with your spending, then open the{" "}
          <Link href="/compare-credit-cards-canada">side-by-side comparison tool</Link>{" "}
          when you have narrowed the choice to two cards.
        </p>

        <h2>Watch category limits and merchant coding</h2>
        <p>
          An accelerated rate usually applies only when a purchase is coded into an
          eligible merchant category, and some cards place monthly or annual limits
          on accelerated earning. For example, Cobalt&apos;s 5X eats-and-drinks earn
          rate has a monthly spending cap, while BMO states an annual limit across
          its 5X categories. A store selling groceries does not automatically mean
          every card network will classify the transaction as grocery.
        </p>
        <p>
          Before changing where you shop just to chase points, check how your normal
          merchants code and whether the card is accepted there. A slightly lower
          earn rate that works on most of your real spending can beat a headline
          multiplier you rarely receive.
        </p>

        <h2>Annual fees can change the winner</h2>
        <p>
          Calculate the rewards you expect to earn over a normal year, subtract the
          ongoing annual fee, and then add only the benefits you would genuinely pay
          for yourself. Airport perks, insurance and statement credits can be useful,
          but giving every perk its advertised retail value can make a card appear
          better than it is for your situation.
        </p>
        <p>
          First-year fee waivers and welcome bonuses are useful when you qualify, but
          they should not hide the second-year economics. If you want a simpler card
          with no yearly cost, compare the options in our{" "}
          <Link href="/best-no-fee-credit-cards-canada">no-annual-fee credit card guide</Link>.
        </p>

        <h2>Points card or travel card?</h2>
        <p>
          The categories overlap, but the intent is different. Some points cards are
          built mainly around everyday spending while travel cards may put more value
          into airline benefits, lounge access, insurance or foreign-currency features.
          If your main goal is travel rather than points accumulation itself, read our{" "}
          <Link href="/best-travel-credit-cards-canada">best travel credit cards in Canada</Link>{" "}
          before deciding.
        </p>

        <div className="seo-tip">
          <div className="seo-tip-label">ClearFin tip</div>
          <p>
            Run the same monthly budget through two cards and compare the estimated
            value after fees. If one card earns more points but produces less usable
            value for you, the bigger multiplier is just a bigger number.
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
          We checked current issuer pages on October 11, 2026. Reward rates,
          fees, category definitions, caps and promotions can change.
        </p>
        <ul>
          <li>
            <a href="https://www.americanexpress.com/en-ca/credit-cards/cobalt-card/" target="_blank" rel="noopener noreferrer">
              American Express Cobalt Card
            </a>
          </li>
          <li>
            <a href="https://www.scotiabank.com/ca/en/personal/credit-cards/american-express/gold-card.html" target="_blank" rel="noopener noreferrer">
              Scotiabank Gold American Express
            </a>
          </li>
          <li>
            <a href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card" target="_blank" rel="noopener noreferrer">
              TD Aeroplan Visa Infinite
            </a>
          </li>
          <li>
            <a href="https://www.bmo.com/main/personal/credit-cards/bmo-eclipse-visa-infinite/" target="_blank" rel="noopener noreferrer">
              BMO eclipse Visa Infinite
            </a>
          </li>
          <li>
            <a href="https://www.rbcroyalbank.com/credit-cards/travel/rbc-avion-visa-infinite.html" target="_blank" rel="noopener noreferrer">
              RBC Avion Visa Infinite
            </a>
          </li>
        </ul>

        <div className="seo-related">
          <h3>Keep comparing</h3>
          <div className="seo-related-grid">
            <Link href="/credit-card-calculator-canada" className="seo-related-link">
              Rewards Calculator
              <span>Estimate card value using your monthly spending.</span>
            </Link>
            <Link href="/compare-credit-cards-canada" className="seo-related-link">
              Compare Two Cards
              <span>Put fees and category earnings side by side.</span>
            </Link>
            <Link href="/credit-card-rewards-canada-guide" className="seo-related-link">
              Rewards Guide
              <span>Understand points, cash back and redemption value.</span>
            </Link>
            <Link href="/best-credit-cards-canada" className="seo-related-link">
              Best Credit Cards
              <span>See practical options across several card types.</span>
            </Link>
          </div>
        </div>
      </SeoLayout>
    </>
  );
}

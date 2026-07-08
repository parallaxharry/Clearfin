import SeoLayout from "@/components/SeoLayout";
import SeoCardImage from "@/components/SeoCardImage";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Credit Card for Groceries, Walmart & Shoppers Drug Mart | ClearFin",
  description:
    "A 2026 Canadian guide to the highest earning grocery credit cards, comparing Scotia Gold Amex, Cobalt, CIBC Dividend, BMO Eclipse, and PC World Elite.",
  keywords: [
    "best credit card for groceries Canada",
    "best grocery rewards credit card Canada",
    "best grocery credit cards Canada",
    "highest grocery rewards card Canada",
    "best credit card for Walmart Canada",
    "best credit card for Shoppers Drug Mart",
  ],
  alternates: {
    canonical: "/best-grocery-credit-cards-canada",
  },
};

export default function BestGroceryCreditCardsCanada() {
  return (
    <SeoLayout
      title="Best Credit Cards for Groceries in Canada"
      subtitle="The average Canadian household spends $12,667 on groceries per year. With the right card, that's over $600 in annual rewards — or $50 off your bill every month."
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Credit Cards", href: "/#tool" },
        { label: "Best for Groceries", href: "/best-grocery-credit-cards-canada" },
      ]}
      lastUpdated="May 2026"
    >
      {/* ── Top 5 Grocery Cards ── */}
      <h2>Top 5 Credit Cards for Groceries in Canada (2026)</h2>
      <p>
        We ranked these cards based on grocery earn rate, annual fee, and overall
        value for a household spending roughly $1,000 per month on groceries.
        Every card on this list has been verified for its current rewards
        structure as of May 2026.
      </p>

      <div className="seo-card-grid">
        {/* Card 1 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#1</div>
          <SeoCardImage name="Scotiabank Gold American Express" />
          <div className="seo-card-box-name">Scotiabank Gold American Express</div>
          <div className="seo-card-box-issuer">Scotiabank</div>
          <div className="seo-card-box-detail">
            6x Scene+ points per dollar on groceries. $120 annual fee.
            Welcome bonus worth up to $350 in the first year.
          </div>
          <div className="seo-card-box-highlight">
            Highest grocery multiplier of any Canadian credit card
          </div>
        </div>

        {/* Card 2 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#2</div>
          <SeoCardImage name="American Express Cobalt Card" />
          <div className="seo-card-box-name">American Express Cobalt Card</div>
          <div className="seo-card-box-issuer">American Express</div>
          <div className="seo-card-box-detail">
            5x Membership Rewards points per dollar on groceries and dining.
            $13.05/month ($156.60/yr). Flexible point transfers to Aeroplan and
            other partners.
          </div>
          <div className="seo-card-box-highlight">
            Best all-around card for food spending (groceries + restaurants)
          </div>
        </div>

        {/* Card 3 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#3</div>
          <SeoCardImage name="CIBC Dividend Visa Infinite" />
          <div className="seo-card-box-name">CIBC Dividend Visa Infinite</div>
          <div className="seo-card-box-issuer">CIBC</div>
          <div className="seo-card-box-detail">
            4% cash back on groceries. $99 annual fee. 2% on gas, transit,
            and Tim Hortons. Simple cashback — no points to manage.
          </div>
          <div className="seo-card-box-highlight">
            Best pure cashback option for groceries
          </div>
        </div>

        {/* Card 4 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#4</div>
          <SeoCardImage name="BMO Eclipse Visa Infinite" />
          <div className="seo-card-box-name">BMO Eclipse Visa Infinite</div>
          <div className="seo-card-box-issuer">BMO</div>
          <div className="seo-card-box-detail">
            5x BMO Rewards points per dollar on groceries. $150 annual fee.
            Points can be redeemed for travel at 0.7 cents each.
          </div>
          <div className="seo-card-box-highlight">
            Strong for BMO customers who consolidate banking and credit
          </div>
        </div>

        {/* Card 5 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#5</div>
          <SeoCardImage name="PC Financial World Elite Mastercard" />
          <div className="seo-card-box-name">PC Financial World Elite Mastercard</div>
          <div className="seo-card-box-issuer">President&apos;s Choice Financial</div>
          <div className="seo-card-box-detail">
            30 PC Optimum points per dollar at Loblaws, Shoppers Drug Mart,
            and Esso. No annual fee. Redeemable for free groceries.
          </div>
          <div className="seo-card-box-highlight">
            Best no-fee grocery card if you shop at Loblaws banner stores
          </div>
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <h2>Grocery Credit Card Comparison</h2>
      <p>
        Here is how these five cards stack up side by side when you spend
        $12,000 per year on groceries.
      </p>

      <div className="seo-table-wrap">
        <table className="seo-table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Annual Fee</th>
              <th>Grocery Rate</th>
              <th>Annual Return on $12K</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Scotia Gold Amex</td>
              <td>$120</td>
              <td>6x Scene+</td>
              <td>~$600</td>
              <td>Maximum grocery rewards</td>
            </tr>
            <tr>
              <td>Amex Cobalt</td>
              <td>$156.60</td>
              <td>5x MR</td>
              <td>~$500</td>
              <td>Groceries + dining combined</td>
            </tr>
            <tr>
              <td>CIBC Dividend Visa Infinite</td>
              <td>$99</td>
              <td>4% cashback</td>
              <td>$480</td>
              <td>Simple cashback, no points hassle</td>
            </tr>
            <tr>
              <td>BMO Eclipse Visa Infinite</td>
              <td>$150</td>
              <td>5x BMO Rewards</td>
              <td>~$420</td>
              <td>BMO banking customers</td>
            </tr>
            <tr>
              <td>PC World Elite MC</td>
              <td>$0</td>
              <td>30 pts/$1 at Loblaws</td>
              <td>~$360*</td>
              <td>Loblaws shoppers who want no fee</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        *PC Optimum points value varies. Estimated at 1 cent per point
        redeemed during bonus redemption events; standard redemption yields
        closer to 0.7 cents per point.
      </p>

      {/* ── Merchant Category Codes ── */}
      <h2>Which Stores Count as &ldquo;Grocery&rdquo;?</h2>
      <p>
        This is the single biggest surprise for most cardholders. Credit card
        grocery rewards are triggered by the merchant category code (MCC) a
        store is assigned, not by what you actually buy. A dedicated grocery
        store like Loblaws, Metro, or Sobeys will almost always code as MCC
        5411 (Grocery Stores, Supermarkets). But big-box retailers are
        different.
      </p>
      <p>
        Walmart typically codes as MCC 5311 (Department Stores), which means
        your grocery purchases there will not earn the elevated grocery rate on
        most cards. The same applies to Costco — it usually codes as MCC 5300
        (Wholesale Clubs). Even Shoppers Drug Mart codes as a pharmacy (MCC
        5912), not a grocery store, despite selling food.
      </p>
      <p>
        If maximizing grocery rewards matters to you, shop at stores that code
        as grocery: Loblaws, No Frills, Real Canadian Superstore, Metro,
        Sobeys, Safeway, FreshCo, Food Basics, and most independent grocers.
      </p>

      {/* ── Amex Acceptance ── */}
      <h2>Amex Acceptance at Canadian Grocery Stores</h2>
      <p>
        Two of our top five picks are American Express cards, so acceptance
        matters. The good news: Amex acceptance at Canadian grocery chains has
        improved significantly. Loblaws banner stores (Loblaws, No Frills,
        Real Canadian Superstore, Valu-mart, Zehrs, Your Independent Grocer)
        all accept Amex. So do Sobeys, Safeway, FreshCo, Farm Boy, and
        Whole Foods.
      </p>
      <p>
        Metro and Food Basics do not accept American Express. Neither do some
        smaller independent grocers or discount stores. If your primary grocery
        store does not take Amex, the CIBC Dividend Visa Infinite or the PC
        World Elite Mastercard will be a better pick.
      </p>
      <p>
        A practical strategy: carry an Amex as your primary grocery card and
        keep a Visa or Mastercard as a backup for the stores that don&apos;t
        accept it.
      </p>

      {/* ── Stacking Strategies ── */}
      <h2>Stacking Strategies: Loyalty Programs + Credit Card Rewards</h2>
      <p>
        You can earn rewards twice on the same purchase by combining a credit
        card with a store loyalty program. These are not mutually exclusive —
        you scan your loyalty card and pay with your credit card.
      </p>
      <h3>PC Optimum + Credit Card</h3>
      <p>
        Scan your PC Optimum card at any Loblaws banner store, then pay with
        the Scotia Gold Amex. You earn both your PC Optimum points (from
        personalized offers and base points) and 6x Scene+ points on the
        credit card. Over a year of $12,000 in grocery spending, this can yield
        over $800 in combined rewards.
      </p>
      <h3>Scene+ at Sobeys + Credit Card</h3>
      <p>
        Sobeys and FreshCo participate in Scene+. You can scan your Scene+
        card at checkout and pay with any credit card. If you pay with the
        Scotia Gold Amex, you double-dip on Scene+ — earning points from both
        the loyalty program and the credit card.
      </p>
      <h3>Flipp and Digital Coupons</h3>
      <p>
        Before shopping, check Flipp or your grocery store&apos;s app for
        digital coupons. Load them to your loyalty card. The savings stack on
        top of both your loyalty points and your credit card rewards, creating
        three layers of value on a single trip.
      </p>

      {/* ── ClearFin Tip ── */}
      <div className="seo-tip">
        <div className="seo-tip-label">ClearFin Tip</div>
        <p>
          Not sure how your grocery store codes? Check your credit card
          statement after a purchase — if the elevated grocery rate applied,
          you will see the bonus points or cashback. If it coded as
          &ldquo;department store&rdquo; or &ldquo;wholesale club,&rdquo; you
          earned the base rate instead. ClearFin&apos;s calculator can match
          your actual spending categories to the card that earns you the most.
        </p>
      </div>

      {/* ── FAQ ── */}
      <h2>Frequently Asked Questions</h2>
      <div className="seo-faq">
        <div className="seo-faq-item">
          <div className="seo-faq-q">Does Costco count as grocery for credit card rewards?</div>
          <div className="seo-faq-a">
            No. Costco typically uses MCC 5300 (Wholesale Clubs), which most
            credit cards do not classify as grocery. Your purchases there will
            earn the base rate, not the grocery bonus. Additionally, Costco
            Canada only accepts Mastercard, so Amex cards cannot be used there
            at all.
          </div>
        </div>

        <div className="seo-faq-item">
          <div className="seo-faq-q">Does Walmart count as grocery?</div>
          <div className="seo-faq-a">
            Generally no. Walmart Canada stores code as MCC 5311 (Department
            Stores), so grocery purchases at Walmart earn the base rate on
            most credit cards. Walmart Supercentres do not have a separate
            grocery MCC — the entire store uses one code.
          </div>
        </div>

        <div className="seo-faq-item">
          <div className="seo-faq-q">What is the best no-fee credit card for groceries?</div>
          <div className="seo-faq-a">
            The PC Financial World Elite Mastercard is the best no-fee option
            for Loblaws shoppers, earning 30 PC Optimum points per dollar.
            If you shop at a variety of grocery stores, the Tangerine
            Money-Back Card with groceries as one of your 2% categories is
            a strong alternative.
          </div>
        </div>

        <div className="seo-faq-item">
          <div className="seo-faq-q">
            Can I earn grocery rewards on Instacart or grocery delivery?
          </div>
          <div className="seo-faq-a">
            It depends on how the delivery service processes the charge.
            Instacart itself codes as MCC 5411 (Grocery) in most cases, so
            you may earn grocery rewards. However, some smaller delivery
            services may code differently. Check your statement to confirm.
          </div>
        </div>
      </div>

      {/* ── Related Guides ── */}
      <div className="seo-related">
        <h3>Related Guides</h3>
        <div className="seo-related-grid">
          <Link
            href="/best-no-fee-credit-cards-canada"
            className="seo-related-link"
          >
            Best No-Fee Credit Cards in Canada
            <span>Great rewards without paying an annual fee</span>
          </Link>
          <Link
            href="/best-cashback-credit-cards-canada"
            className="seo-related-link"
          >
            Best Cashback Credit Cards in Canada
            <span>Straightforward cash back on every purchase</span>
          </Link>
          <Link
            href="/best-travel-credit-cards-canada"
            className="seo-related-link"
          >
            Best Travel Credit Cards in Canada
            <span>Turn everyday spending into flights and hotels</span>
          </Link>
        </div>
      </div>
    </SeoLayout>
  );
}

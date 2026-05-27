import SeoLayout from "@/components/SeoLayout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Travel Credit Cards in Canada 2026 | ClearFin",
  description:
    "Compare top travel rewards credit cards in Canada. Earn Aeroplan, Avion, and Scene+ points. Expert picks for frequent flyers and occasional travellers.",
  keywords: [
    "best travel credit cards Canada",
    "travel rewards cards Canada",
    "Aeroplan credit cards",
  ],
  alternates: {
    canonical: "/best-travel-credit-cards-canada",
  },
};

export default function BestTravelCreditCardsCanada() {
  return (
    <SeoLayout
      title="Best Travel Credit Cards in Canada for 2026"
      subtitle="Whether you fly weekly or take one big trip a year, the right travel card can save you hundreds. Here are Canada's best travel rewards cards ranked by real redemption value."
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Credit Cards", href: "/#tool" },
        { label: "Best Travel", href: "/best-travel-credit-cards-canada" },
      ]}
      lastUpdated="May 2026"
    >
      {/* ── Top 5 Travel Cards ── */}
      <h2>Top 5 Travel Credit Cards in Canada</h2>
      <p>
        We evaluated these cards on earn rate, redemption value, travel perks
        (lounge access, insurance, no foreign transaction fees), and annual fee
        relative to the rewards delivered. Rankings reflect value for a
        Canadian spending roughly $3,000/month across typical categories.
      </p>

      <div className="seo-card-grid">
        {/* Card 1 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#1</div>
          <div className="seo-card-box-name">TD Aeroplan Visa Infinite</div>
          <div className="seo-card-box-issuer">TD Bank</div>
          <div className="seo-card-box-detail">
            1.5x Aeroplan points on gas, grocery &amp; Air Canada &bull; 1x on
            everything else &bull; $139/year &bull; First checked bag free on
            Air Canada
          </div>
          <div className="seo-card-box-highlight">
            Best Aeroplan earner for everyday spending — the free checked bag
            alone saves $70+ per round trip
          </div>
        </div>

        {/* Card 2 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#2</div>
          <div className="seo-card-box-name">
            American Express Cobalt Card
          </div>
          <div className="seo-card-box-issuer">American Express</div>
          <div className="seo-card-box-detail">
            5x points on dining &amp; groceries &bull; 3x on streaming &bull;
            2x on transit &amp; gas &bull; 1x on everything else &bull;
            $156.60/year ($13.05/month)
          </div>
          <div className="seo-card-box-highlight">
            Best flexible travel card — points transfer 1:1 to Aeroplan,
            Marriott, Hilton, and British Airways for outsized value
          </div>
        </div>

        {/* Card 3 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#3</div>
          <div className="seo-card-box-name">RBC Avion Visa Infinite</div>
          <div className="seo-card-box-issuer">RBC</div>
          <div className="seo-card-box-detail">
            1x Avion point per $1 everywhere &bull; Transfer to 15+ airline
            partners &bull; $120/year &bull; Includes travel and medical
            insurance
          </div>
          <div className="seo-card-box-highlight">
            Most flexible redemption — transfer to British Airways, WestJet,
            Cathay Pacific, or book any travel through Avion portal
          </div>
        </div>

        {/* Card 4 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#4</div>
          <div className="seo-card-box-name">
            Scotiabank Passport Visa Infinite
          </div>
          <div className="seo-card-box-issuer">Scotiabank</div>
          <div className="seo-card-box-detail">
            3x Scene+ points on dining, entertainment &amp; transit &bull; 2x
            on grocery &amp; recurring &bull; 1x on everything else &bull;
            $150/year &bull; No foreign transaction fees
          </div>
          <div className="seo-card-box-highlight">
            Best no-FX-fee card in Canada — saves 2.5% on every purchase
            abroad, which adds up fast on international trips
          </div>
        </div>

        {/* Card 5 */}
        <div className="seo-card-box">
          <div className="seo-card-box-rank">#5</div>
          <div className="seo-card-box-name">CIBC Aventura Visa Infinite</div>
          <div className="seo-card-box-issuer">CIBC</div>
          <div className="seo-card-box-detail">
            2x Aventura points on gas, grocery, drug stores &bull; 1x on
            everything else &bull; $139/year &bull; Includes NEXUS application
            fee rebate
          </div>
          <div className="seo-card-box-highlight">
            Best for occasional travellers — flexible Aventura portal lets you
            book any flight with no blackout dates
          </div>
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <h2>Travel Card Comparison</h2>
      <p>
        The details that matter most when choosing a travel card, all in one
        place. Foreign transaction fees and lounge access can swing the value
        by hundreds of dollars for frequent international travellers.
      </p>

      <div className="seo-table-wrap">
        <table className="seo-table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Fee</th>
              <th>Earn Rate</th>
              <th>FX Fee</th>
              <th>Lounge Access</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TD Aeroplan Visa Infinite</td>
              <td>$139/yr</td>
              <td>1.5x grocery/gas, 1x other</td>
              <td>2.5%</td>
              <td>Maple Leaf (with pass)</td>
              <td>Aeroplan collectors</td>
            </tr>
            <tr>
              <td>Amex Cobalt</td>
              <td>$156.60/yr</td>
              <td>5x dining/grocery, 2x transit</td>
              <td>2.5%</td>
              <td>None included</td>
              <td>Foodies &amp; flexible travellers</td>
            </tr>
            <tr>
              <td>RBC Avion Visa Infinite</td>
              <td>$120/yr</td>
              <td>1x everywhere</td>
              <td>2.5%</td>
              <td>None included</td>
              <td>Multi-airline flexibility</td>
            </tr>
            <tr>
              <td>Scotia Passport Visa Infinite</td>
              <td>$150/yr</td>
              <td>3x dining/transit, 2x grocery</td>
              <td>0%</td>
              <td>6 Priority Pass visits</td>
              <td>International travellers</td>
            </tr>
            <tr>
              <td>CIBC Aventura Visa Infinite</td>
              <td>$139/yr</td>
              <td>2x grocery/gas, 1x other</td>
              <td>2.5%</td>
              <td>Maple Leaf (via Aventura)</td>
              <td>Occasional travellers</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Points Programs Overview ── */}
      <h2>Points Programs: Aeroplan vs. Avion vs. Scene+</h2>
      <p>
        Not all travel points are created equal. The value you get depends on
        how you redeem them and which program you are using.
      </p>

      <h3>Aeroplan (Air Canada / TD)</h3>
      <p>
        Aeroplan is Canada&apos;s largest loyalty program with access to Star
        Alliance&apos;s 26 member airlines. Points are worth roughly 1.5 to 2.5
        cents each when redeemed for flights, making it the highest-value
        program for frequent flyers. Dynamic pricing means availability
        varies, but the sweet spots — like 25,000 points for a short-haul
        flight — deliver exceptional value.
      </p>

      <h3>Avion (RBC)</h3>
      <p>
        Avion points transfer to 15+ airline programs including British
        Airways, WestJet, Cathay Pacific, and American Airlines. The
        flexibility to move points to whichever program has the best
        availability makes Avion strong for travellers who don&apos;t fly one
        airline exclusively. Points are worth approximately 1.2 to 2.0 cents
        each depending on the redemption route.
      </p>

      <h3>Scene+ (Scotiabank)</h3>
      <p>
        Scene+ points can be redeemed through the Scotia Rewards travel portal
        at roughly 1.0 to 1.5 cents per point. While the per-point value is
        lower than Aeroplan, the no-FX-fee benefit on the Passport card and
        the ability to redeem for any travel booking (not just specific
        airlines) makes Scene+ practical for occasional travellers who want
        straightforward redemptions.
      </p>

      {/* ── Foreign Transaction Fees ── */}
      <h2>Foreign Transaction Fees: The Hidden Travel Cost</h2>
      <p>
        Most Canadian credit cards charge a 2.5% foreign transaction (FX) fee
        on purchases made in a non-Canadian currency. This applies to
        everything — hotel bookings, restaurant meals, Uber rides, and online
        purchases from international retailers.
      </p>
      <p>
        For a two-week international trip where you spend $4,000 CAD
        equivalent, that 2.5% fee adds $100 in hidden costs. Over a year of
        international spending, FX fees can easily exceed what you earn in
        rewards.
      </p>
      <p>
        The Scotiabank Passport Visa Infinite is one of the few premium travel
        cards in Canada that charges no foreign transaction fee at all. If you
        travel internationally more than once a year or regularly buy from
        US-based online retailers, the FX savings alone can justify the $150
        annual fee.
      </p>

      {/* ── Travel Insurance Comparison ── */}
      <h2>Travel Insurance Coverage</h2>
      <p>
        Premium travel credit cards include insurance that can replace or
        supplement standalone travel insurance policies. Here is what the top
        cards offer.
      </p>

      <div className="seo-table-wrap">
        <table className="seo-table">
          <thead>
            <tr>
              <th>Coverage</th>
              <th>TD Aeroplan VI</th>
              <th>Amex Cobalt</th>
              <th>RBC Avion VI</th>
              <th>Scotia Passport VI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trip Cancellation</td>
              <td>$1,500</td>
              <td>$1,000</td>
              <td>$2,500</td>
              <td>$2,000</td>
            </tr>
            <tr>
              <td>Trip Interruption</td>
              <td>$3,000</td>
              <td>$2,000</td>
              <td>$5,000</td>
              <td>$5,000</td>
            </tr>
            <tr>
              <td>Emergency Medical</td>
              <td>$500,000 (15 days)</td>
              <td>Not included</td>
              <td>$5M (15 days)</td>
              <td>$2M (21 days)</td>
            </tr>
            <tr>
              <td>Lost/Delayed Baggage</td>
              <td>$1,000</td>
              <td>$500</td>
              <td>$1,000</td>
              <td>$1,000</td>
            </tr>
            <tr>
              <td>Flight Delay</td>
              <td>$500 (4+ hrs)</td>
              <td>Not included</td>
              <td>$500 (4+ hrs)</td>
              <td>$500 (4+ hrs)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The RBC Avion Visa Infinite stands out for emergency medical coverage
        at $5 million — far above most competitors. The Scotiabank Passport
        offers the longest trip coverage window at 21 days, making it better
        for extended vacations. The Amex Cobalt is weaker on insurance but
        compensates with its market-leading earn rate on dining and groceries.
      </p>

      {/* ── ClearFin Tip ── */}
      <div className="seo-tip">
        <div className="seo-tip-label">ClearFin Tip</div>
        <p>
          Travel cards look great on paper, but the real value depends on how
          you actually spend. A card earning 5x on dining is only valuable if
          you spend significantly on restaurants. Use the ClearFin calculator
          to input your real monthly spending and see which travel card
          delivers the highest annual value after fees — you might be
          surprised which card comes out on top for your spending pattern.
        </p>
      </div>

      {/* ── FAQ ── */}
      <h2>Frequently Asked Questions</h2>

      <div className="seo-faq">
        <div className="seo-faq-item">
          <div className="seo-faq-q">
            What is the best travel credit card in Canada for 2026?
          </div>
          <div className="seo-faq-a">
            For most Canadians, the Amex Cobalt offers the best overall value
            thanks to its 5x earn rate on dining and groceries and 1:1 transfer
            to Aeroplan. However, the TD Aeroplan Visa Infinite is better if
            you fly Air Canada frequently, and the Scotia Passport wins for
            international travellers who want to avoid foreign transaction fees.
          </div>
        </div>

        <div className="seo-faq-item">
          <div className="seo-faq-q">
            Are travel rewards worth more than cashback?
          </div>
          <div className="seo-faq-a">
            They can be. Aeroplan points redeemed for flights are typically
            worth 1.8 to 2.5 cents each, while cashback is always worth
            exactly 1 cent per cent. A card earning 5x points on dining is
            effectively returning 9%–12% back when those points are redeemed
            for flights. The catch is that if you redeem points for gift cards
            or merchandise, their value drops below cashback.
          </div>
        </div>

        <div className="seo-faq-item">
          <div className="seo-faq-q">
            Which Canadian credit card has no foreign transaction fees?
          </div>
          <div className="seo-faq-a">
            The Scotiabank Passport Visa Infinite is the most popular no-FX-fee
            travel card in Canada, charging 0% on foreign currency purchases.
            The Brim Financial Mastercard and HSBC World Elite Mastercard also
            offer no FX fees, though with different rewards structures. Most
            major bank cards charge 2.5%.
          </div>
        </div>

        <div className="seo-faq-item">
          <div className="seo-faq-q">
            Is it worth paying $150+ for a travel credit card?
          </div>
          <div className="seo-faq-a">
            For households spending $3,000+/month, premium travel cards
            typically return $500–$1,200 per year in rewards value. Even after
            subtracting a $150 annual fee, you come out well ahead of no-fee
            alternatives. The included travel insurance (worth $50–$150 per
            trip) and lounge access add even more value for frequent
            travellers. If you take fewer than two trips per year and spend
            under $2,000/month, a no-fee cashback card may be a better fit.
          </div>
        </div>
      </div>

      {/* ── Related Guides ── */}
      <div className="seo-related">
        <h3>Related Guides</h3>
        <div className="seo-related-grid">
          <Link
            href="/best-cashback-credit-cards-canada"
            className="seo-related-link"
          >
            Best Cashback Credit Cards in Canada
            <span>
              Compare flat-rate and category-based cashback cards for maximum
              returns
            </span>
          </Link>
          <Link href="/#tool" className="seo-related-link">
            Credit Card Calculator
            <span>
              Enter your spending and see which card returns the most
            </span>
          </Link>
        </div>
      </div>
    </SeoLayout>
  );
}

import Loader from "@/components/Loader";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import Nav from "@/components/Nav";
import SideRail from "@/components/SideRail";
import PageEffects from "@/components/PageEffects";
import InteractiveTool from "@/components/InteractiveTool";
import TopPicks from "@/components/TopPicks";
import { SpendProvider } from "@/context/SpendContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { getCatalogDisplayMap } from "@/lib/cardDetail";

// ISR: home-page card display refreshes from Supabase card_catalog every ~5 min.
export const revalidate = 300;

export default async function HomePage() {
  const catalog = await getCatalogDisplayMap();
  return (
    <>
      {/* ── Global overlays ── */}
      <Loader />
      <div className="grain" />
      <PageEffects />
      <SideRail />
      <Nav />

      {/* ══════════════════════════════════════
          01 HERO
      ══════════════════════════════════════ */}
      <section id="hero">
        <video
          className="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/real card video0001-0288.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay" />
        <div className="section-num">01 / Hero</div>
        <div className="hero-wrap">

          {/* Left: text */}
          <div className="hero-text">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Built for Canada - Live 2026
            </div>
            <h1 className="hero-headline reveal">
              What if your <span className="ital">cards</span>
              <br />
              actually <span className="quote-mark">&quot;</span>worked<span className="quote-mark">&quot;</span>
              <br />
              for <span className="ital">you?</span>
            </h1>
            <p className="hero-sub reveal">
              The average Canadian holds <b>4 credit cards</b> and leaves{" "}
              <b>$847/year</b> in rewards unclaimed. Use ClearFin to choose your next credit
              card based on how you actually shop.
            </p>
            <div className="hero-cta-row reveal">
              <a href="#tool" className="btn-primary">
                <span>Open the Calculator</span>
                <span className="btn-arrow">-&gt;</span>
              </a>
              <Link href="/credit-cards" className="btn-primary">
                <span>View all cards</span>
                <span className="btn-arrow">-&gt;</span>
              </Link>
            </div>
            <div className="hero-stats reveal">
              <div>
                <div className="hero-stat-num">$847<span className="pct">/yr</span></div>
                <div className="hero-stat-label">Avg leak per user</div>
              </div>
              <div>
                <div className="hero-stat-num">107</div>
                <div className="hero-stat-label">Cards tracked</div>
              </div>
              <div>
                <div className="hero-stat-num">17</div>
                <div className="hero-stat-label">Issuers covered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll - Calculate</span>
          <span className="scroll-hint-line" />
        </div>
        <div className="section-divider-bottom" />
      </section>

      <section className="home-seo-intro" aria-labelledby="home-seo-intro-title">
        <div className="home-seo-intro-inner">
          <div className="section-num">02 / How ClearFin Helps</div>
          <h2 id="home-seo-intro-title">
            Compare Canadian credit cards around the way you actually spend
          </h2>
          <p>
            Credit card rewards look simple until you try to compare them.
            Grocery rates can depend on the store, travel points can change
            value depending on how you redeem them, and a large welcome offer
            does not always make up for an annual fee. ClearFin brings those
            details into one place so you can make a calmer, more practical
            choice.
          </p>
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
          <p>
            ClearFin is not a bank or digital wallet, and it does not move your
            money. It is an independent comparison and education tool. The goal
            is straightforward: help you understand the trade-offs, choose a
            card that fits your real routine, and avoid paying for benefits you
            are unlikely to use.
          </p>
        </div>
      </section>

      <SpendProvider>
        <CatalogProvider map={catalog}>
          {/* ══════════════════════════════════════
              03 INTERACTIVE TOOL
          ══════════════════════════════════════ */}
          <InteractiveTool gateOnly />

          {/* ══════════════════════════════════════
              04 TOP PICKS BY CATEGORY
          ══════════════════════════════════════ */}
          <TopPicks />
        </CatalogProvider>
      </SpendProvider>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </>
  );
}

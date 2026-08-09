import Nav from "@/components/Nav";
import Link from "next/link";
import PageEffects from "@/components/PageEffects";
import InteractiveTool from "@/components/InteractiveTool";
import CompareSection from "@/components/CompareSection";
import TopPicks from "@/components/TopPicks";
import WaitlistForm from "@/components/WaitlistForm";
import { SpendProvider } from "@/context/SpendContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { getCatalogDisplayMap } from "@/lib/cardDetail";
import HeroCardCarousel from "@/components/HeroCardCarousel";
import ClearFinWordmark from "@/components/ClearFinWordmark";
import InstitutionMarquee from "@/components/InstitutionMarquee";
import SiteFooter from "@/components/SiteFooter";

// ISR: home-page card display refreshes from Supabase card_catalog every ~5 min.
export const revalidate = 300;

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClearFin Credit Card Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://www.clearfin.ca/#tool",
  description:
    "Compare 107 Canadian credit cards based on your actual monthly spending. Find which card earns you the most cashback and rewards across dining, groceries, gas, travel, and other spend.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
  },
  creator: {
    "@type": "Organization",
    name: "ClearFin",
    url: "https://www.clearfin.ca",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find your best Canadian credit card with ClearFin",
  description:
    "Answer 7 quick questions about your spending, income, and credit score. ClearFin calculates your exact reward leak and shows which Canadian credit cards you qualify for earn you the most.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Open the ClearFin calculator",
      text: "Click 'Open the Calculator' or 'Start in 30 seconds' on the ClearFin homepage.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter your monthly dining spend",
      text: "Enter how much you spend each month on restaurants, cafes, takeout, and food delivery.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Enter your monthly grocery budget",
      text: "Enter your monthly spend at supermarkets, Costco, and grocery stores.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Enter your monthly gas spend",
      text: "Enter your monthly fuel costs including petrol, diesel, and EV charging.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Enter your monthly travel spend",
      text: "Enter your average monthly travel budget including flights, hotels, and car rentals.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Enter your remaining monthly spend",
      text: "Enter everything else: shopping, utilities, subscriptions, and services.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "Review your personalized card recommendations",
      text: "ClearFin calculates your estimated annual earnings across all 107 Canadian cards and ranks them by net value for your specific spending profile.",
    },
  ],
};

export default async function HomePage() {
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
      {/* ── Global overlays ── */}
      <PageEffects />
      <Nav />

      {/* ══════════════════════════════════════
          01 HERO
      ══════════════════════════════════════ */}
      <section id="hero">
        <div className="hero-wrap">
          <div className="hero-text">
            <h1 className="hero-headline reveal">
              Find the credit card that rewards how you <span className="ital">actually spend.</span>
            </h1>
            <p className="hero-sub reveal">
              Compare Canadian credit cards using your real monthly spending. ClearFin does
              the math across fees, reward rates, income requirements, and credit eligibility.
            </p>
            <div className="hero-cta-row reveal">
              <a href="#tool" className="btn-primary">
                <span>Find my best card</span>
                <span className="btn-arrow">→</span>
              </a>
              <Link href="/credit-cards" className="btn-secondary">
                Browse credit cards <span className="btn-arrow">→</span>
              </Link>
            </div>
            <div className="hero-microcopy reveal">
              Free to use <span /> No signup required <span /> About 30 seconds
            </div>
          </div>

          <div className="hero-product reveal">
            <HeroCardCarousel />
          </div>
        </div>
        <div className="home-proof" role="region" aria-label="ClearFin coverage">
          <div className="home-proof-item"><strong>107+</strong><span>Canadian cards compared</span></div>
          <div className="home-proof-item"><strong>17</strong><span>Issuers covered</span></div>
          <div className="home-proof-item"><strong>Independent</strong><span>Recommendations built around your spending</span></div>
        </div>
      </section>

      <section className="home-seo-intro" aria-labelledby="home-seo-intro-title">
        <div className="home-seo-intro-inner">
          <div className="section-num">How ClearFin Helps</div>
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
              02 INTERACTIVE TOOL
          ══════════════════════════════════════ */}
          <InteractiveTool />

          {/* ══════════════════════════════════════
              03 TOP PICKS BY CATEGORY
          ══════════════════════════════════════ */}
          <TopPicks />

          {/* ══════════════════════════════════════
              04 COMPARE CARDS
          ══════════════════════════════════════ */}
          <CompareSection />
        </CatalogProvider>
      </SpendProvider>

      {/* ══════════════════════════════════════
          05 APP PREVIEW + CLEARSAVE
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-app">
        <div className="section-num">05 / Coming Soon</div>
        <div className="feat-wrap">
          <div className="feat-text">
            <div className="feat-eyebrow">ClearFin mobile · Private preview</div>
            <h2 className="feat-title">
              Know the best card<br />
              <span className="ital">before you tap.</span>
            </h2>
            <p className="feat-body">
              One private view of your cards, rewards, bills, and everyday opportunities—built
              to help you make a better decision before and after every purchase.
            </p>
            <div className="feat-list">
              <div className="feat-list-item"><span>01</span><div><strong>Best-card guidance</strong><small>Know which card could earn more at the merchant you&apos;re visiting.</small></div></div>
              <div className="feat-list-item"><span>02</span><div><strong>Reward tracking</strong><small>See estimated earnings across every card in one place.</small></div></div>
              <div className="feat-list-item"><span>03</span><div><strong>Quiet reminders</strong><small>Stay ahead of bills, subscriptions, and utilization without the noise.</small></div></div>
            </div>
            <a href="#waitlist" className="btn-primary feat-cta">
              <span>Request early access</span>
              <span className="btn-arrow">→</span>
            </a>
            <div className="feat-trust"><span>No card numbers</span><span>Read-only by design</span><span>Canada first</span></div>
          </div>
          <div className="feat-visual">
            <div className="app-preview-frame">
              <div className="app-preview-screen">
                <div className="app-preview-header">
                  <span className="app-preview-brand"><ClearFinWordmark /></span>
                  <span className="app-preview-tag">PRIVATE BETA</span>
                </div>
                <div className="app-preview-welcome"><span>Good morning</span><strong>Your wallet is working smarter.</strong></div>
                <div className="app-reward-total">
                  <span>Estimated rewards this year</span>
                  <strong>$1,284</strong>
                  <small>+$218 optimized with ClearFin</small>
                  <div className="app-reward-line"><i /><i /><i /><i /><i /><i /></div>
                </div>
                <div className="app-smart-label"><span>SMART GUIDANCE</span><small>Now</small></div>
                <div className="app-preview-rec">
                  <div className="app-rec-mark">6×</div>
                  <div>
                    <div className="app-preview-rec-label">Shopping at Sobeys?</div>
                    <div className="app-preview-rec-card">Use Scotia Gold Amex</div>
                    <div className="app-preview-rec-earn">Estimated +$3.40 more on this purchase</div>
                  </div>
                </div>
                <div className="app-preview-grid">
                  <div><span>Next payment</span><strong>$842</strong><small>Amex · in 6 days</small></div>
                  <div><span>Utilization</span><strong>18%</strong><small>Healthy range</small></div>
                </div>
                <div className="clearsave-badge">
                  <span className="clearsave-icon">✓</span>
                  <div>
                    <div className="clearsave-title">You&apos;re all caught up</div>
                    <div className="clearsave-desc">No payments or subscriptions need attention.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="app-float-card app-float-one"><span>Cards tracked</span><strong>3</strong><small>One clear view</small></div>
            <div className="app-float-card app-float-two"><span>This month</span><strong>+$46</strong><small>estimated extra rewards</small></div>
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

      {/* ══════════════════════════════════════
          06 WAITLIST
      ══════════════════════════════════════ */}
      <section id="waitlist">
        <div className="wait-wrap">
          <h2 className="wait-title">
            Stop leaving<br />
            rewards on the <span className="ital">table.</span>
          </h2>
          <p className="wait-sub">
            Join the waitlist. Early access drops in waves — Calgary first, then nationally.
            No spam. Just one email when it&apos;s your turn.
          </p>
          <WaitlistForm />
          <div className="wait-foot">No credit card required · Built in 🇨🇦</div>
        </div>
      </section>

      <InstitutionMarquee />

      {/* ── FOOTER ── */}
      <SiteFooter />
    </>
  );
}

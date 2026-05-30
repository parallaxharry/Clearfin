import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SideRail from "@/components/SideRail";
import PageEffects from "@/components/PageEffects";
import InteractiveTool from "@/components/InteractiveTool";
import CompareSection from "@/components/CompareSection";
import TopPicks from "@/components/TopPicks";
import WaitlistForm from "@/components/WaitlistForm";
import StatementUpload from "@/components/StatementUpload";
import { SpendProvider } from "@/context/SpendContext";

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClearFin Credit Card Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://clearfin.ca/#tool",
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
    url: "https://clearfin.ca",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find your best Canadian credit card with ClearFin",
  description:
    "Answer 5 quick questions about your monthly spending. ClearFin calculates your exact reward leak and shows which of 107 Canadian credit cards earns you the most.",
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

export default function HomePage() {
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
              <a href="#showcase" className="btn-secondary">
                See top cards <span className="btn-arrow">-&gt;</span>
              </a>
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

      <SpendProvider>
        {/* ══════════════════════════════════════
            02 INTERACTIVE TOOL
        ══════════════════════════════════════ */}
        <InteractiveTool />

        {/* ══════════════════════════════════════
            03 TOP PICKS BY CATEGORY
        ══════════════════════════════════════ */}
        <TopPicks />

        {/* ══════════════════════════════════════
            04 STATEMENT UPLOAD + CONSULTATION
        ══════════════════════════════════════ */}
        <StatementUpload />

        {/* ══════════════════════════════════════
            05 COMPARE CARDS
        ══════════════════════════════════════ */}
        <CompareSection />
      </SpendProvider>

      {/* ══════════════════════════════════════
          06 APP PREVIEW + CLEARSAVE
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-app">
        <div className="section-num">06 / Coming Soon</div>
        <div className="feat-wrap">
          <div className="feat-text reveal">
            <div className="feat-eyebrow">Mobile App · 2026</div>
            <h2 className="feat-title">
              Your wallet,<br />
              <span className="ital">supercharged.</span>
            </h2>
            <p className="feat-body">
              All your finances in one app. Track your cards, compare rewards, and take
              control of your spending from a single ClearFin dashboard.
            </p>
            <div className="feat-list">
              <div className="feat-list-item">Get payment reminders before bills are due</div>
              <div className="feat-list-item">Get notified about active subscriptions</div>
              <div className="feat-list-item">Get spending limit reminders before you go over budget</div>
              <div className="feat-list-item">Track rewards across all your cards in one dashboard</div>
            </div>
            <a href="#waitlist" className="btn-primary" style={{ marginTop: "32px", display: "inline-flex" }}>
              <span>Join Waitlist for App Access</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
          <div className="feat-visual reveal">
            <div className="app-preview-frame">
              <div className="app-preview-screen">
                <div className="app-preview-header">
                  <span className="app-preview-brand">ClearFin</span>
                  <span className="app-preview-tag">· Live</span>
                </div>
                <div className="app-preview-card-row">
                  <div className="app-mini-card app-mini-cobalt">
                    <div className="app-mini-card-name">Cobalt</div>
                    <div className="app-mini-card-pts">+5x</div>
                  </div>
                  <div className="app-mini-card app-mini-scotia">
                    <div className="app-mini-card-name">Scotia</div>
                    <div className="app-mini-card-pts">+6x</div>
                  </div>
                  <div className="app-mini-card app-mini-td">
                    <div className="app-mini-card-name">Aeroplan</div>
                    <div className="app-mini-card-pts">+3x</div>
                  </div>
                </div>
                <div className="app-preview-rec">
                  <div className="app-preview-rec-label">Best for your Loblaws shop</div>
                  <div className="app-preview-rec-card">Scotia Gold Amex</div>
                  <div className="app-preview-rec-earn">+$4.20 more than your current card</div>
                </div>
                <div className="clearsave-badge">
                  <span className="clearsave-icon">✦</span>
                  <div>
                    <div className="clearsave-title">ClearSave active</div>
                    <div className="clearsave-desc">Extra 3% at Fresh Prep — auto-applied</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

      {/* ══════════════════════════════════════
          07 WAITLIST
      ══════════════════════════════════════ */}
      <section id="waitlist">
        <div className="section-num">07 / Waitlist</div>
        <div className="wait-wrap">
          <div className="wait-eyebrow reveal">Limited spots · Calgary first</div>
          <h2 className="wait-title reveal">
            Stop leaving<br />
            rewards on the <span className="ital">table.</span>
          </h2>
          <p className="wait-sub reveal">
            Join the waitlist. Early access drops in waves — Calgary first, then nationally.
            No spam. Just one email when it&apos;s your turn.
          </p>
          <WaitlistForm />
          <div className="wait-foot reveal">No credit card required · Built in 🇨🇦</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-guides">
          <div className="footer-guides-title">Credit Card Guides</div>
          <div className="footer-guides-grid">
            <a href="/best-credit-cards-canada">Best Credit Cards</a>
            <a href="/best-cashback-credit-cards-canada">Best Cashback Cards</a>
            <a href="/best-travel-credit-cards-canada">Best Travel Cards</a>
            <a href="/best-grocery-credit-cards-canada">Best Grocery Cards</a>
            <a href="/best-no-fee-credit-cards-canada">Best No-Fee Cards</a>
            <a href="/best-student-credit-cards-canada">Best Student Cards</a>
            <a href="/credit-card-rewards-canada-guide">Rewards Guide</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-info">© 2026 ClearFin Digital Inc · Calgary, AB</div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/faq">FAQ</a>
            <a href="/privacy">Privacy</a>
            <a href="/disclosures">Disclosures</a>
            <a href="mailto:info@clearfin.ca">Contact</a>
          </div>
        </div>
        <div className="footer-disclaimer">
          ClearFin is independent and is not affiliated with any bank, issuer, or credit
          card provider. For corrections, removals, or updates, contact{" "}
          <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
        </div>
      </footer>
    </>
  );
}

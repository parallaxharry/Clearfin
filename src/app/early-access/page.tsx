import type { Metadata } from "next";
import Logo from "@/components/Logo";
import Nav from "@/components/Nav";
import PageEffects from "@/components/PageEffects";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Get Early Access to the ClearFin App | ClearFin",
  description:
    "ClearFin's mobile app launches in 2026 — track your cards, compare rewards, and control your spending from one dashboard. Join the waitlist for early access, Calgary first.",
  alternates: { canonical: "/early-access" },
  openGraph: {
    title: "Get Early Access to the ClearFin App | ClearFin",
    description:
      "Track your cards, compare rewards, and control your spending from one dashboard. Join the waitlist for early access.",
    url: "https://www.clearfin.ca/early-access",
    siteName: "ClearFin",
    type: "website",
    locale: "en_CA",
  },
};

export default function EarlyAccessPage() {
  return (
    <>
      <div className="grain" />
      <PageEffects />
      <Nav />

      {/* ══════════════════════════════════════
          APP PREVIEW + CLEARSAVE
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-app">
        <div className="section-num">Coming Soon</div>
        <div className="feat-wrap">
          <div className="feat-text reveal">
            <div className="feat-eyebrow">Mobile App · 2026</div>
            <h1 className="feat-title">
              Your wallet,<br />
              <span className="ital">supercharged.</span>
            </h1>
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
          WAITLIST
      ══════════════════════════════════════ */}
      <section id="waitlist">
        <div className="section-num">Waitlist</div>
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
            <a href="/blog">Blog</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-info">© 2026 ClearFin Digital Inc · Calgary, AB</div>
          <div className="footer-links">
            <Logo className="footer-logo footer-logo-big" priority={false} />
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

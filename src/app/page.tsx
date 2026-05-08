import Image from "next/image";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SideRail from "@/components/SideRail";
import PageEffects from "@/components/PageEffects";
import InteractiveTool from "@/components/InteractiveTool";
import TopPicks from "@/components/TopPicks";
import WaitlistForm from "@/components/WaitlistForm";
import StatementUpload from "@/components/StatementUpload";

/* ── Real card images for hero deck ── */
const HERO_CARDS = [
  { img: "/cards/amex-cobalt.avif",       label: "Amex Cobalt",      badge: "5x Dining",      pos: "card-c1" },
  { img: "/cards/scotia-gold-amex.webp",  label: "Scotia Gold",      badge: "6x Grocery",     pos: "card-c2" },
  { img: "/cards/td-aeroplan-infinite.jpeg", label: "TD Aeroplan",   badge: "Best Travel",    pos: "card-c3" },
  { img: "/cards/rbc-avion-infinite.webp",label: "RBC Avion",        badge: "Most Flexible",  pos: "card-c4" },
  { img: "/cards/bmo-eclipse.webp",       label: "BMO Eclipse",      badge: "5x Gas",         pos: "card-c5" },
];

export default function HomePage() {
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
        <div className="section-num">01 / Hero</div>
        <div className="hero-wrap">

          {/* Left: text */}
          <div className="hero-text">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Built for Canada · Live 2026
            </div>
            <h1 className="hero-headline reveal">
              What if your <span className="ital">cards</span>
              <br />
              actually <span className="strike">worked</span>
              <br />
              for <span className="ital">you?</span>
            </h1>
            <p className="hero-sub reveal">
              The average Canadian holds <b>4 credit cards</b> and leaves{" "}
              <b>$847/year</b> in rewards unclaimed. ClearFin finds your best card for every
              purchase — instantly.
            </p>
            <div className="hero-cta-row reveal">
              <a href="#tool" className="btn-primary">
                <span>Open the Calculator</span>
                <span className="btn-arrow">→</span>
              </a>
              <a href="#showcase" className="btn-secondary">
                See top cards <span className="btn-arrow">→</span>
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

          {/* Right: real card fan */}
          <div className="hero-visual">
            <div className="orbit orbit-3" />
            <div className="orbit orbit-1">
              <div className="orbit-node" style={{ top: "50%", left: 0 }} />
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-node" style={{ top: 0, left: "50%" }} />
            </div>
            <div className="hero-pill hero-pill-1">
              <span className="hero-pill-dot" />Optimal · Scotia 6x
            </div>
            <div className="hero-pill hero-pill-2">
              <span className="hero-pill-dot" />AI-powered
            </div>
            <div className="hero-pill hero-pill-3">
              <span className="hero-pill-dot" />17 issuers
            </div>
            <div className="card-deck">
              {HERO_CARDS.map((c, i) => (
                <div key={c.pos} className={`hero-real-card ${c.pos}`}>
                  <Image
                    src={c.img}
                    alt={c.label}
                    fill
                    sizes="220px"
                    style={{ objectFit: "cover", borderRadius: "inherit" }}
                    priority={i === 2}
                  />
                  <div className="hero-card-overlay" />
                  <span className="hero-card-badge">{c.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll · Calculate</span>
          <span className="scroll-hint-line" />
        </div>
        <div className="section-divider-bottom" />
      </section>

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
          05 COMPARISON ENGINE
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-2">
        <div className="section-num">05 / Comparison Engine</div>
        <div className="feat-wrap">
          <div className="feat-text reveal">
            <div className="feat-eyebrow">107 cards · 17 issuers</div>
            <h2 className="feat-title">
              We did the <span className="ital">spreadsheet</span> so you don&apos;t have to.
            </h2>
            <p className="feat-body">
              Every Canadian credit card broken down by category, multiplier, annual fee,
              welcome bonus, and net-of-fee return on your actual spend. Updated continuously.
            </p>
            <div className="feat-list">
              <div className="feat-list-item">Category-by-category multiplier mapping</div>
              <div className="feat-list-item">Net-of-annual-fee return calculation</div>
              <div className="feat-list-item">Welcome bonus tracking</div>
            </div>
          </div>
          <div className="feat-visual reveal">
            <div className="bars">
              {[
                { name: "Cobalt",    w: 0.92, amt: "$1,142" },
                { name: "Scotia G", w: 0.78, amt: "$967" },
                { name: "Aeroplan", w: 0.61, amt: "$754" },
                { name: "Avion",    w: 0.48, amt: "$595" },
                { name: "Tangerine",w: 0.34, amt: "$421" },
              ].map((b) => (
                <div className="bar-row" key={b.name}>
                  <div className="bar-name">{b.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ "--w": b.w } as React.CSSProperties} />
                  </div>
                  <div className="bar-amt">{b.amt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

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
              The ClearFin app tracks your rewards across all issuers in one place,
              surfaces the best card for every spending category, and unlocks <strong>ClearSave</strong> —
              our exclusive merchant reward program.
            </p>
            <div className="feat-list">
              <div className="feat-list-item">Know the best card to use for every category — grocery, travel, gas, dining</div>
              <div className="feat-list-item">Track rewards across all your cards in one dashboard</div>
              <div className="feat-list-item">ClearSave: earn bonus cashback at partner merchants — auto-applied, no codes</div>
              <div className="feat-list-item">Statement credits within 24 hours, stacks with card rewards</div>
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
        <div className="footer-info">© 2026 ClearFin Digital Inc · Calgary, AB</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">PIPEDA</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </>
  );
}

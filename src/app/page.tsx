import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SideRail from "@/components/SideRail";
import PageEffects from "@/components/PageEffects";
import InteractiveTool from "@/components/InteractiveTool";
import CardParade from "@/components/CardParade";
import WaitlistForm from "@/components/WaitlistForm";

/* ── Static card used in hero deck ── */
function CardFace({
  variant, issuer, num, label, network,
}: { variant: string; issuer: string; num: string; label: string; network: string }) {
  return (
    <div className={`card ${variant}`}>
      <div className="card-bg" />
      <div className="card-grid" />
      <div className="card-noise" />
      <div className="card-sheen" />
      <div className="card-row">
        <div className="card-chip" />
        <div className="card-issuer">{issuer}</div>
      </div>
      <div className="card-mid">
        <div className="card-num">{num}</div>
      </div>
      <div className="card-foot">
        <div className="card-name">{label}</div>
        <div className="card-network">{network}</div>
      </div>
    </div>
  );
}

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
              The average Canadian holds <b>4 credit cards</b> and uses the wrong one on{" "}
              <b>63% of purchases</b>. ClearFin tells you which card to tap — before you tap.
            </p>
            <div className="hero-cta-row reveal">
              <a href="#tool" className="btn-primary">
                <span>Open the Calculator</span>
                <span className="btn-arrow">→</span>
              </a>
              <a href="#showcase" className="btn-secondary">
                See the cards <span className="btn-arrow">→</span>
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

          {/* Right: 3D card deck */}
          <div className="hero-visual">
            <div className="orbit orbit-3" />
            <div className="orbit orbit-1">
              <div className="orbit-node" style={{ top: "50%", left: 0 }} />
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-node" style={{ top: 0, left: "50%" }} />
            </div>
            <div className="hero-pill hero-pill-1">
              <span className="hero-pill-dot" />Optimal · Cobalt 5x
            </div>
            <div className="hero-pill hero-pill-2">
              <span className="hero-pill-dot" />Real-time
            </div>
            <div className="hero-pill hero-pill-3">
              <span className="hero-pill-dot" />17 issuers
            </div>
            <div className="card-deck">
              <CardFace variant="card-c1 card-violet"   issuer="RBC"     num="•••• 4421" label="Avion"     network="VISA" />
              <CardFace variant="card-c2 card-rose"     issuer="Amex"    num="•••• 8203" label="Cobalt"    network="AMEX" />
              <CardFace variant="card-c3 card-obsidian" issuer="ClearFin" num="•••• ••••" label="Optimizer" network="PRO" />
              <CardFace variant="card-c4 card-sapphire" issuer="TD"      num="•••• 1167" label="Aeroplan"  network="VISA" />
              <CardFace variant="card-c5 card-champagne" issuer="Scotia"  num="•••• 9082" label="Gold"      network="AMEX" />
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
          03 CARD SHOWCASE
      ══════════════════════════════════════ */}
      <CardParade />

      {/* ══════════════════════════════════════
          04 FEAT: Wrong-card alerts
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-1">
        <div className="section-num">04 / Wrong-card Alerts</div>
        <div className="feat-wrap">
          <div className="feat-text reveal">
            <div className="feat-eyebrow">The core differentiator</div>
            <h2 className="feat-title">
              A nudge <span className="ital">before</span> you tap.
            </h2>
            <p className="feat-body">
              When you&apos;re about to swipe the wrong card, ClearFin sends a real-time push
              notification telling you which card in your wallet would have earned more. You decide.
              We just make sure you decide with the math in front of you.
            </p>
            <div className="feat-list">
              <div className="feat-list-item">Real-time merchant detection</div>
              <div className="feat-list-item">Cross-reference 107-card database</div>
              <div className="feat-list-item">Cashback delta in dollars, not points</div>
            </div>
          </div>
          <div className="feat-visual reveal">
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="alert-card">
                  <div className="alert-tag">⚠ Wrong Card</div>
                  <div className="alert-merchant">Loblaws — Groceries</div>
                  <div className="alert-amount">$84.20 on RBC Avion</div>
                  <div className="alert-rec">
                    <span>Use Scotia Gold Amex</span><span>+$3.36</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

      {/* ══════════════════════════════════════
          05 FEAT: Comparison engine
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
              Every Canadian credit card, broken down by category, multiplier, annual fee, welcome
              bonus, and net-of-fee return on your spend. Updated continuously.
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
          06 FEAT: ClearSave
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-3">
        <div className="section-num">06 / ClearSave Offers</div>
        <div className="feat-wrap">
          <div className="feat-text reveal">
            <div className="feat-eyebrow">Merchant-funded · No clipping</div>
            <h2 className="feat-title">
              Cashback that <span className="ital">activates itself.</span>
            </h2>
            <p className="feat-body">
              No coupons. No codes. Just statement credits the next morning. We negotiate with
              brands; you keep tapping the way you already do.
            </p>
            <div className="feat-list">
              <div className="feat-list-item">Auto-applied at checkout</div>
              <div className="feat-list-item">Statement credit within 24 hours</div>
              <div className="feat-list-item">Stacks with card rewards</div>
            </div>
          </div>
          <div className="feat-visual reveal">
            <div className="offers">
              {[
                { merchant: "Fresh Prep",  detail: "First 4 boxes", back: "12%" },
                { merchant: "Knix",        detail: "$80+ orders",   back: "8%"  },
                { merchant: "Three Ships", detail: "Storewide",     back: "15%" },
                { merchant: "Tim Hortons", detail: "Mobile order",  back: "5%"  },
              ].map((o) => (
                <div className="offer-card" key={o.merchant}>
                  <div>
                    <div className="offer-merchant">{o.merchant}</div>
                    <div className="offer-detail">{o.detail}</div>
                  </div>
                  <div className="offer-back">{o.back}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

      {/* ══════════════════════════════════════
          07 FEAT: Open Banking
      ══════════════════════════════════════ */}
      <section className="feat" id="feat-4">
        <div className="section-num">07 / Open Banking</div>
        <div className="feat-wrap">
          <div className="feat-text reveal">
            <div className="feat-eyebrow">Canada · 2026 Framework</div>
            <h2 className="feat-title">
              Open banking is <span className="ital">coming.</span> We were built for it.
            </h2>
            <p className="feat-body">
              PIPEDA-compliant, Quebec Law 25-aligned, designed against the 2026
              Consumer-Driven Banking framework. Your data, your control, your portability.
            </p>
            <div className="feat-list">
              <div className="feat-list-item">Read-only account access via Flinks</div>
              <div className="feat-list-item">PCI-DSS handled by Plaid</div>
              <div className="feat-list-item">Delete-everything switch built in</div>
            </div>
          </div>
          <div className="feat-visual reveal">
            <div className="constel">
              {[
                { top: "10%", left: "50%", label: "CORE",     lt: "4%",  ll: "54%" },
                { top: "30%", left: "18%", label: "FLINKS",   lt: "35%", ll: "8%"  },
                { top: "38%", left: "80%", label: "PLAID",    lt: "42%", ll: "78%" },
                { top: "62%", left: "30%", label: "GIFTBIT",  lt: "67%", ll: "22%" },
                { top: "70%", left: "68%", label: "INVERITE", lt: "75%", ll: "62%" },
                { top: "88%", left: "50%", label: "YOU",      lt: "92%", ll: "44%" },
              ].map((d) => (
                <span key={d.label}>
                  <span className="constel-dot" style={{ top: d.top, left: d.left }} />
                  <span className="constel-label" style={{ top: d.lt, left: d.ll }}>{d.label}</span>
                </span>
              ))}
              {[
                { top: "11%", left: "50%", width: "140px", rotate: "120deg" },
                { top: "11%", left: "50%", width: "140px", rotate: "60deg"  },
                { top: "31%", left: "18%", width: "200px", rotate: "15deg"  },
                { top: "39%", left: "80%", width: "180px", rotate: "160deg" },
                { top: "63%", left: "30%", width: "170px", rotate: "20deg"  },
                { top: "71%", left: "68%", width: "90px",  rotate: "120deg" },
              ].map((l, i) => (
                <span
                  key={i}
                  className="constel-line"
                  style={{ top: l.top, left: l.left, width: l.width, transform: `rotate(${l.rotate})` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider-bottom" />
      </section>

      {/* ══════════════════════════════════════
          08 WAITLIST
      ══════════════════════════════════════ */}
      <section id="waitlist">
        <div className="section-num">08 / Waitlist</div>
        <div className="wait-wrap">
          <div className="wait-eyebrow reveal">Limited spots · Calgary first</div>
          <h2 className="wait-title reveal">
            Stop tapping <br />
            the <span className="ital">wrong</span> card.
          </h2>
          <p className="wait-sub reveal">
            Join the waitlist. Early access drops in waves — Calgary first, then nationally. No
            spam. Just one email when it&apos;s your turn.
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

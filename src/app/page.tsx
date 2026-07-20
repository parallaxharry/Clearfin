import Loader from "@/components/Loader";
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
              <a href="/credit-cards" className="btn-primary">
                <span>View all cards</span>
                <span className="btn-arrow">-&gt;</span>
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
        <CatalogProvider map={catalog}>
          {/* ══════════════════════════════════════
              02 INTERACTIVE TOOL
          ══════════════════════════════════════ */}
          <InteractiveTool gateOnly />

          {/* ══════════════════════════════════════
              03 TOP PICKS BY CATEGORY
          ══════════════════════════════════════ */}
          <TopPicks />
        </CatalogProvider>
      </SpendProvider>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </>
  );
}

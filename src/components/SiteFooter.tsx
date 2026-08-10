import Link from "next/link";
import ClearFinWordmark from "@/components/ClearFinWordmark";

/** The one site-wide footer: brand, navigation, legal details, and disclaimer. */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="ClearFin home">
            <ClearFinWordmark />
          </Link>
          <p>
            Clearer credit card decisions, built around how Canadians actually
            spend.
          </p>
          <span className="footer-canada">
            Built independently in Calgary, Canada 🇨🇦
          </span>
        </div>

        <div className="footer-nav-group">
          <div className="footer-guides-title">Explore</div>
          <div className="footer-guides-grid">
            <Link href="/best-credit-cards-canada">Best Credit Cards</Link>
            <Link href="/best-cashback-credit-cards-canada">Cashback Cards</Link>
            <Link href="/best-travel-credit-cards-canada">Travel Cards</Link>
            <Link href="/best-grocery-credit-cards-canada">Grocery Cards</Link>
            <Link href="/best-no-fee-credit-cards-canada">No-Fee Cards</Link>
            <Link href="/best-student-credit-cards-canada">Student Cards</Link>
            <Link href="/credit-card-rewards-canada-guide">Learn</Link>
            <Link href="/blog/best-credit-card-combination-canada">
              Card Combinations
            </Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>

        <div className="footer-nav-group">
          <div className="footer-guides-title">ClearFin</div>
          <div className="footer-guides-grid">
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclosures">Disclosures</Link>
            <Link href="/early-access">Early Access</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-rule" />

      <div className="footer-bottom">
        <div className="footer-info">© 2026 ClearFin Digital Inc · Calgary, AB</div>
        <div className="footer-independence">
          <span className="footer-independence-dot" />
          Independent of banks and card issuers
        </div>
      </div>

      <div className="footer-disclaimer">
        ClearFin is independent and is not affiliated with any bank, issuer, or credit
        card provider. For corrections, removals, or updates, contact{" "}
        <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
      </div>
    </footer>
  );
}

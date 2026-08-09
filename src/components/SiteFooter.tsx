import Link from "next/link";
import ClearFinWordmark from "@/components/ClearFinWordmark";

/** The one site-wide footer: guides grid, brand row, legal links, disclaimer. */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-guides">
        <div className="footer-guides-title">Credit Card Guides</div>
        <div className="footer-guides-grid">
          <Link href="/best-credit-cards-canada">Best Credit Cards</Link>
          <Link href="/best-cashback-credit-cards-canada">Best Cashback Cards</Link>
          <Link href="/best-travel-credit-cards-canada">Best Travel Cards</Link>
          <Link href="/best-grocery-credit-cards-canada">Best Grocery Cards</Link>
          <Link href="/best-no-fee-credit-cards-canada">Best No-Fee Cards</Link>
          <Link href="/best-student-credit-cards-canada">Best Student Cards</Link>
          <Link href="/credit-card-rewards-canada-guide">Rewards Guide</Link>
          <Link href="/best-credit-card-combination-in-canada-for-2026-how-to-pair-two-cards-for-maximum-rewards">
            Card Combinations
          </Link>
          <Link href="/blog">Blog</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-info">© 2026 ClearFin Digital Inc · Calgary, AB</div>
        <div className="footer-links">
          <Link href="/" className="footer-logo footer-logo-big" aria-label="ClearFin home">
            <ClearFinWordmark />
          </Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/disclosures">Disclosures</Link>
          <Link href="/early-access">Early Access</Link>
          <Link href="/contact">Contact</Link>
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

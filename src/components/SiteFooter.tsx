import Logo from "@/components/Logo";

/** The one site-wide footer: guides grid, brand row, legal links, disclaimer. */
export default function SiteFooter() {
  return (
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
  );
}

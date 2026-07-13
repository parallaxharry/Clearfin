/**
 * FinlyWealth sub-affiliate compliance, shown directly below the apply links:
 * §11 requires a prominent plain-language commission disclosure near the links
 * (footer placement is disallowed), and §17d requires the outdated-info
 * disclaimer verbatim — do not reword the ⚠ sentence.
 */
export default function AffiliateDisclosure() {
  return (
    <div className="seo-affiliate-note">
      <p>
        Some &ldquo;Apply&rdquo; links on this page are affiliate links. ClearFin may earn a
        commission if you are approved for a card through them, at no extra cost to you. This
        never affects how we rank or review cards.
      </p>
      <p>
        ⚠ Disclaimer: The information in this content may become outdated over time. For the
        most accurate and up-to-date details, please visit the links provided.
      </p>
    </div>
  );
}

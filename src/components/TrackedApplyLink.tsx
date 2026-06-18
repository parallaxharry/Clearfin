"use client";

interface TrackedApplyLinkProps {
  cardId: string;
  href: string;
  issuer: string;
  className?: string;
}

function trackClick(cardId: string) {
  fetch("/api/track-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId }),
  }).catch(() => {});
}

/**
 * Apply CTA that logs a click to /api/track-click, then opens the issuer's own
 * application page. No affiliate offer is implied — this is a plain outbound link.
 * When affiliate links arrive, swap `href` for the card's affiliate_url upstream.
 */
export default function TrackedApplyLink({
  cardId,
  href,
  issuer,
  className = "cardpg-apply",
}: TrackedApplyLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackClick(cardId)}
    >
      <span>Apply at {issuer}</span>
      <span className="cardpg-apply-arrow" aria-hidden="true">
        -&gt;
      </span>
    </a>
  );
}

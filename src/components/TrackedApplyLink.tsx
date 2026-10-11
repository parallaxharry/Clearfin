"use client";

import { trackMetaAction } from "@/lib/metaPixel";

interface TrackedApplyLinkProps {
  cardId: string;
  href: string;
  issuer: string;
  className?: string;
}

function trackClick(cardId: string) {
  trackMetaAction("ApplyClick");
  fetch("/api/track-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId }),
  }).catch(() => {});
}

function isAffiliateApplicationLink(href: string) {
  return /finlywealth\.com|utm_source=maximize-with-clearfin/i.test(href);
}

/**
 * Application CTA. `href` may be a direct issuer application URL or a disclosed
 * affiliate application URL. Official research/source links are stored separately
 * on the card record and must never be inferred from this application URL.
 */
export default function TrackedApplyLink({
  cardId,
  href,
  issuer,
  className = "cardpg-apply",
}: TrackedApplyLinkProps) {
  const affiliate = isAffiliateApplicationLink(href);

  return (
    <a
      href={href}
      target="_blank"
      rel={affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
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

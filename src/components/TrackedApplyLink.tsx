"use client";

import { trackMetaAction } from "@/lib/metaPixel";
import { applyLabel, applyRel } from "@/lib/applyLink";

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
  return (
    <a
      href={href}
      target="_blank"
      rel={applyRel(href)}
      className={className}
      onClick={() => trackClick(cardId)}
    >
      <span>{applyLabel(issuer, href)}</span>
      <span className="cardpg-apply-arrow" aria-hidden="true">
        -&gt;
      </span>
    </a>
  );
}

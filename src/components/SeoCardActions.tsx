import Link from "next/link";
import { CARDS } from "@/lib/cards";
import TrackedApplyLink from "@/components/TrackedApplyLink";

/**
 * Apply + details actions for the hand-written "Best X" pages, keyed by the
 * exact card name used in each page's card boxes (same convention as
 * SeoCardImage). Resolves to the verified card database in lib/cards.ts so
 * the apply link and issuer name can never drift. Returns null for an unknown
 * name so the layout simply omits the actions rather than breaking.
 */
const SEO_CARD_ID: Record<string, string> = {
  "Tangerine Money-Back Credit Card": "tangerine-money-back",
  "Tangerine Money-Back Mastercard": "tangerine-money-back",
  "CIBC Dividend Visa Infinite": "cibc-dividend-infinite",
  "CIBC Dividend Visa Card": "cibc-dividend-visa",
  "CIBC Dividend Visa Card for Students": "cibc-student",
  "CIBC Aventura Visa Infinite": "cibc-aventura-infinite",
  "Scotiabank Momentum Visa Infinite": "scotia-momentum-infinite",
  "Scotiabank Gold American Express": "scotia-gold",
  "Scotia Gold Amex": "scotia-gold",
  "Scotiabank Scene+ Visa Card": "scene-plus-visa",
  "Scotiabank Passport Visa Infinite": "scotia-passport",
  "BMO CashBack World Elite Mastercard": "bmo-cashback-world-elite",
  "BMO CashBack Mastercard": "bmo-cashback",
  "BMO Eclipse Visa Infinite": "bmo-eclipse",
  "SimplyCash Card from American Express": "amex-simply-cash",
  "American Express Cobalt Card": "cobalt",
  "Amex Cobalt": "cobalt",
  "PC Financial World Elite Mastercard": "pc-world-elite",
  "RBC Cash Back Mastercard": "rbc-cashback",
  "RBC Avion Visa Infinite": "rbc-avion",
  "TD Aeroplan Visa Infinite": "td-aeroplan",
};

export default function SeoCardActions({ name }: { name: string }) {
  const id = SEO_CARD_ID[name];
  const card = id ? CARDS.find((c) => c.id === id) : undefined;
  if (!card) return null;
  return (
    <div className="seo-card-actions">
      {card.bankUrl && (
        <TrackedApplyLink
          cardId={card.id}
          href={card.bankUrl}
          issuer={card.issuer}
          className="seo-card-apply"
        />
      )}
      <Link href={`/credit-cards/${card.id}`} className="seo-card-view">
        View full details
      </Link>
    </div>
  );
}

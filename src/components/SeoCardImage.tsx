import Image from "next/image";

/**
 * Card art for the hand-written "Best X" pages, keyed by the exact card name
 * used in each page's card boxes. Returns null for an unknown name so the
 * layout simply omits the image rather than breaking.
 */
const SEO_CARD_IMG: Record<string, string> = {
  "Tangerine Money-Back Credit Card": "/cards/tangerine-money-back.jpg",
  "Tangerine Money-Back Mastercard": "/cards/tangerine-money-back.jpg",
  "CIBC Dividend Visa Infinite": "/cards/cibc-dividend-infinite.webp",
  "CIBC Dividend Visa Card": "/cards/cibc-dividend-visa.webp",
  "CIBC Dividend Visa Card for Students": "/cards/cibc_dividend_for_students.avif",
  "CIBC Aventura Visa Infinite": "/cards/cibc-aventura-infinite.webp",
  "Scotiabank Momentum Visa Infinite": "/cards/scotia-momentum-infinite.webp",
  "Scotiabank Gold American Express": "/cards/Scotiabank-gold-amex.avif",
  "Scotia Gold Amex": "/cards/Scotiabank-gold-amex.avif",
  "Scotiabank Scene+ Visa Card": "/cards/scene-plus-visa.webp",
  "Scotiabank Passport Visa Infinite": "/cards/scotia-passport.webp",
  "BMO CashBack World Elite Mastercard": "/cards/bmo-cashback-world-elite.webp",
  "BMO CashBack Mastercard": "/cards/bmo-cashback.webp",
  "BMO Eclipse Visa Infinite": "/cards/bmo-eclipse.png",
  "SimplyCash Card from American Express": "/cards/amex-simply-cash.webp",
  "American Express Cobalt Card": "/cards/amex-cobalt.webp",
  "Amex Cobalt": "/cards/amex-cobalt.webp",
  "PC Financial World Elite Mastercard": "/cards/pc-world-elite.webp",
  "RBC Cash Back Mastercard": "/cards/rbc-cashback-mastercard.jpeg",
  "RBC Avion Visa Infinite": "/cards/rbc-avion-infinite.webp",
  "TD Aeroplan Visa Infinite": "/cards/td-aeroplan-infinite.png",
};

export default function SeoCardImage({ name }: { name: string }) {
  const src = SEO_CARD_IMG[name];
  if (!src) return null;
  return (
    <div className="seo-card-box-img">
      <Image src={src} alt={name} width={240} height={151} />
    </div>
  );
}

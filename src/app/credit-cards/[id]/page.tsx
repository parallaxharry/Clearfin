import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCard, getAllCardIds, type WelcomeBonus } from "@/lib/cardDetail";
import TrackedApplyLink from "@/components/TrackedApplyLink";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import FinlyRebateBadge from "@/components/FinlyRebateBadge";
import { CARDS } from "@/lib/cards";

// ISR: Supabase card_catalog edits go live within ~5 min, no redeploy needed.
export const revalidate = 300;
// Cards added to card_catalog after build render on first visit, then cache.
export const dynamicParams = true;

export async function generateStaticParams() {
  const ids = await getAllCardIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) return { title: "Card not found - ClearFin" };

  const feeText = card.annualFee > 0 ? `$${card.annualFee}/year` : "no annual fee";
  const title = `${card.name} Review (2026) - Rewards, Fees & Perks | ClearFin`;
  const description = `${card.name} from ${card.issuer}: ${feeText}, full earn rates, welcome bonus, fees and benefits. Compare it against every Canadian card on ClearFin.`;

  return {
    title,
    description,
    alternates: { canonical: `/credit-cards/${card.id}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/credit-cards/${card.id}`,
      images: card.img ? [{ url: card.img, alt: card.name }] : undefined,
    },
  };
}

// ---------- formatting helpers ----------

const money = (n: number) => `$${Math.round(n).toLocaleString("en-CA")}`;
const feeMoney = (n: number) =>
  `$${n.toLocaleString("en-CA", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const CAT = [
  { key: "dining", icon: "🍽️", label: "Dining" },
  { key: "grocery", icon: "🛒", label: "Groceries" },
  { key: "gas", icon: "⛽", label: "Gas" },
  { key: "travel", icon: "✈️", label: "Travel" },
  { key: "other", icon: "🛍️", label: "Everything else" },
] as const;

type CardPageIconName =
  | "gift"
  | "credit"
  | "transfer"
  | "plane"
  | "hotel"
  | "shopping"
  | "medical"
  | "clock"
  | "luggage"
  | "home"
  | "shield"
  | "car"
  | "phone"
  | "warranty"
  | "rewards"
  | "wallet"
  | "person"
  | "search"
  | "dining"
  | "streaming"
  | "gas";

const REDEMPTION_ICONS: CardPageIconName[] = ["credit", "transfer", "plane", "hotel", "plane", "gift"];
const INSURANCE_ICONS: CardPageIconName[] = ["medical", "clock", "luggage", "home", "luggage", "shield", "car", "phone", "shopping", "warranty"];
const REVIEW_ICONS: CardPageIconName[] = ["rewards", "wallet", "person", "search"];
const EARNING_ICONS: CardPageIconName[] = ["dining", "streaming", "gas", "shopping", "hotel"];

function earningIconFor(copy: string, index: number): CardPageIconName {
  const value = copy.toLowerCase();
  if (/hotel|accommodation|car rental/.test(value)) return "hotel";
  if (/flight|airline|travel|aeroplan|airport/.test(value)) return "plane";
  if (/restaurant|dining|food|grocery|groceries|café|coffee/.test(value)) return "dining";
  if (/stream|subscription|digital|gaming|entertainment/.test(value)) return "streaming";
  if (/gas|fuel|transit|rideshare|taxi|ev charging/.test(value)) return "gas";
  if (/cash back|purchase|everything|other|retail/.test(value)) return "shopping";
  return EARNING_ICONS[index % EARNING_ICONS.length];
}

function redemptionIconFor(copy: string, index: number): CardPageIconName {
  const value = copy.toLowerCase();
  if (/transfer|convert|partner program/.test(value)) return "transfer";
  if (/hotel|accommodation/.test(value)) return "hotel";
  if (/flight|airline|air canada|travel/.test(value)) return "plane";
  if (/gift|merchandise|amazon|retail/.test(value)) return "gift";
  if (/statement credit|cash back|bill|financial product/.test(value)) return "credit";
  return REDEMPTION_ICONS[index % REDEMPTION_ICONS.length];
}

function protectionIconFor(copy: string, index: number): CardPageIconName {
  const value = copy.toLowerCase();
  if (/medical|health/.test(value)) return "medical";
  if (/delay|interruption|cancellation/.test(value)) return "clock";
  if (/baggage|luggage|trip/.test(value)) return "luggage";
  if (/hotel|burglary|home/.test(value)) return "home";
  if (/rental|vehicle|car/.test(value)) return "car";
  if (/mobile|device|phone/.test(value)) return "phone";
  if (/warranty|assurance/.test(value)) return "warranty";
  if (/purchase|price protection/.test(value)) return "shopping";
  if (/accident|insurance|protection/.test(value)) return "shield";
  return INSURANCE_ICONS[index % INSURANCE_ICONS.length];
}

function benefitIconFor(copy: string, index: number): CardPageIconName {
  const value = copy.toLowerCase();
  if (/lounge|flight|airline|airport|travel/.test(value)) return "plane";
  if (/hotel|accommodation/.test(value)) return "hotel";
  if (/mobile|device|phone|app/.test(value)) return "phone";
  if (/fuel|gas|petro|ev charging/.test(value)) return "gas";
  if (/warranty/.test(value)) return "warranty";
  if (/insurance|protection|security/.test(value)) return "shield";
  if (/statement credit|cash back|rebate|no annual fee|supplementary|additional card/.test(value)) return "wallet";
  if (/offer|experience|ticket|event|concierge/.test(value)) return "gift";
  if (/purchase|shopping|retail/.test(value)) return "shopping";
  return REVIEW_ICONS[index % REVIEW_ICONS.length];
}

function rewardLabel(card: { name: string; description: string; rewardProgram: string | null; rewards: string[]; welcomeBonus: WelcomeBonus | null }): string | null {
  if (card.rewardProgram) return card.rewardProgram;
  const value = `${card.name} ${card.description} ${card.welcomeBonus?.headline ?? ""} ${card.rewards.join(" ")}`.toLowerCase();
  if (/no rewards?|does not (earn|offer) rewards?|without rewards?/.test(value)) return null;
  if (/membership rewards/.test(value)) return "Membership Rewards";
  if (/scene\+/.test(value)) return "Scene+";
  if (/aeroplan/.test(value)) return "Aeroplan";
  if (/avion/.test(value)) return "Avion Rewards";
  if (/bmo rewards/.test(value)) return "BMO Rewards";
  if (/pc optimum/.test(value)) return "PC Optimum";
  if (/cash.?back/.test(value)) return "Cash back";
  if (/points?|rewards?/.test(value)) return "Card rewards";
  return null;
}

const CARD_PAGE_ICON_ASSETS: Record<CardPageIconName, string> = {
  gift: "/icons/fluent-3d/gift.png",
  credit: "/icons/fluent-3d/credit.png",
  transfer: "/icons/fluent-3d/transfer.png",
  plane: "/icons/fluent-3d/plane.png",
  hotel: "/icons/fluent-3d/hotel.png",
  shopping: "/icons/fluent-3d/shopping.png",
  medical: "/icons/fluent-3d/medical.png",
  clock: "/icons/fluent-3d/clock.png",
  luggage: "/icons/fluent-3d/luggage.png",
  home: "/icons/fluent-3d/home.png",
  shield: "/icons/fluent-3d/shield.png",
  car: "/icons/fluent-3d/car.png",
  phone: "/icons/fluent-3d/phone.png",
  warranty: "/icons/fluent-3d/warranty.png",
  rewards: "/icons/fluent-3d/rewards.png",
  wallet: "/icons/fluent-3d/wallet.png",
  person: "/icons/fluent-3d/person.png",
  search: "/icons/fluent-3d/search.png",
  dining: "/icons/fluent-3d/dining.png",
  streaming: "/icons/fluent-3d/streaming.png",
  gas: "/icons/fluent-3d/gas.png",
};

function CardPageIcon({ name }: { name: CardPageIconName }) {
  return (
    <Image
      className="cardpg-3d-icon"
      src={CARD_PAGE_ICON_ASSETS[name]}
      alt=""
      width={48}
      height={48}
      aria-hidden="true"
    />
  );
}

// Pull a points figure out of a welcome headline, e.g. "Up to 150,000 Aeroplan points" → 150000.
function parsePoints(s?: string): number | null {
  if (!s) return null;
  const m = s.replace(/,/g, "").match(/(\d{4,})/);
  return m ? Number(m[1]) : null;
}

// Standard credit tiers; tiers light up from the card's minimum upward (see buildCreditTiers).
const CREDIT_TIERS = [
  { label: "Poor", min: 300, color: "#cf554c" },
  { label: "Fair", min: 560, color: "#d98520" },
  { label: "Good", min: 660, color: "#2873d3" },
  { label: "Very Good", min: 725, color: "#4f8a47" },
  { label: "Excellent", min: 760, color: "#313a68" },
] as const;

// Offer freshness is evaluated against the catalogue audit date. Keeping this
// deterministic avoids a page changing between React renders; the date moves
// forward with each issuer-research pass.
const OFFER_AUDIT_TIMESTAMP = Date.parse("2026-08-09T00:00:00Z");

function buildCreditTiers(min: number) {
  return CREDIT_TIERS.map((t, i) => {
    const upper = CREDIT_TIERS[i + 1]?.min ?? 900;
    // The minimum is the bar: light the tier it lands in and every tier above it.
    // Meeting the minimum qualifies, and a higher score is always fine.
    return { ...t, active: upper > min };
  });
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();
  const currentStatic = CARDS.find((candidate) => candidate.id === id || candidate.name === card.name);
  const isCobaltCard = currentStatic?.id === "cobalt";
  const isCreditBuilder = /secured|guaranteed|credit builder|credit-building|rebuild/i.test(`${card.name} ${card.description}`);

  const wb = card.welcomeBonus;
  // Some cards encode "no offer" as a headline like "No traditional welcome bonus".
  // Treat those as having no welcome so we don't render awkward "earn no bonus" copy.
  const wbHeadline = wb?.headline ?? "";
  const wbIsNone = /^no\b/i.test(wbHeadline) && /\b(welcome|bonus)\b/i.test(wbHeadline);
  const offerEnd = wb?.offer_end_date ? Date.parse(wb.offer_end_date) : Number.NaN;
  const wbIsExpired = Number.isFinite(offerEnd) && offerEnd < OFFER_AUDIT_TIMESTAMP;
  const hasWelcome =
    !!wb && !wbIsNone && !wbIsExpired && (!!wb.headline || (wb.stages?.length ?? 0) > 0);
  const welcomeValue =
    typeof wb?.estimated_value_cad === "number" && wb.estimated_value_cad > 0
      ? money(wb.estimated_value_cad)
      : null;

  // Welcome value: use the stated CAD value, else derive it from points × point value.
  const welcomePts = parsePoints(wb?.headline);
  const welcomeCad =
    typeof wb?.estimated_value_cad === "number" && wb.estimated_value_cad > 0
      ? wb.estimated_value_cad
      : welcomePts && card.pointValueCpp
        ? Math.round((welcomePts * card.pointValueCpp) / 100)
        : null;

  // If the headline already states a dollar amount (e.g. cashback "$125 cash back"),
  // appending the same value reads as redundant — only add it when it's new info (points cards).
  const headlineHasDollar = /\$\s?\d/.test(wbHeadline);

  // Hero lede: lead with the welcome hook plus its dollar value (new info, not a label restated).
  const heroLede = (() => {
    if (hasWelcome && wb?.headline) {
      const h = wb.headline.charAt(0).toLowerCase() + wb.headline.slice(1);
      return welcomeCad && !headlineHasDollar
        ? `Start with ${h}, worth about ${money(welcomeCad)}.`
        : `Start with ${h}.`;
    }
    if (isCreditBuilder)
      return `Review the fees, eligibility, and credit-building features for the ${card.name}.`;
    return `Full earn rates, fees and benefits for the ${card.name}.`;
  })();

  // Hero spec strip: the card's economics at a glance. Each stat only renders if we have the data.
  const heroStats: { label: string; value: string; sub?: string }[] = [
    {
      label: "Annual fee",
      value: card.annualFee > 0 ? feeMoney(card.annualFee) : "$0",
      sub: card.firstYearFree ? "First year free" : undefined,
    },
  ];
  const rewardProgram = rewardLabel(card);
  if (rewardProgram) heroStats.push({ label: "Reward type", value: rewardProgram });
  else if (isCreditBuilder) heroStats.push({ label: "Card type", value: "Credit builder" });
  else heroStats.push({ label: "Card type", value: /low interest|low rate/i.test(`${card.badge} ${card.description}`) ? "Low interest" : "Credit card" });
  if (hasWelcome)
    heroStats.push({
      label: "Welcome offer",
      value: welcomePts
        ? `${welcomePts.toLocaleString("en-CA")} pts`
        : welcomeValue ?? "Available",
      sub: "Current new-cardmember offer",
    });
  else heroStats.push({
    label: "Welcome offer",
    value: wbIsExpired ? "Previous offer ended" : "Not currently verified",
    sub: wbIsExpired ? "Check the issuer for a replacement offer" : "Offers can change without notice",
  });
  if (card.insurance.length > 0)
    heroStats.push({ label: "Insurance", value: `${card.insurance.length} coverages`, sub: "Certificate terms apply" });
  else heroStats.push({ label: "Insurance", value: "Not listed", sub: "Confirm with the issuer" });

  // Credit score gauge: built from the minimum (the approval threshold).
  const csr = card.creditScore?.estimated_credit_score_range;
  const creditTiers =
    csr && typeof csr.min === "number" ? buildCreditTiers(csr.min) : null;

  // Plain-language summary of the welcome bonus.
  const wbHeadlineInline = wb?.headline
    ? wb.headline.charAt(0).toLowerCase() + wb.headline.slice(1)
    : null;
  const wbSummary = (() => {
    if (wbHeadlineInline && welcomeValue && !headlineHasDollar)
      return `New cardmembers can earn ${wbHeadlineInline}, worth roughly ${welcomeValue}, by completing the steps below.`;
    if (wbHeadlineInline)
      return `New cardmembers can earn ${wbHeadlineInline} by completing the steps below.`;
    if (welcomeValue)
      return `New cardmembers can unlock a welcome bonus worth roughly ${welcomeValue} by completing the steps below.`;
    return null;
  })();
  const welcomeHeadlineParts = wbHeadline.split(/\s+[—–]\s+/).filter(Boolean);
  const welcomePrimary = welcomeHeadlineParts[0] || "Welcome offer available";
  const welcomeSecondary = welcomeHeadlineParts.slice(1).join(" — ") ||
    (welcomeValue && !headlineHasDollar ? `Estimated value: ${welcomeValue}` : null);

  const strongestRate = CAT.reduce((best, category) =>
    card.rates[category.key] > card.rates[best.key] ? category : best
  );
  const strongestRateValue = card.rates[strongestRate.key];
  const economics: { label: string; value: string; note?: string }[] = [
    { label: "Annual fee", value: card.annualFee > 0 ? feeMoney(card.annualFee) : "$0", note: isCobaltCard ? "$15.99 billed monthly (yearly in Quebec)" : card.firstYearFree ? "First year free" : undefined },
    { label: "Purchase interest", value: card.purchaseApr !== null ? `${card.purchaseApr}%` : "Confirm", note: card.purchaseApr === null ? "Check current issuer rate" : undefined },
    { label: "Cash advance interest", value: card.cashAdvanceApr !== null ? `${card.cashAdvanceApr}%` : "Confirm", note: card.cashAdvanceApr === null ? "Check current issuer rate" : undefined },
    { label: "Foreign transaction fee", value: card.fxFee !== null ? `${card.fxFee}%` : "Confirm", note: card.fxFee === null ? "Check current issuer fee" : undefined },
    { label: "Income requirement", value: card.minIncomePersonal !== null ? money(card.minIncomePersonal) : "Not stated", note: "Issuer approval criteria apply" },
  ];
  if (card.balanceTransferApr !== null) economics.push({ label: "Balance transfer interest", value: `${card.balanceTransferApr}%` });
  if (card.additionalCardFee !== null) economics.push({ label: "Additional card", value: card.additionalCardFee === 0 ? "$0" : money(card.additionalCardFee) });
  if (card.minIncomeHousehold !== null) economics.push({ label: "Household income", value: money(card.minIncomeHousehold), note: "Alternative minimum" });

  const verdictPros = card.pros.length > 0 ? card.pros : [
    card.annualFee === 0 ? "No annual fee to offset" : `Strongest rewards may help offset the ${feeMoney(card.annualFee)} annual fee`,
    strongestRateValue > 0 ? `Up to ${(strongestRateValue * 100).toFixed(strongestRateValue < .01 ? 2 : 1)}% in its strongest spending category` : "Can support credit-building goals when used responsibly",
    ...(card.benefits[0]?.title ? [card.benefits[0].title] : []),
  ];
  const verdictCons = card.cons.length > 0 ? card.cons : [
    card.annualFee > 0 ? `${feeMoney(card.annualFee)} annual fee` : "Lower rewards outside its strongest categories may apply",
    card.fxFee !== null && card.fxFee > 0 ? `${card.fxFee}% foreign transaction fee` : "Rates, offers, and approval criteria can change",
  ];

  const quickLinks = [
    { href: "#welcome-offer", label: "Welcome offer" },
    { href: "#earning", label: card.rewards.length > 0 || strongestRateValue > 0 ? "How you earn" : "Rewards" },
    { href: "#redemptions", label: "Redemptions" },
    { href: "#fees-eligibility", label: "Fees & eligibility" },
    { href: "#benefits", label: "Benefits" },
    { href: "#insurance", label: "Insurance" },
    { href: "#verdict", label: "Verdict" },
    { href: "#detailed-review", label: "Detailed review" },
    { href: "#alternatives", label: "Alternatives" },
  ];

  const rankedCategories = CAT
    .map((category) => ({ ...category, rate: card.rates[category.key] }))
    .sort((a, b) => b.rate - a.rate);
  const baseRate = card.rates.other;
  const annualBreakEven = card.annualFee > 0 && strongestRateValue > 0
    ? Math.ceil(card.annualFee / strongestRateValue / 50) * 50
    : null;
  const alternatives = CARDS
    .filter((candidate) => candidate.id !== currentStatic?.id)
    .map((candidate) => ({
      ...candidate,
      affinity:
        (candidate.issuer === card.issuer ? 1000 : 0) +
        (candidate.rates[strongestRate.key] * 500) -
        Math.abs(candidate.annualFee - card.annualFee),
    }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, 3);

  return (
    <div className="cardpg cardpg-pilot">
      <Nav />

      <main className="cardpg-main">
        {/* ── Breadcrumb ── */}
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="seo-breadcrumb-sep" aria-hidden="true">
            {" "}›{" "}
          </span>
          <Link href="/credit-cards">All cards</Link>
          <span className="seo-breadcrumb-sep" aria-hidden="true">
            {" "}›{" "}
          </span>
          <span aria-current="page">{card.name}</span>
        </nav>

        {/* ── Hero: copy left, card right ── */}
        <header className="cardpg-hero">
          <div className="cardpg-hero-copy">
            <p className="cardpg-eyebrow">
              Independent ClearFin review · {card.issuer}
              {card.network ? ` · ${card.network}` : ""}
            </p>
            <h1 className="cardpg-title">{card.name}</h1>
            <p className="cardpg-lede">{heroLede}</p>
            <div className="cardpg-hero-actions">
              {card.bankUrl ? (
                <TrackedApplyLink cardId={card.id} href={card.bankUrl} issuer={card.issuer} />
              ) : null}
              <Link href="/credit-card-calculator-canada" className="cardpg-cta-secondary">
                Calculate my rewards
              </Link>
            </div>
            <div className="cardpg-trustline">
              <span>Independent comparison</span>
              <span>Fees included</span>
              <span>Canadian card data</span>
            </div>

            <dl className="cardpg-hero-stats">
              {heroStats.map((s) => (
                <div className="cardpg-stat" key={s.label}>
                  <dt className="cardpg-stat-label">{s.label}</dt>
                  <dd className="cardpg-stat-value">{s.value}</dd>
                  {s.sub ? <p className="cardpg-stat-sub">{s.sub}</p> : null}
                </div>
              ))}
            </dl>
          </div>

          <div className="cardpg-hero-media">
            <FinlyRebateBadge
              cardId={card.id}
              applicationUrl={card.bankUrl}
              className="finly-rebate-badge-detail"
            />
            {card.img ? (
              <Image
                src={card.img}
                alt={card.name}
                width={440}
                height={277}
                priority
                className="cardpg-hero-img"
              />
            ) : null}
            {card.badge ? <span className="cardpg-badge">{card.badge}</span> : null}
          </div>
        </header>

        <div className="cardpg-editorial">
          <article className="cardpg-bottomline">
            <div className="cardpg-bottomline-kicker">The ClearFin bottom line</div>
            <h2>{card.badge || `${card.issuer} credit card`}</h2>
            <p>
              {card.editorialSummary ? `${card.editorialSummary} ` : ""}
              {strongestRateValue > 0
                ? `Its strongest published earn rate in our data is ${(strongestRateValue * 100).toFixed(strongestRateValue < .01 ? 2 : 1)}% on ${strongestRate.label.toLowerCase()}. `
                : "This card is designed primarily for access to credit rather than rewards. "}
              {card.annualFee > 0
                ? `The ${feeMoney(card.annualFee)} annual fee should be weighed against the rewards and benefits you expect to use.`
                : "With no annual fee, it can be easier to keep long term without needing rewards to offset a yearly cost."}
            </p>
            {card.reviewedAt ? (
              <small className="cardpg-reviewed">
                Checked {card.reviewedAt} · {card.researchLevel === "certificate"
                  ? "Product page and insurance certificate"
                  : card.researchLevel === "product-page"
                    ? "Official product page"
                    : "Official issuer catalogue"}
              </small>
            ) : null}
          </article>
          <nav className="cardpg-onpage" aria-label="On this page">
            <span>On this page</span>
            <div>{quickLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</div>
          </nav>
        </div>

        {/* ── Body: single-column content ── */}
        <div className="cardpg-body">
          <div className="cardpg-content">
            <div className="cardpg-split">
            {/* ── Welcome bonus (promoted) ── */}
            <article className="cardpg-block" id="welcome-offer">
              <div className="cardpg-icon-heading">
                <span data-icon="gift"><CardPageIcon name="gift" /></span>
                <h2 className="cardpg-h2">Welcome bonus</h2>
              </div>
              {hasWelcome ? (
                <>
                <div className="cardpg-welcome-compact">
                  <strong>{welcomePrimary}</strong>
                  {welcomeSecondary ? <span>{welcomeSecondary}</span> : null}
                </div>
                {(wb?.stages?.length ?? 0) > 0 ? (
                  <div className="cardpg-welcome-steps">
                    <p className="cardpg-sublabel">How to earn it</p>
                    <ul className="cardpg-wb-steps">
                      {wb!.stages!.map((stage, i) => (
                        <li className="cardpg-wb-step" key={`${stage.reward}-${i}`}>
                          <span className="cardpg-wb-reward">{stage.reward}</span>
                          <span className="cardpg-wb-req">{stage.requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : wbSummary ? <p className="cardpg-welcome-requirement">{wbSummary}</p> : null}
                {wb?.offer_end_date ? <p className="cardpg-offer-end">Offer ends {wb.offer_end_date}</p> : null}
                {wb?.eligibility ? (
                  <details className="cardpg-offer-terms">
                    <summary>Offer details</summary>
                    <p>{wb.eligibility}</p>
                  </details>
                ) : null}
                </>
              ) : (
                <div className="cardpg-data-note">
                  <strong>{wbIsExpired ? "The previously recorded welcome offer has ended." : "No current welcome offer is verified in ClearFin's catalogue."}</strong>
                  <p>{wbIsExpired ? "ClearFin has hidden the expired terms. Check the issuer page for any replacement offer." : "Issuer promotions change frequently. Check the card's official page before applying."}</p>
                </div>
              )}
            </article>

            <div className="cardpg-split-rule" aria-hidden="true" />

            {/* ── How you earn ── */}
            {card.rewards.length > 0 ? (
              <article className="cardpg-block" id="earning">
                <h2 className="cardpg-h2">How you earn</h2>
                <ul className="cardpg-rewards">
                  {card.rewards.map((r, index) => (
                    <li className="cardpg-reward" key={r}>
                      <span className="cardpg-reward-icon" data-icon={earningIconFor(r, index)}><CardPageIcon name={earningIconFor(r, index)} /></span>
                      <span className="cardpg-reward-copy">{r}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ) : strongestRateValue > 0 ? (
              <article className="cardpg-block" id="earning">
                <h2 className="cardpg-h2">How you earn</h2>
                <div className="cardpg-rate-grid">
                  {CAT.map((c) => (
                    <div className="cardpg-rate" key={c.key}>
                      <span className="cardpg-rate-icon" aria-hidden="true">
                        {c.icon}
                      </span>
                      <span className="cardpg-rate-cat">{c.label}</span>
                      <span className="cardpg-rate-val">
                        {(card.rates[c.key] * 100).toFixed(card.rates[c.key] < 0.01 ? 2 : 1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ) : (
              <article className="cardpg-block cardpg-no-rewards" id="earning">
                <span data-icon="shield"><CardPageIcon name="shield" /></span>
                <div>
                  <p className="cardpg-sublabel">Rewards position</p>
                  <h2 className="cardpg-h2">Built for credit—not points</h2>
                  <p className="cardpg-intro">This product does not currently list purchase rewards in ClearFin&apos;s catalogue. Its value is access to credit and responsible account management rather than points or cash back.</p>
                </div>
              </article>
            )}
            </div>
          </div>
        </div>

        {/* ── Full-width detail: perks + verdict ── */}
        <div className="cardpg-wide">
          <article className="cardpg-block" id="fees-eligibility">
              <div className="cardpg-section-head">
                <div><span>Costs and requirements</span><h2 className="cardpg-h2">Fees &amp; eligibility</h2></div>
                <p>Confirm final approval criteria and current rates directly with the issuer.</p>
              </div>
              <div className="cardpg-economics">
                {economics.map((item) => (
                  <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong>{item.note ? <small>{item.note}</small> : null}</div>
                ))}
              </div>
              {creditTiers && csr ? (
                <div className="cardpg-credit-panel">
                  <div className="cardpg-credit-head">
                    <div><span>Recommended credit score</span><strong>{csr.min}+ <small>{csr.range_label || "estimated"}</small></strong></div>
                    <p>{card.creditScore?.description || "ClearFin's estimated recommendation for this product."}</p>
                  </div>
                  <div className="cardpg-credit-scale" role="img" aria-label={`ClearFin estimated recommended credit score ${csr.min} and above`}>
                    {creditTiers.map((tier) => (
                      <div className={`cardpg-credit-band${tier.active ? " is-recommended" : ""}`} key={tier.label} style={{ "--tier": tier.color } as CSSProperties}>
                        <span>{tier.min}{tier.active && tier.min === csr.min ? "+" : ""}</span>
                        <i />
                        <strong>{tier.label}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="cardpg-credit-note">
                    ClearFin estimate on Canada&apos;s 300–900 scale. This is not an issuer cutoff or approval guarantee; lenders may use different bureau scores and underwriting criteria. {card.creditScore?.note}
                  </p>
                </div>
              ) : null}
              {card.earnCaps?.notes ? <p className="cardpg-capnote"><strong>Reward limits:</strong> {card.earnCaps.notes}</p> : null}
              {(card.earnCaps?.reward_caps?.length ?? 0) > 0 ? (
                <div className="cardpg-caps">{card.earnCaps!.reward_caps!.map((cap, index) => <p key={`${cap.type}-${index}`}><strong>{cap.type || "Earning cap"}</strong><span>{cap.description}</span></p>)}</div>
              ) : null}
          </article>

          <article className="cardpg-block" id="redemptions">
            <div className="cardpg-section-head">
              <div><span>Using your rewards</span><h2 className="cardpg-h2">Redemption options</h2></div>
              <p>Redemption values and availability may vary by option and can change.</p>
            </div>
            {card.redemptions.length > 0 ? (
              <div className="cardpg-redemptions">
                {card.redemptions.map((redemption, index) => {
                  const icon = redemptionIconFor(redemption, index);
                  return <div key={redemption}><span data-icon={icon}><CardPageIcon name={icon} /></span><p>{redemption}</p></div>;
                })}
              </div>
            ) : (
              <div className="cardpg-data-note">
                <strong>No redemption program is verified for this card.</strong>
                <p>Confirm whether the product earns points or cash back on the issuer&apos;s current page.</p>
              </div>
            )}
          </article>

          {/* ── Perks & coverage: first 8 (two rows) shown, rest behind a toggle ── */}
          <article className="cardpg-block" id="benefits">
            <div className="cardpg-section-head">
              <div>
                <span>Beyond the points</span>
                <h2 className="cardpg-h2">Benefits that come with the card</h2>
              </div>
              <p>Consider these extras by the value they add to purchases and experiences you already use.</p>
            </div>
            {card.benefits.length > 0 ? (
              <>
              <div className="cardpg-perks">
                {card.benefits.slice(0, 8).map((b, index) => (
                  <div className="cardpg-perk" key={b.title}>
                    <span className="cardpg-perk-icon" data-icon={benefitIconFor(`${b.title} ${b.description}`, index)}><CardPageIcon name={benefitIconFor(`${b.title} ${b.description}`, index)} /></span>
                    <div>
                      <p className="cardpg-perk-title">{b.title}</p>
                      {b.description ? <p className="cardpg-perk-body">{b.description}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
              {card.benefits.length > 8 ? (
                <details className="cardpg-perks-disc">
                  <summary className="cardpg-perks-toggle">
                    <span className="cardpg-perks-toggle-more">
                      Show all {card.benefits.length} benefits
                    </span>
                    <span className="cardpg-perks-toggle-less">Show fewer</span>
                  </summary>
                  <div className="cardpg-perks cardpg-perks-extra">
                    {card.benefits.slice(8).map((b, index) => (
                      <div className="cardpg-perk" key={b.title}>
                        <span className="cardpg-perk-icon" data-icon={benefitIconFor(`${b.title} ${b.description}`, index + 8)}><CardPageIcon name={benefitIconFor(`${b.title} ${b.description}`, index + 8)} /></span>
                        <div>
                          <p className="cardpg-perk-title">{b.title}</p>
                          {b.description ? (
                            <p className="cardpg-perk-body">{b.description}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
              </>
            ) : (
              <div className="cardpg-data-note">
                <strong>No additional benefit is verified in ClearFin&apos;s catalogue.</strong>
                <p>Network and issuer benefits can change. Review the issuer&apos;s benefit guide before applying.</p>
              </div>
            )}
          </article>

          <article className="cardpg-block cardpg-insurance-block" id="insurance">
            <div className="cardpg-section-head">
              <div>
                <span>Protection included</span>
                <h2 className="cardpg-h2">Insurance at a glance</h2>
              </div>
              <p>{card.insurance.length > 0 ? `${card.insurance.length} coverage${card.insurance.length === 1 ? "" : "s"} listed. Key terms are summarized below; full certificate terms apply.` : "No included coverage is verified in ClearFin's current catalogue."}</p>
            </div>
            {card.insurance.length > 0 ? (
              <>
              <div className="cardpg-insurance-grid">
                {card.insurance.map((item, index) => {
                  const icon = protectionIconFor(`${item.title} ${item.description}`, index);
                  return <div className="cardpg-insurance-item" key={item.title}>
                    <span data-icon={icon}><CardPageIcon name={icon} /></span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>;
                })}
              </div>
              <div className="cardpg-policy-note">
                <p>
                  Coverage is subject to eligibility, exclusions, limits, payment requirements, and claim rules in the insurance certificate.
                </p>
                {card.insuranceSourceUrl ? (
                  <a href={card.insuranceSourceUrl} target="_blank" rel="noopener noreferrer">
                    Review official insurance details ↗
                  </a>
                ) : null}
              </div>
              </>
            ) : (
              <div className="cardpg-data-note">
                <strong>Insurance is not currently listed for this product.</strong>
                <p>This does not prove that coverage is unavailable. Confirm the issuer&apos;s current certificate and benefit guide before relying on protection.</p>
                {card.sourceUrl ? <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer">Check the official card page ↗</a> : null}
              </div>
            )}
          </article>

          {/* ── Pros & cons ── */}
          <article className="cardpg-block" id="verdict">
              <h2 className="cardpg-h2">The verdict</h2>
              <div className="cardpg-proscons">
                  <div className="cardpg-pros">
                    <p className="cardpg-pc-head">What we like</p>
                    <ul>
                      {verdictPros.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cardpg-cons">
                    <p className="cardpg-pc-head">Worth noting</p>
                    <ul>
                      {verdictCons.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
              </div>
          </article>

          <article className="cardpg-block cardpg-review" id="detailed-review">
            <div className="cardpg-section-head">
              <div><span>ClearFin analysis</span><h2 className="cardpg-h2">Our detailed review</h2></div>
              <p>A practical reading of where the card earns, what the fee buys, and which limits matter.</p>
            </div>
            <div className="cardpg-review-lede">
              <strong>{card.badge || card.name}</strong>
              <p>{card.editorialSummary || card.description || `${card.name} is a ${card.issuer} card with ${card.annualFee > 0 ? `a ${feeMoney(card.annualFee)} annual fee` : "no annual fee"}.`}</p>
            </div>
            <div className="cardpg-review-grid">
              <article>
                <span data-icon={REVIEW_ICONS[0]}><CardPageIcon name={REVIEW_ICONS[0]} /></span>
                <div><h3>How the rewards work</h3><p>
                  {strongestRateValue > 0
                    ? `${rankedCategories.filter((category) => category.rate === strongestRateValue).map((category) => category.label).join(", ")} receive the strongest estimated return at ${(strongestRateValue * 100).toFixed(strongestRateValue < .01 ? 2 : 1)}%. ${baseRate > 0 ? `Purchases outside the accelerated categories earn an estimated ${(baseRate * 100).toFixed(baseRate < .01 ? 2 : 1)}%.` : "Purchases outside rewarded categories may not earn additional value."}`
                    : "This card does not currently list a rewards return in ClearFin's catalogue. Its value is primarily tied to credit access and account management rather than points or cash back."}
                </p></div>
              </article>
              <article>
                <span data-icon={REVIEW_ICONS[1]}><CardPageIcon name={REVIEW_ICONS[1]} /></span>
                <div><h3>What the annual cost means</h3><p>
                  {card.annualFee === 0
                    ? "There is no annual fee to recover, which can make the card easier to keep for credit-history length or occasional use. Interest and other transaction fees can still apply."
                    : annualBreakEven
                      ? `Using the strongest estimated category return alone, roughly ${money(annualBreakEven)} in annual spending at that rate would equal the ${feeMoney(card.annualFee)} fee before considering the value of insurance, partner benefits, or a welcome offer.`
                      : `The ${feeMoney(card.annualFee)} annual fee should be justified primarily by benefits you will actually use.`}
                </p></div>
              </article>
              <article>
                <span data-icon={REVIEW_ICONS[2]}><CardPageIcon name={REVIEW_ICONS[2]} /></span>
                <div><h3>Who it may suit</h3><p>
                  {strongestRateValue > 0
                    ? `This card is most relevant for someone who spends consistently on ${rankedCategories.slice(0, 2).map((category) => category.label.toLowerCase()).join(" and ")}${card.annualFee === 0 ? " and prefers to avoid a yearly fee" : " and can use enough of the included value to justify the yearly cost"}.`
                    : "It may suit someone prioritizing access to credit or rebuilding history, provided the issuer's approval terms and any security-deposit requirements fit their situation."}
                </p></div>
              </article>
              <article>
                <span data-icon={REVIEW_ICONS[3]}><CardPageIcon name={REVIEW_ICONS[3]} /></span>
                <div><h3>What to examine before applying</h3><p>
                  Compare the purchase interest rate, foreign-transaction fee, approval requirements, reward limits, and insurance certificates. Pay particular attention to merchant-category rules because a store may not receive the reward rate its products appear to suggest.
                </p></div>
              </article>
            </div>
          </article>

          <article className="cardpg-block" id="alternatives">
            <div className="cardpg-section-head">
              <div><span>Other cards to examine</span><h2 className="cardpg-h2">Compare your alternatives</h2></div>
              <Link href="/credit-cards">Browse all {CARDS.length} cards →</Link>
            </div>
            <div className="cardpg-alternatives">
              {alternatives.map((alternative) => {
                const alternativeBest = Math.max(...Object.values(alternative.rates));
                return (
                  <Link href={`/credit-cards/${alternative.id}`} key={alternative.id}>
                    <span>{alternative.issuer}</span>
                    <div className="cardpg-alternative-title">
                      <Image src={alternative.img} alt="" width={78} height={49} />
                      <h3>{alternative.name}</h3>
                    </div>
                    <p>{alternative.badge}</p>
                    <div><small>Annual fee</small><strong>{alternative.annualFee === 0 ? "$0" : feeMoney(alternative.annualFee)}</strong></div>
                    <div><small>Strongest rate</small><strong>{(alternativeBest * 100).toFixed(alternativeBest < .01 ? 2 : 1)}%</strong></div>
                    <em>View review →</em>
                  </Link>
                );
              })}
            </div>
          </article>
        </div>

        {/* ── Disclosure ── */}
        <p className="cardpg-disclosure">
          Issuer terms apply. ClearFin is not affiliated with this provider.{" "}
          <Link href="/disclosures">How we make money</Link>.
          {card.sourceUrl ? card.reviewedAt
            ? <> Card facts were checked against the <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer">issuer&apos;s official source</a>.{card.researchNote ? ` ${card.researchNote}` : ""}</>
            : <> Confirm current terms on the <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer">issuer&apos;s official page</a>.</>
          : null}
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

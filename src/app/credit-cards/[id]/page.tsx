import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCard, getAllCardIds } from "@/lib/cardDetail";
import TrackedApplyLink from "@/components/TrackedApplyLink";
import SearchTrigger from "@/components/SearchTrigger";
import Logo from "@/components/Logo";

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

const CAT = [
  { key: "dining", icon: "🍽️", label: "Dining" },
  { key: "grocery", icon: "🛒", label: "Groceries" },
  { key: "gas", icon: "⛽", label: "Gas" },
  { key: "travel", icon: "✈️", label: "Travel" },
  { key: "other", icon: "🛍️", label: "Everything else" },
] as const;

// Pull a points figure out of a welcome headline, e.g. "Up to 150,000 Aeroplan points" → 150000.
function parsePoints(s?: string): number | null {
  if (!s) return null;
  const m = s.replace(/,/g, "").match(/(\d{4,})/);
  return m ? Number(m[1]) : null;
}

// Standard credit tiers; tiers light up from the card's minimum upward (see buildCreditTiers).
const CREDIT_TIERS = [
  { label: "Poor", min: 300, color: "#E5675C" },
  { label: "Fair", min: 640, color: "#E6A24E" },
  { label: "Good", min: 720, color: "#6FA8DC" },
  { label: "Very Good", min: 760, color: "#67C281" },
  { label: "Excellent", min: 800, color: "#7E8BE6" },
] as const;

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

  const wb = card.welcomeBonus;
  // Some cards encode "no offer" as a headline like "No traditional welcome bonus".
  // Treat those as having no welcome so we don't render awkward "earn no bonus" copy.
  const wbHeadline = wb?.headline ?? "";
  const wbIsNone = /^no\b/i.test(wbHeadline) && /\b(welcome|bonus)\b/i.test(wbHeadline);
  const hasWelcome =
    !!wb && !wbIsNone && (!!wb.headline || (wb.stages?.length ?? 0) > 0);
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
    return `Full earn rates, fees and benefits for the ${card.name}.`;
  })();

  // Hero spec strip: the card's economics at a glance. Each stat only renders if we have the data.
  const heroStats: { label: string; value: string; sub?: string; className?: string }[] = [
    {
      label: "Annual fee",
      value: card.annualFee > 0 ? money(card.annualFee) : "$0",
      sub: card.feeNote ?? (card.firstYearFree ? "First year free" : undefined),
    },
  ];
  if (card.rewardProgram)
    heroStats.push({ label: "Reward type", value: card.rewardProgram, className: "cardpg-stat-reward" });
  if (card.pointValueCpp)
    heroStats.push({ label: "Point value", value: `${card.pointValueCpp}¢`, sub: "per point" });

  // Income requirement: many premium cards (World Elite, Infinite Privilege) gate on a
  // minimum stated income. Show it only when the catalog has it; lead with the personal
  // figure and fold the household figure into the sub-line.
  if (card.minIncomePersonal || card.minIncomeHousehold) {
    heroStats.push({
      label: "Income required",
      value: money(card.minIncomePersonal ?? card.minIncomeHousehold!),
      sub:
        card.minIncomePersonal && card.minIncomeHousehold
          ? `personal · or ${money(card.minIncomeHousehold)} household`
          : card.minIncomePersonal
            ? "personal"
            : "household",
    });
  }

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

  return (
    <div className="cardpg">
      {/* ── Nav (shared with SEO pages) ── */}
      <header className="seo-nav">
        <Logo />
        <div className="seo-nav-right">
          <SearchTrigger className="nav-search" />
          <Link href="/#tool" className="seo-nav-cta">
            Find Your Card
          </Link>
        </div>
      </header>

      <main className="cardpg-main">
        {/* ── Breadcrumb ── */}
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="seo-breadcrumb-sep" aria-hidden="true">
            {" "}›{" "}
          </span>
          <Link href="/best-credit-cards-canada">Cards</Link>
          <span className="seo-breadcrumb-sep" aria-hidden="true">
            {" "}›{" "}
          </span>
          <span aria-current="page">{card.name}</span>
        </nav>

        {/* ── Hero: copy left, card right ── */}
        <header className="cardpg-hero">
          <div className="cardpg-hero-copy">
            <p className="cardpg-eyebrow">
              {card.issuer}
              {card.network ? ` · ${card.network}` : ""}
            </p>
            <h1 className="cardpg-title">{card.name}</h1>
            <p className="cardpg-lede">{heroLede}</p>
            <div className="cardpg-hero-actions">
              {card.bankUrl ? (
                <TrackedApplyLink cardId={card.id} href={card.bankUrl} issuer={card.issuer} />
              ) : null}
              <Link href="/#tool" className="cardpg-cta-secondary">
                Calculate my rewards
              </Link>
            </div>

            <dl className="cardpg-hero-stats">
              {heroStats.map((s) => (
                <div className={`cardpg-stat${s.className ? ` ${s.className}` : ""}`} key={s.label}>
                  <dt className="cardpg-stat-label">{s.label}</dt>
                  <dd className="cardpg-stat-value">{s.value}</dd>
                  {s.sub ? <p className="cardpg-stat-sub">{s.sub}</p> : null}
                </div>
              ))}
              {creditTiers ? (
                <div className="cardpg-stat cardpg-stat-credit">
                  <dt className="cardpg-stat-label">
                    Typical credit{` · ${csr!.min}+`}
                  </dt>
                  <dd
                    className="cardpg-scorebar cardpg-scorebar-mini"
                    role="img"
                    aria-label={`Typical approval credit ${csr!.min} and above${
                      csr!.range_label ? `, ${csr!.range_label}` : ""
                    }`}
                  >
                    {creditTiers.map((t) => (
                      <div
                        className={`cardpg-tier${t.active ? " is-active" : ""}`}
                        key={t.label}
                        style={{ "--tier": t.color } as CSSProperties}
                      >
                        <span className="cardpg-tier-bar" aria-hidden="true" />
                        <span className="cardpg-tier-score">{t.min}+</span>
                        <span className="cardpg-tier-label">{t.label}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="cardpg-hero-media">
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

        {/* ── Body: single-column content ── */}
        <div className="cardpg-body">
          <div className="cardpg-content">
            <div className="cardpg-split">
            {/* ── Welcome bonus (promoted) ── */}
            {hasWelcome ? (
              <article className="cardpg-block">
                <h2 className="cardpg-h2">Welcome bonus</h2>
                {wbSummary ? <p className="cardpg-intro">{wbSummary}</p> : null}
                {(wb?.stages?.length ?? 0) > 0 ? (
                  <>
                    <p className="cardpg-sublabel">How to earn it</p>
                    <ul className="cardpg-wb-steps">
                      {wb!.stages!.map((stage, i) => (
                        <li className="cardpg-wb-step" key={i}>
                          <span className="cardpg-wb-reward">{stage.reward}</span>
                          <span className="cardpg-wb-req">{stage.requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {wb?.eligibility ? <p className="cardpg-fineprint">{wb.eligibility}</p> : null}
                {wb?.offer_end_date ? (
                  <p className="cardpg-fineprint">Offer ends {wb.offer_end_date}.</p>
                ) : null}
              </article>
            ) : null}

            {hasWelcome ? <div className="cardpg-split-rule" aria-hidden="true" /> : null}

            {/* ── How you earn ── */}
            {card.rewards.length > 0 ? (
              <article className={`cardpg-block${hasWelcome ? "" : " cardpg-span-all"}`}>
                <h2 className="cardpg-h2">How you earn</h2>
                <ul className="cardpg-rewards">
                  {card.rewards.map((r) => (
                    <li className="cardpg-reward" key={r}>
                      {r}
                    </li>
                  ))}
                </ul>
              </article>
            ) : (
              <article className={`cardpg-block${hasWelcome ? "" : " cardpg-span-all"}`}>
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
            )}
            </div>
          </div>
        </div>

        {/* ── Full-width detail: perks + verdict ── */}
        <div className="cardpg-wide">
          {/* ── Perks & coverage: first 8 (two rows) shown, rest behind a toggle ── */}
          {card.benefits.length > 0 ? (
            <article className="cardpg-block">
              <h2 className="cardpg-h2">Built-in perks &amp; coverage</h2>
              <div className="cardpg-perks">
                {card.benefits.slice(0, 8).map((b) => (
                  <div className="cardpg-perk" key={b.title}>
                    <span className="cardpg-perk-check" aria-hidden="true" />
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
                    {card.benefits.slice(8).map((b) => (
                      <div className="cardpg-perk" key={b.title}>
                        <span className="cardpg-perk-check" aria-hidden="true" />
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
            </article>
          ) : null}

          {/* ── Pros & cons ── */}
          {card.pros.length > 0 || card.cons.length > 0 ? (
            <article className="cardpg-block">
              <h2 className="cardpg-h2">The verdict</h2>
              <div className="cardpg-proscons">
                {card.pros.length > 0 ? (
                  <div className="cardpg-pros">
                    <p className="cardpg-pc-head">What we like</p>
                    <ul>
                      {card.pros.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {card.cons.length > 0 ? (
                  <div className="cardpg-cons">
                    <p className="cardpg-pc-head">Worth noting</p>
                    <ul>
                      {card.cons.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </article>
          ) : null}
        </div>

        {/* ── Disclosure ── */}
        <p className="cardpg-disclosure">
          Issuer terms apply. ClearFin is not affiliated with this provider.{" "}
          <Link href="/disclosures">How we make money</Link>.
        </p>
      </main>

      {/* ── Footer (shared with SEO pages) ── */}
      <footer className="seo-footer">
        <div className="seo-footer-inner">
          <Logo className="footer-logo" priority={false} />
          <div className="seo-footer-links">
            <Link href="/">Home</Link>
            <Link href="/#tool">Calculator</Link>
            <Link href="/disclosures">Disclosures</Link>
          </div>
          <p className="seo-footer-copy">
            &copy; {new Date().getFullYear()} ClearFin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

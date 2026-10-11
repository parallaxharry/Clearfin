import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Card data audit skipped: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.");
  process.exit(2);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const STALE_DAYS = Number(process.env.CLEARFIN_REVIEW_STALE_DAYS ?? 60);
const OFFER_STALE_DAYS = Number(process.env.CLEARFIN_OFFER_STALE_DAYS ?? 30);
const now = Date.now();
const insuranceWords = /insurance|emergency medical|flight delay|baggage|rental (?:car|vehicle)|purchase protection|warranty|mobile device/i;

const { data, error } = await supabase
  .from("card_catalog")
  .select("id,name,issuer,is_active,bank_url,affiliate_url,source_url,insurance_source_url,reviewed_at,research_level,reward_program,welcome_bonus,benefits,insurance,updated_at")
  .or("is_active.is.null,is_active.eq.true")
  .order("issuer", { ascending: true })
  .order("name", { ascending: true });

if (error) {
  console.error("Card data audit failed:", error.message);
  process.exit(2);
}

const rows = data ?? [];
const findings = [];
const add = (severity, card, code, message) => findings.push({ severity, card: `${card.name ?? card.id} (${card.id})`, code, message });

for (const card of rows) {
  if (!card.source_url) {
    add("ERROR", card, "missing-official-source", "No official source URL is stored.");
  } else if (/finlywealth\.com|utm_source=maximize-with-clearfin/i.test(card.source_url)) {
    add("ERROR", card, "affiliate-used-as-source", "Official source points to an affiliate/application URL.");
  }

  if (card.bank_url && card.source_url && card.bank_url === card.source_url && /finlywealth\.com/i.test(card.bank_url)) {
    add("ERROR", card, "apply-source-not-separated", "Apply URL and official source are the same affiliate URL.");
  }

  let reviewAgeDays = null;
  if (!card.reviewed_at) {
    add("WARN", card, "missing-review-date", "No database review date is stored yet.");
  } else {
    const reviewed = Date.parse(card.reviewed_at);
    if (Number.isFinite(reviewed)) {
      reviewAgeDays = Math.floor((now - reviewed) / 86_400_000);
      if (reviewAgeDays > STALE_DAYS) {
        add("WARN", card, "stale-review", `Last database review is ${reviewAgeDays} days old (threshold ${STALE_DAYS}).`);
      }
    } else {
      add("ERROR", card, "invalid-review-date", `Could not parse reviewed_at: ${card.reviewed_at}`);
    }
  }

  const offer = card.welcome_bonus && typeof card.welcome_bonus === "object" ? card.welcome_bonus : null;
  const offerHeadline = typeof offer?.headline === "string" && offer.headline.trim().length > 0;
  const offerStages = Array.isArray(offer?.stages) && offer.stages.length > 0;
  const hasCurrentOffer = Boolean(offerHeadline || offerStages);

  if (hasCurrentOffer && reviewAgeDays !== null && reviewAgeDays > OFFER_STALE_DAYS) {
    add("WARN", card, "offer-needs-refresh", `Welcome-offer data was last reviewed ${reviewAgeDays} days ago (offer threshold ${OFFER_STALE_DAYS}).`);
  }

  const offerEndRaw = typeof offer?.offer_end_date === "string" ? offer.offer_end_date.trim() : "";
  if (offerEndRaw) {
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(offerEndRaw);
    const parsedOfferEnd = Date.parse(dateOnly ? `${offerEndRaw}T23:59:59Z` : offerEndRaw);
    if (!Number.isFinite(parsedOfferEnd)) {
      add("ERROR", card, "invalid-offer-end-date", `Could not parse welcome offer end date: ${offerEndRaw}`);
    } else if (parsedOfferEnd < now) {
      add("WARN", card, "expired-offer", `Stored welcome offer ended ${offerEndRaw}; remove or re-verify it.`);
    }
  }

  const benefitsText = Array.isArray(card.benefits)
    ? card.benefits.map((item) => `${item?.title ?? ""} ${item?.description ?? ""}`).join(" ")
    : "";
  const insuranceCount = Array.isArray(card.insurance) ? card.insurance.length : 0;
  if (insuranceWords.test(benefitsText) && insuranceCount === 0) {
    add("WARN", card, "insurance-benefit-without-insurance-record", "Benefits mention insurance/protection but the structured insurance list is empty.");
  }

  if (card.insurance_source_url && insuranceCount === 0) {
    add("WARN", card, "insurance-source-without-coverages", "An insurance source exists but no structured coverages are stored.");
  }

  if (card.reward_program && /amex points/i.test(card.reward_program)) {
    add("WARN", card, "nonstandard-reward-program", `Reward program is stored as '${card.reward_program}'. Check the issuer's official program name.`);
  }
}

const errors = findings.filter((f) => f.severity === "ERROR");
const warnings = findings.filter((f) => f.severity === "WARN");
const issuers = new Set(rows.map((r) => r.issuer).filter(Boolean));
const reviewedCount = rows.filter((r) => Boolean(r.reviewed_at)).length;
const coveragePct = rows.length ? ((reviewedCount / rows.length) * 100).toFixed(1) : "0.0";

console.log(`ClearFin card data audit: ${rows.length} active cards across ${issuers.size} issuers.`);
console.log(`Review coverage: ${reviewedCount}/${rows.length} cards (${coveragePct}%).`);
console.log(`Freshness thresholds: ${STALE_DAYS} days for card data; ${OFFER_STALE_DAYS} days for active welcome offers.`);
console.log(`Findings: ${errors.length} error(s), ${warnings.length} warning(s).`);

if (findings.length) {
  console.table(findings);
}

if (errors.length) process.exit(1);

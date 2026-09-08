"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef, useId } from "react";
import {
  CARDS, CardDef, SpendKey, STEPS,
  fmt, fmtRate, getBreakdown, getTopCards,
} from "@/lib/cards";
import { useSpend } from "@/context/SpendContext";
import { useCatalog, withCatalog } from "@/context/CatalogContext";
import CalculatorPreview from "@/components/CalculatorPreview";
import Modal from "@/components/Modal";
import { trackMetaAction } from "@/lib/metaPixel";
import { trackApplyClick } from "@/lib/trackApplyClick";
import { formatCost } from "@/lib/money";
import { checkIncome, creditGuidance } from "@/lib/eligibility";
import styles from "./CalculatorEligibility.module.css";

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
type ToolState = "gate" | "step" | "result";

// Recorded income checks and estimated credit guidance are not approval rules.
const PROFILE_STEPS = [
  {
    kind: "income" as const,
    icon: "💰",
    question: "What's your yearly income?",
    hint: "Your personal income before tax. We compare recorded income requirements, not approval odds.",
    min: 0,
    max: 250000,
    sliderStep: 5000,
    unit: "per year",
    money: true,
    presets: [
      { label: "Under $40k", value: 35000 },
      { label: "$60k", value: 60000 },
      { label: "$100k", value: 100000 },
      { label: "$150k+", value: 150000 },
    ],
  },
  {
    kind: "credit" as const,
    icon: "📊",
    question: "What's your credit score?",
    hint: "An estimate is fine. Score ranges are guidance only; the issuer makes the approval decision.",
    min: 300,
    max: 900,
    sliderStep: 5,
    unit: "approx. score",
    money: false,
    presets: [
      { label: "Fair (650)", value: 650 },
      { label: "Good (720)", value: 720 },
      { label: "Very good (770)", value: 770 },
      { label: "Excellent (820)", value: 820 },
    ],
  },
];
const TOTAL_STEPS = STEPS.length + PROFILE_STEPS.length;

export default function InteractiveTool({ pageHeading = false, startOpen = false }: { pageHeading?: boolean; startOpen?: boolean }) {
  const Heading = pageHeading ? "h1" : "h2";
  const questionId = useId();
  const { spend, setSpend, income, setIncome, householdIncome, setHouseholdIncome, credit, setCredit, resetProfile } = useSpend();
  const householdId = useId();
  const householdInvalid = householdIncome !== null && (!Number.isFinite(householdIncome) || householdIncome < income || householdIncome > 10000000);
  const [toolState, setToolState] = useState<ToolState>(startOpen ? "step" : "gate");
  const directInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startOpen) directInput.current?.focus({ preventScroll: true });
  }, [startOpen]);
  const [currentStep, setCurrentStep] = useState(0);
  // Edits are saved immediately, including when users go Back or leave the page.
  const stepValue = currentStep < STEPS.length ? spend[STEPS[currentStep].key] : 0;
  const setStepValue = (value: number) => setSpend({ ...spend, [STEPS[currentStep].key]: value });
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [visible, setVisible] = useState(true);
  const [modalCard, setModalCard] = useState<(CardDef & { netValue: number }) | null>(null);

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (transitionTimer.current !== null) clearTimeout(transitionTimer.current);
    if (scrollTimer.current !== null) clearTimeout(scrollTimer.current);
  }, []);

  const transition = useCallback((fn: () => void) => {
    // Also guard keyboard activation before React has disabled the button.
    if (transitionTimer.current !== null) return;
    setAnimDir("out");
    setVisible(false);
    transitionTimer.current = setTimeout(() => {
      transitionTimer.current = null;
      fn();
      setAnimDir("in");
      setVisible(true);
    }, 280);
  }, []);

  const handlePreset = (val: number) => setStepValue(val);

  const handleNext = () => {
    if (currentStep === STEPS.length && householdInvalid) return;
    if (currentStep < TOTAL_STEPS - 1) {
      transition(() => setCurrentStep((s) => s + 1));
    } else {
      transition(() => {
        setToolState("result");
        trackMetaAction("CalculatorCompleted");
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      transition(() => setCurrentStep((s) => s - 1));
    } else {
      transition(() => setToolState("gate"));
    }
  };

  const handleRestart = () => {
    transition(() => {
      setCurrentStep(0);
      resetProfile();
      setToolState("step");
    });
  };

  const openModal = (card: CardDef & { netValue: number }) => {
    setModalCard(card);
  };
  const closeModal = () => {
    setModalCard(null);
  };

  /* ── Calculated values ── */
  const totalMonthly = Object.values(spend).reduce((a, b: number) => a + b, 0);
  const annualSpend = totalMonthly * 12;
  const catalog = useCatalog();
  // Keep reward scoring unchanged. Missing data stays explicitly unverified;
  // estimated credit ranges never silently exclude a card as an approval rule.
  const consideredCards = getTopCards(spend, CARDS.length)
    .map((c) => withCatalog(c, catalog))
    .filter((c) => checkIncome(catalog[c.id], income, householdIncome).state !== "below");
  const topCards = consideredCards.slice(0, 3);
  const bestNetValue = topCards[0]?.netValue ?? 0;

  const isSpendStep = currentStep < STEPS.length;
  const step = STEPS[currentStep];
  const profile = PROFILE_STEPS[currentStep - STEPS.length];
  const profileValue = profile?.kind === "income" ? income : credit;
  const setProfileValue = profile?.kind === "income" ? setIncome : setCredit;
  const pct = isSpendStep
    ? Math.min((stepValue / step.max) * 100, 100)
    : Math.min(((profileValue - profile.min) / (profile.max - profile.min)) * 100, 100);
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <>
    <section id="tool">
      <div className="section-num">02 / Calculator</div>
      <div className="tool-wrap">
        <div className={`tool-stage${toolState !== "gate" ? " open" : ""}`}>

          {/* ════════════════════════════════
              GATE — locked state
          ════════════════════════════════ */}
          {toolState === "gate" && (
            <div className="tool-gate">
              <div className="gate-copy">
                <div className="gate-eyebrow"><span>Live calculator</span> · Built for Canada</div>
                <Heading className="gate-title">
                  See what your spending<br />could <span className="ital">earn.</span>
                </Heading>
                <p className="gate-sub">
                  Tell us how you spend and we&apos;ll rank Canadian cards by estimated
                  annual rewards after fees. Your assumptions stay visible.
                </p>
                <button className="gate-btn" onClick={() => {
                  setToolState("step");
                  scrollTimer.current = setTimeout(() => {
                    scrollTimer.current = null;
                    document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }}>
                  <span className="gate-btn-text">Build my card profile</span>
                  <span className="gate-btn-arrow">→</span>
                </button>
                <div className="gate-foot">
                  <span>7 quick questions</span>
                  <span>No signup</span>
                  <span>No card numbers</span>
                </div>
              </div>

              <div className="gate-visual" aria-hidden="true">
                <CalculatorPreview />
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              STEPS — one question at a time
          ════════════════════════════════ */}
          {toolState === "step" && (
            <div className={`step-shell${visible ? " step-visible" : ""} step-${animDir}`}>
              {/* Progress bar */}
              <div className="step-progress-bar">
                <div className="step-progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Step count */}
              <div className="step-count">
                <span className="step-count-current">{currentStep + 1}</span>
                <span className="step-count-sep"> / </span>
                <span className="step-count-total">{TOTAL_STEPS}</span>
              </div>

              {/* Icon + Question */}
              <div className="step-icon">{String(currentStep + 1).padStart(2, "0")}</div>
              <Heading id={questionId} className="step-question">{isSpendStep ? step.question : profile.question}</Heading>
              <p className="step-hint">{isSpendStep ? step.hint : profile.hint}</p>

              {/* Current value display */}
              <div className="step-amount-display">
                <span className="step-amount-value">
                  {isSpendStep ? fmt(stepValue) : profile.money ? fmt(profileValue) : profileValue}
                </span>
                <span className="step-amount-label">{isSpendStep ? "per month" : profile.unit}</span>
              </div>

              {/* Slider */}
              <div className="step-slider-wrap">
                <input
                ref={directInput}
                type="range"
                  className="step-slider"
                  aria-labelledby={questionId}
                  aria-valuetext={isSpendStep ? `${fmt(stepValue)} per month` : profile.money ? `${fmt(profileValue)} per year` : String(profileValue)}
                  min={isSpendStep ? 0 : profile.min}
                  max={isSpendStep ? step.max : profile.max}
                  step={isSpendStep ? 10 : profile.sliderStep}
                  value={isSpendStep ? stepValue : profileValue}
                  style={{ "--pct": `${pct}%` } as React.CSSProperties}
                  onChange={(e) =>
                    isSpendStep ? setStepValue(+e.target.value) : setProfileValue(+e.target.value)
                  }
                />
                <div className="step-slider-labels">
                  <span>{isSpendStep ? "$0" : profile.money ? fmt(profile.min) : profile.min}</span>
                  <span>
                    {isSpendStep
                      ? fmt(step.max)
                      : profile.money
                        ? `${fmt(profile.max)}+`
                        : profile.max}
                  </span>
                </div>
              </div>

              {/* Quick presets */}
              <div className="step-presets">
                {(isSpendStep ? step.presets : profile.presets).map((p) => (
                  <button
                    key={p.label}
                    className={`step-preset${
                      (isSpendStep ? stepValue : profileValue) === p.value ? " active" : ""
                    }`}
                    onClick={() =>
                      isSpendStep ? handlePreset(p.value) : setProfileValue(p.value)
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {!isSpendStep && profile.kind === "income" && (
                <div className={styles.household}>
                  <label htmlFor={householdId}>Household income per year (optional)</label>
                  <input id={householdId} type="number" inputMode="decimal" min={income} max={10000000} step="any"
                    value={householdIncome ?? ""} placeholder="Leave blank if unsure"
                    aria-describedby={`${householdId}-hint`} aria-invalid={householdInvalid}
                    onChange={(event) => setHouseholdIncome(event.target.value === "" ? null : Number(event.target.value))} />
                  <p id={`${householdId}-hint`} role={householdInvalid ? "alert" : undefined}>
                    {householdInvalid ? "Enter a total at least as high as your personal income, up to $10,000,000, or leave this blank."
                      : "Total before tax, including your personal income. Used only where a household alternative is recorded. Kept in this tab only."}
                  </p>
                </div>
              )}

              {/* Nav buttons */}
              <div className="step-nav">
                <button className="step-back" onClick={handleBack} disabled={!visible}>
                  ← Back
                </button>
                <button className="step-next" onClick={handleNext} disabled={!visible || (currentStep === STEPS.length && householdInvalid)}>
                  {currentStep < TOTAL_STEPS - 1 ? "Next →" : "See Results →"}
                </button>
              </div>

              {/* Mini summary of answered steps */}
              {currentStep > 0 && (
                <div className="step-summary">
                  {STEPS.slice(0, currentStep).map((s) => (
                    <span key={s.key} className="step-summary-chip">
                      {s.icon} {fmt(spend[s.key])}/mo
                    </span>
                  ))}
                  {currentStep > STEPS.length && (
                    <span className="step-summary-chip">💰 {fmt(income)}/yr</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════
              RESULT — no eligible cards
          ════════════════════════════════ */}
          {toolState === "result" && topCards.length === 0 && (
            <div className={`result-shell${visible ? " result-visible" : ""} result-${animDir}`}>
              <div className="result-header">
                <div className="result-eyebrow">No matches yet</div>
                <Heading className="result-title">
                  No cards match these recorded <span className="ital">income checks</span>.
                </Heading>
              </div>
              <p className="step-hint" style={{ textAlign: "center" }}>
                This is not a credit decision. Check that your answers are accurate; issuers may
                have other eligibility routes, such as assets, that this calculator does not assess.
              </p>
              <div className="step-nav">
                <button
                  className="step-back"
                  onClick={() =>
                    transition(() => {
                      setCurrentStep(STEPS.length);
                      setToolState("step");
                    })
                  }
                >
                  ← Adjust income / credit
                </button>
                <button className="step-next" onClick={handleRestart}>
                  Start over →
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              RESULT — card recommendation
          ════════════════════════════════ */}
          {toolState === "result" && topCards.length > 0 && (
            <div className={`result-shell${visible ? " result-visible" : ""} result-${animDir}`}>
              {/* Header */}
              <div className="result-header">
                <div className="result-eyebrow">Your personalised analysis</div>
                <Heading className="result-title">
                  <span className="ital">{topCards[0]?.name}</span> could earn you an
                  estimated <span className="result-leak">{fmt(bestNetValue)}</span> a year.
                </Heading>
              </div>

              {/* Stats row */}
              <div className="result-stats">
                <div className="result-stat">
                  <div className="result-stat-num">{fmt(annualSpend)}</div>
                  <div className="result-stat-label">Annual spend</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-num">{fmt(bestNetValue)}</div>
                  <div className="result-stat-label">Est. rewards / year</div>
                </div>
              </div>

              {/* Recommended cards */}
              <div className="result-cards-head">
                <span>Your spending-based shortlist</span>
                <span className="result-cards-count">{topCards.length} cards</span>
              </div>
              <p className={styles.note}>
                This ranks estimated rewards, not approval odds. Missing requirements stay unverified.
                Recorded income checks and estimated score ranges may be incomplete or outdated;
                confirm the issuer&apos;s current terms before applying. Other routes, including assets, are not assessed.
              </p>
              <div className="result-cards">
                {topCards.map((card, i) => {
                  const earnBreakdown = Object.entries(spend).map(([k, v]) => ({
                    cat: k,
                    earn: v * 12 * card.rates[k as SpendKey],
                  }));
                  const topCat = earnBreakdown.sort((a, b) => b.earn - a.earn)[0];
                  const catLabel: Record<string, string> = {
                    dining: "Dining", grocery: "Groceries", gas: "Gas",
                    travel: "Travel", other: "Shopping",
                  };
                  return (
                    <div
                      className={`result-card${i === 0 ? " result-card-top" : ""}`}
                      key={card.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${card.name} details`}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openModal(card);
                        }
                      }}
                      onClick={() => openModal(card)}
                      style={{ cursor: "pointer" }}
                    >
                      {i === 0 && <div className="result-card-rank">#1 Spending Match</div>}
                      <div className="result-card-left">
                        <div className="result-card-badge">{card.badge}</div>
                        <div className="result-card-name">{card.name}</div>
                        <div className="result-card-issuer">{card.issuer}</div>
                        <div className={styles.requirements} data-income-check={checkIncome(catalog[card.id], income, householdIncome).state}>
                          <strong>{checkIncome(catalog[card.id], income, householdIncome).label}</strong>
                          <span>{creditGuidance(catalog[card.id], credit)}</span>
                        </div>
                        <div className="result-card-desc">{card.description}</div>
                        <div className="result-card-best-for">
                          Best category: {catLabel[topCat.cat]} (+{fmt(topCat.earn)}/yr)
                        </div>
                      </div>
                      <div className="result-card-right">
                        <div className="result-card-net">{fmt(card.netValue)}</div>
                        <div className="result-card-net-label">net/year</div>
                        <div className="result-card-fee">
                          {card.annualFee === 0 ? "No annual fee" : `${formatCost(card.annualFee)}/yr fee`}
                        </div>
                        <div className="result-card-tap">Tap for details →</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA row */}
              <div className="result-cta-row">
                <Link href="/early-access" className="btn-primary">
                  <span>Get Early Access — It&apos;s Free</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <button className="result-restart" onClick={handleRestart}>
                  ← Recalculate
                </button>
              </div>

              {/* Disclaimer */}
              <p className="result-disclaimer">
                Estimates based on publicly available reward rates. Actual rewards depend on
                your spending mix, bonus categories, and program terms. ClearFin does not
                endorse specific cards — we surface the math.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll · See cards</span>
        <span className="scroll-hint-line" />
      </div>
      <div className="section-divider-bottom" />
    </section>

    {/* ── Card Detail Modal ── */}
    {modalCard && (
      <Modal label={modalCard.name} onClose={closeModal}>
      <div className="card-modal-overlay" onClick={closeModal}>
        <div className="card-modal" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="card-modal-close" aria-label="Close card details" onClick={closeModal}>✕</button>

          {/* Left: details */}
          <div className="card-modal-left">
            <div className="card-modal-badge">{modalCard.badge}</div>
            <h3 className="card-modal-name">{modalCard.name}</h3>
            <div className="card-modal-issuer">{modalCard.issuer}</div>
            <div className={styles.requirements}>
              <strong>{checkIncome(catalog[modalCard.id], income, householdIncome).label}</strong>
              <span>{creditGuidance(catalog[modalCard.id], credit)}</span>
              <span>Check current issuer terms. This is not an approval decision.</span>
            </div>
            <div className="card-modal-net-row">
              <span className="card-modal-net">{fmt(modalCard.netValue)}</span>
              <span className="card-modal-net-label">net / year for your spend</span>
            </div>
            <div className="card-modal-perks">
              {modalCard.perks.map((p, i) => (
                <div className="card-modal-perk" key={i}>
                  <span className="card-modal-perk-dot" aria-hidden="true">✦</span>
                  {p}
                </div>
              ))}
            </div>

            {/* Calculation breakdown */}
            {(() => {
              const { rows, gross } = getBreakdown(modalCard, spend);
              return (
                <div className="modal-breakdown">
                  <div className="modal-breakdown-label">How we calculated this</div>
                  <div className="modal-bd-table">
                    <div className="modal-bd-head">
                      <span>Category</span>
                      <span>Monthly</span>
                      <span>Rate</span>
                      <span>Yearly</span>
                    </div>
                    {rows.map((r) => (
                      <div key={r.key} className="modal-bd-row">
                        <span className="modal-bd-cat">{r.label}</span>
                        <span className="modal-bd-monthly">{fmt(spend[r.key])}</span>
                        <span className="modal-bd-rate">{fmtRate(r.rate)}</span>
                        <span className="modal-bd-earn">{fmt(r.annual)}</span>
                      </div>
                    ))}
                    <div className="modal-bd-row bd-gross">
                      <span className="modal-bd-cat">Gross rewards</span>
                      <span />
                      <span />
                      <span className="modal-bd-earn">{fmt(gross)}</span>
                    </div>
                    <div className="modal-bd-row bd-fee">
                      <span className="modal-bd-cat">Annual fee</span>
                      <span />
                      <span />
                      <span className="modal-bd-earn">
                        {modalCard.annualFee === 0 ? "None" : `-${formatCost(modalCard.annualFee)}`}
                      </span>
                    </div>
                    <div className="modal-bd-row bd-net">
                      <span className="modal-bd-cat">Net value</span>
                      <span />
                      <span />
                      <span className="modal-bd-earn">{fmt(gross - modalCard.annualFee)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Right: card preview + apply */}
          <div className="card-modal-right">
            <div className="card-modal-spinner">
              <div className="card-modal-spin-front">
                <Image
                  src={modalCard.img}
                  alt={modalCard.name}
                  fill
                  sizes="320px"
                  style={{ objectFit: "cover", borderRadius: "inherit" }}
                />
                <div className="card-modal-sheen" />
              </div>
            </div>
            <a
              href={modalCard.bankUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-modal-cta"
              onClick={() => trackApplyClick(modalCard.id)}
            >
              Apply at {modalCard.issuer} →
            </a>
            <Link href={`/credit-cards/${modalCard.id}`} className="card-modal-view">
              View full details
            </Link>
            <div className="card-modal-disclaimer">
              Issuer terms apply. ClearFin is not affiliated with this provider.
            </div>
          </div>
        </div>
      </div>
      </Modal>
    )}
    </>
  );
}

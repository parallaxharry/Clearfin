"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  CARDS, CardDef, SpendKey, DEFAULT_SPEND, STEPS,
  fmt, fmtRate, getBreakdown, getTopCards,
} from "@/lib/cards";
import { useSpend } from "@/context/SpendContext";
import { useCatalog, withCatalog } from "@/context/CatalogContext";
import CalculatorPreview from "@/components/CalculatorPreview";
import { trackMetaAction } from "@/lib/metaPixel";
import { loadCardProfile, saveCardProfile } from "@/lib/savedCardProfile";

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
type ToolState = "gate" | "step" | "result";

// Profile questions shown after the 5 spend questions. Income eligibility is
// matched against issuer-published personal OR household thresholds. Estimated
// credit-score ranges are not used as hard approval filters.
const PROFILE_STEPS = [
  {
    kind: "income" as const,
    icon: "💰",
    question: "What's your personal yearly income?",
    hint: "Before tax. Some cards use a personal-income requirement.",
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
    kind: "householdIncome" as const,
    icon: "🏠",
    question: "What's your household yearly income?",
    hint: "Combined before-tax household income. If you live alone, use your personal income again.",
    min: 0,
    max: 400000,
    sliderStep: 5000,
    unit: "per year",
    money: true,
    presets: [
      { label: "Under $80k", value: 70000 },
      { label: "$100k", value: 100000 },
      { label: "$150k", value: 150000 },
      { label: "$200k+", value: 200000 },
    ],
  },
];
const TOTAL_STEPS = STEPS.length + PROFILE_STEPS.length;

export default function InteractiveTool() {
  const { spend, setSpend: onSpendChange } = useSpend();
  const [toolState, setToolState] = useState<ToolState>("gate");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValue, setStepValue] = useState(STEPS[0].defaultVal);
  const [income, setIncome] = useState(60000);
  const [householdIncome, setHouseholdIncome] = useState(60000);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [visible, setVisible] = useState(true);
  const [modalCard, setModalCard] = useState<(CardDef & { netValue: number }) | null>(null);

  // Sync stepValue when entering a spend step or when a saved profile is restored.
  useEffect(() => {
    // The displayed slider value must follow the newly selected spending category.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (currentStep < STEPS.length) setStepValue(spend[STEPS[currentStep].key]);
  }, [currentStep, spend]);

  useEffect(() => {
    const saved = loadCardProfile();
    if (!saved) return;
    setIncome(saved.personalIncome);
    setHouseholdIncome(saved.householdIncome);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalCard ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalCard]);

  const transition = useCallback((fn: () => void) => {
    setAnimDir("out");
    setVisible(false);
    setTimeout(() => {
      fn();
      setAnimDir("in");
      setVisible(true);
    }, 280);
  }, []);

  const handlePreset = (val: number) => setStepValue(val);

  const handleNext = () => {
    // Spend steps persist their slider value; profile steps bind their own income state.
    if (currentStep < STEPS.length) {
      const key = STEPS[currentStep].key;
      onSpendChange({ ...spend, [key]: stepValue });
    }

    if (currentStep < TOTAL_STEPS - 1) {
      transition(() => setCurrentStep((s) => s + 1));
    } else {
      saveCardProfile({
        version: 1,
        spend,
        personalIncome: income,
        householdIncome,
        results: eligibleCards.map((card) => ({ id: card.id, netValue: card.netValue })),
        savedAt: new Date().toISOString(),
      });
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
      onSpendChange(DEFAULT_SPEND);
      setStepValue(STEPS[0].defaultVal);
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

  // Start with the existing static calculator math, then apply only narrowly verified
  // corrections where the static model differs from current issuer-published terms.
  const scoredCards = getTopCards(spend, CARDS.length)
    .map((c) => {
      let annualFee = c.annualFee;
      let rates = { ...c.rates };
      let description = c.description;
      let changed = false;

      // TD/CIBC Aeroplan Infinite: the accelerated rate is for direct Air Canada
      // purchases, not generic hotels/car rentals/other travel in our broad bucket.
      if (c.id === "td-aeroplan" || c.id === "cibc-aeroplan-infinite") {
        rates.travel = 0.01;
        changed = true;
      }

      // RBC Avion Visa Infinite publishes 1.25x on eligible travel purchases.
      if (c.id === "rbc-avion") {
        rates.travel = 0.0125;
        changed = true;
      }

      // RBC changed the Cash Back Preferred World Elite Mastercard on October 1, 2026.
      // Keep calculator math aligned with the current public terms until cards.ts is
      // migrated to a single verified source of truth.
      if (c.id === "rbc-cashback-world-elite") {
        annualFee = 120;
        rates = {
          dining: 0.005,
          grocery: 0.02,
          gas: 0.01,
          travel: 0.005,
          other: 0.005,
        };
        description = "2% cash back on eligible groceries, 1% on eligible gas, EV charging, transit and rideshare, and 0.5% on other eligible purchases.";
        changed = true;
      }

      if (!changed) return c;

      const annualEarn = Object.entries(spend).reduce(
        (sum, [key, value]) => sum + value * 12 * rates[key as SpendKey],
        0
      );

      return {
        ...c,
        annualFee,
        rates,
        description,
        netValue: annualEarn - annualFee,
      };
    })
    // TD states the Emerald Flex Rate Visa is no longer available to new applicants.
    .filter((c) => c.id !== "td-emerald")
    .sort((a, b) => b.netValue - a.netValue);

  // Overlay Supabase display data, then apply issuer-published income eligibility.
  // When a card publishes both personal and household thresholds, either path qualifies.
  // ClearFin credit-score estimates are intentionally not used as hard exclusions.
  const eligibleCards = scoredCards
    .map((c) => withCatalog(c, catalog))
    .filter((c) => {
      const info = catalog[c.id];
      const personalMin = info?.minIncome;
      const householdMin = info?.minHouseholdIncome;
      const hasPersonalMin = typeof personalMin === "number" && personalMin > 0;
      const hasHouseholdMin = typeof householdMin === "number" && householdMin > 0;

      if (!hasPersonalMin && !hasHouseholdMin) return true;

      const qualifiesPersonally = hasPersonalMin && income >= personalMin;
      const qualifiesByHousehold = hasHouseholdMin && householdIncome >= householdMin;
      return qualifiesPersonally || qualifiesByHousehold;
    });
  const topCards = eligibleCards.slice(0, 3);
  const bestNetValue = topCards[0]?.netValue ?? 0;

  const isSpendStep = currentStep < STEPS.length;
  const step = STEPS[currentStep];
  const profile = PROFILE_STEPS[currentStep - STEPS.length];
  const profileValue = profile?.kind === "income" ? income : householdIncome;
  const setProfileValue = profile?.kind === "income" ? setIncome : setHouseholdIncome;
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
                <h2 className="gate-title">
                  See what your spending<br />could <span className="ital">earn.</span>
                </h2>
                <p className="gate-sub">
                  Tell us how you spend and we&apos;ll rank eligible Canadian cards by estimated
                  annual rewards after fees. Your assumptions stay visible.
                </p>
                <button className="gate-btn" onClick={() => {
                  setToolState("step");
                  setTimeout(() => {
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
              <h2 className="step-question">{isSpendStep ? step.question : profile.question}</h2>
              <p className="step-hint">{isSpendStep ? step.hint : profile.hint}</p>

              {/* Current value display */}
              <div className="step-amount-display">
                <span className="step-amount-value">
                  {isSpendStep ? fmt(stepValue) : fmt(profileValue)}
                </span>
                <span className="step-amount-label">{isSpendStep ? "per month" : profile.unit}</span>
              </div>

              {/* Slider */}
              <div className="step-slider-wrap">
                <input
                  type="range"
                  className="step-slider"
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
                  <span>{isSpendStep ? "$0" : fmt(profile.min)}</span>
                  <span>{isSpendStep ? fmt(step.max) : `${fmt(profile.max)}+`}</span>
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

              {/* Nav buttons */}
              <div className="step-nav">
                <button className="step-back" onClick={handleBack}>
                  ← Back
                </button>
                <button className="step-next" onClick={handleNext}>
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
                    <span className="step-summary-chip">💰 {fmt(income)}/yr personal</span>
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
                <h2 className="result-title">
                  No cards match that <span className="ital">income profile</span>.
                </h2>
              </div>
              <p className="step-hint" style={{ textAlign: "center" }}>
                The cards in this result set have issuer-published income requirements above the
                personal and household income values you entered.
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
                  ← Review income
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
                <h2 className="result-title">
                  <span className="ital">{topCards[0]?.name}</span> could earn you an
                  estimated <span className="result-leak">{fmt(bestNetValue)}</span> a year.
                </h2>
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
                <span>Your recommended card stack</span>
                <span className="result-cards-count">{topCards.length} cards</span>
              </div>
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
                      onClick={() => openModal(card)}
                      style={{ cursor: "pointer" }}
                    >
                      {i === 0 && <div className="result-card-rank">#1 Best Match</div>}
                      <div className="result-card-left">
                        <div className="result-card-badge">{card.badge}</div>
                        <div className="result-card-name">{card.name}</div>
                        <div className="result-card-issuer">{card.issuer}</div>
                        <div className="result-card-desc">{card.description}</div>
                        <div className="result-card-best-for">
                          Best category: {catLabel[topCat.cat]} (+{fmt(topCat.earn)}/yr)
                        </div>
                      </div>
                      <div className="result-card-right">
                        <div className="result-card-net">{fmt(card.netValue)}</div>
                        <div className="result-card-net-label">net/year</div>
                        <div className="result-card-fee">
                          {card.annualFee === 0 ? "No annual fee" : `$${card.annualFee}/yr fee`}
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
                Estimates based on publicly available reward rates and issuer-published income
                requirements. Credit-score ranges shown elsewhere on ClearFin are estimates and do
                not determine approval. Actual rewards and approval depend on issuer terms.
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
      <div className="card-modal-overlay" onClick={closeModal}>
        <div className="card-modal" onClick={(e) => e.stopPropagation()}>
          <button className="card-modal-close" onClick={closeModal}>✕</button>

          {/* Left: details */}
          <div className="card-modal-left">
            <div className="card-modal-badge">{modalCard.badge}</div>
            <h3 className="card-modal-name">{modalCard.name}</h3>
            <div className="card-modal-issuer">{modalCard.issuer}</div>
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
                        {modalCard.annualFee === 0 ? "None" : `-$${modalCard.annualFee}`}
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
              onClick={() => {
                trackMetaAction("ApplyClick");
                fetch("/api/track-click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: modalCard.id }) }).catch(() => {});
              }}
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
    )}
    </>
  );
}
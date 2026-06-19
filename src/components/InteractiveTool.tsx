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

/* ══════════════════════════════════════════════════════════
   LIVE TICKER — Canadians lose every minute
══════════════════════════════════════════════════════════ */
function useTicker(start = 1612) {
  const [val, setVal] = useState(start);
  useEffect(() => {
    const t = setInterval(
      () => setVal((v) => v + Math.random() * 4 + 1.5),
      900
    );
    return () => clearInterval(t);
  }, []);
  return val;
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
type ToolState = "gate" | "step" | "result";

// Profile questions shown after the 5 spend questions, used to filter out cards
// the user won't qualify for (income / credit minimums live in card_catalog).
const PROFILE_STEPS = [
  {
    kind: "income" as const,
    icon: "💰",
    question: "What's your yearly income?",
    hint: "Before tax. Used to match cards you'll qualify for.",
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
    hint: "An estimate is fine. Matches cards you can get approved for.",
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

export default function InteractiveTool() {
  const { spend, setSpend: onSpendChange } = useSpend();
  const [toolState, setToolState] = useState<ToolState>("gate");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValue, setStepValue] = useState(STEPS[0].defaultVal);
  const [income, setIncome] = useState(60000);
  const [credit, setCredit] = useState(720);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [visible, setVisible] = useState(true);
  const [modalCard, setModalCard] = useState<(CardDef & { netValue: number }) | null>(null);
  const ticker = useTicker();

  // Sync stepValue when entering a spend step (profile steps bind their own state).
  useEffect(() => {
    if (currentStep < STEPS.length) setStepValue(spend[STEPS[currentStep].key]);
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Open via hero CTA
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href="#tool"]');
    const handler = () => setTimeout(() => {
      setToolState("gate");
    }, 200);
    links.forEach((l) => l.addEventListener("click", handler));
    return () => links.forEach((l) => l.removeEventListener("click", handler));
  }, []);

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
    // Spend steps persist their slider value; profile steps already bind income/credit.
    if (currentStep < STEPS.length) {
      const key = STEPS[currentStep].key;
      onSpendChange({ ...spend, [key]: stepValue });
    }

    if (currentStep < TOTAL_STEPS - 1) {
      transition(() => setCurrentStep((s) => s + 1));
    } else {
      transition(() => setToolState("result"));
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
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalCard(null);
    document.body.style.overflow = "";
  };

  /* ── Calculated values ── */
  const totalMonthly = Object.values(spend).reduce((a, b: number) => a + b, 0);
  const annualSpend = totalMonthly * 12;
  const catalog = useCatalog();
  // Score every card (cards.ts math), overlay Supabase display, then keep only cards the
  // user qualifies for: a card is hidden when its income/credit minimum exceeds the user's.
  // Cards with no stated requirement always stay.
  const eligibleCards = getTopCards(spend, CARDS.length)
    .map((c) => withCatalog(c, catalog))
    .filter((c) => {
      const info = catalog[c.id];
      const incomeOk = !info?.minIncome || info.minIncome <= income;
      const creditOk = !info?.creditMin || info.creditMin <= credit;
      return incomeOk && creditOk;
    });
  const topCards = eligibleCards.slice(0, 3);
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
              <div className="gate-eyebrow">Live · Try it now</div>
              <h2 className="gate-title">
                How much are
                <br />
                <span className="ital">you</span> losing?
              </h2>
              <p className="gate-sub">
                Answer 7 quick questions. We&apos;ll calculate your exact reward leak and
                show you the Canadian cards you qualify for that earn you more — right now.
              </p>
              <div className="gate-ticker">
                <div className="gate-ticker-pulse" />
                <div>
                  <div className="gate-ticker-label">Canadians lose, every minute</div>
                  <div className="gate-ticker-value">
                    ${ticker.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                </div>
              </div>
              <button className="gate-btn" onClick={() => {
                setToolState("step");
                setTimeout(() => {
                  document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}>
                <span className="gate-btn-text">Start in 30 seconds →</span>
              </button>
              <div className="gate-foot">
                <span>7 questions</span>
                <span>No signup</span>
                <span>No card data</span>
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
              <div className="step-icon">{isSpendStep ? step.icon : profile.icon}</div>
              <h2 className="step-question">{isSpendStep ? step.question : profile.question}</h2>
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
                <h2 className="result-title">
                  No cards fit that <span className="ital">income</span> &amp;{" "}
                  <span className="ital">credit score</span>.
                </h2>
              </div>
              <p className="step-hint" style={{ textAlign: "center" }}>
                Most cards need a higher credit score or income. Try raising either, or start over
                to adjust your spending.
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
                <a href="#waitlist" className="btn-primary">
                  <span>Get Early Access — It&apos;s Free</span>
                  <span className="btn-arrow">→</span>
                </a>
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
                  <span className="card-modal-perk-dot">✦</span>
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
              onClick={() => fetch("/api/track-click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: modalCard.id }) }).catch(() => {})}
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

"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   CARD DATABASE — Canadian cards with real earn rates
══════════════════════════════════════════════════════════ */
interface CardDef {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  rates: { dining: number; grocery: number; gas: number; travel: number; other: number };
  badge: string;
  color: string;
  description: string;
  img: string;
  bankUrl: string;
  perks: string[];
}

const CARDS: CardDef[] = [
  {
    id: "cobalt",
    name: "Amex Cobalt",
    issuer: "American Express",
    annualFee: 156,
    rates: { dining: 0.05, grocery: 0.05, gas: 0.02, travel: 0.02, other: 0.01 },
    badge: "🍽️ Best for Dining",
    color: "var(--accent-rose)",
    description: "5x points on dining & groceries. Massive welcome bonus. Best for food spenders.",
    img: "/cards/amex-cobalt.avif",
    bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/cobalt-card/",
    perks: ["5x on dining & food delivery", "5x on groceries", "2x on travel & transit", "1x everything else", "$156/yr · $13/month"],
  },
  {
    id: "scotia-gold",
    name: "Scotia Gold Amex",
    issuer: "Scotiabank",
    annualFee: 120,
    rates: { dining: 0.05, grocery: 0.06, gas: 0.03, travel: 0.03, other: 0.01 },
    badge: "🛒 Best Grocery Card",
    color: "var(--accent-warm)",
    description: "6x on groceries + 5x dining. Exceptional for everyday Canadian spending.",
    img: "/cards/scotia-gold-amex.webp",
    bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/american-express/gold-american-express-card.html",
    perks: ["6x Scene+ on groceries", "5x on dining & entertainment", "3x on gas & transit", "No foreign transaction fees", "$120/yr annual fee"],
  },
  {
    id: "td-aeroplan",
    name: "TD Aeroplan Visa Infinite",
    issuer: "TD Bank",
    annualFee: 139,
    rates: { dining: 0.03, grocery: 0.015, gas: 0.015, travel: 0.03, other: 0.01 },
    badge: "✈️ Best Travel",
    color: "#6B8FC9",
    description: "3x on Air Canada & travel. 1.5x on everyday. Best for Air Canada flyers.",
    img: "/cards/td-aeroplan-infinite.jpeg",
    bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/",
    perks: ["3x Aeroplan on Air Canada", "3x on grocery & dining", "1.5x on all other purchases", "Air Canada companion pass", "$139/yr annual fee"],
  },
  {
    id: "rbc-avion",
    name: "RBC Avion Visa Infinite",
    issuer: "RBC",
    annualFee: 120,
    rates: { dining: 0.0125, grocery: 0.0125, gas: 0.0125, travel: 0.0125, other: 0.0125 },
    badge: "🔄 Most Flexible",
    color: "#4A90D9",
    description: "1.25x on everything. Transfer to 30+ airline partners. Suits diverse spenders.",
    img: "/cards/rbc-avion-infinite.webp",
    bankUrl: "https://www.rbc.com/creditcards/avion-visa-infinite.html",
    perks: ["1.25x RBC Avion points on all purchases", "Transfer to 30+ airline partners", "Airport lounge access", "Travel insurance included", "$120/yr annual fee"],
  },
  {
    id: "bmo-eclipse",
    name: "BMO Eclipse Visa Infinite",
    issuer: "BMO",
    annualFee: 120,
    rates: { dining: 0.05, grocery: 0.05, gas: 0.05, travel: 0.01, other: 0.01 },
    badge: "⛽ Best Gas Card",
    color: "#2B6CB0",
    description: "5x on dining, grocery, and gas. $50 lifestyle credit. Great all-rounder.",
    img: "/cards/bmo-eclipse.webp",
    bankUrl: "https://www.bmo.com/en-ca/main/personal/credit-cards/eclipse-visa-infinite/",
    perks: ["5x on dining, grocery & gas", "5x on drugstore purchases", "$50 annual lifestyle credit", "No foreign transaction fees", "$120/yr annual fee"],
  },
  {
    id: "wealthsimple",
    name: "Wealthsimple Card",
    issuer: "Wealthsimple",
    annualFee: 0,
    rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 },
    badge: "💸 No-Fee Pick",
    color: "#48BB78",
    description: "1% cashback on everything. No annual fee. Ideal as a backup or starter card.",
    img: "/cards/wealthsimple.webp",
    bankUrl: "https://www.wealthsimple.com/en-ca/spend",
    perks: ["1% back in cash or crypto", "No annual fee ever", "No foreign transaction fees", "Instant cashback at checkout", "Works with all major retailers"],
  },
];

const BASE_RATE = 0.012; // 1.2% average Canadian card return

/* ══════════════════════════════════════════════════════════
   STEP DEFINITIONS
══════════════════════════════════════════════════════════ */
type SpendKey = "dining" | "grocery" | "gas" | "travel" | "other";

interface Step {
  key: SpendKey;
  icon: string;
  label: string;
  question: string;
  hint: string;
  max: number;
  defaultVal: number;
  presets: { label: string; value: number }[];
}

const STEPS: Step[] = [
  {
    key: "dining",
    icon: "🍽️",
    label: "Dining & Restaurants",
    question: "How much do you spend eating out each month?",
    hint: "Restaurants, cafes, takeout, food delivery",
    max: 2000,
    defaultVal: 400,
    presets: [
      { label: "Light ($200)", value: 200 },
      { label: "Average ($400)", value: 400 },
      { label: "Frequent ($800)", value: 800 },
      { label: "Daily ($1,500)", value: 1500 },
    ],
  },
  {
    key: "grocery",
    icon: "🛒",
    label: "Groceries",
    question: "What's your monthly grocery budget?",
    hint: "Supermarkets, Costco, farm boxes",
    max: 3000,
    defaultVal: 600,
    presets: [
      { label: "Solo ($300)", value: 300 },
      { label: "Couple ($600)", value: 600 },
      { label: "Family ($1,000)", value: 1000 },
      { label: "Large family ($1,800)", value: 1800 },
    ],
  },
  {
    key: "gas",
    icon: "⛽",
    label: "Gas & Fuel",
    question: "How much do you spend on gas monthly?",
    hint: "Petrol, diesel, EV charging",
    max: 1500,
    defaultVal: 150,
    presets: [
      { label: "Minimal ($50)", value: 50 },
      { label: "Commuter ($150)", value: 150 },
      { label: "Heavy driver ($300)", value: 300 },
      { label: "Fleet ($600)", value: 600 },
    ],
  },
  {
    key: "travel",
    icon: "✈️",
    label: "Travel",
    question: "What do you spend monthly on travel?",
    hint: "Flights, hotels, car rentals (annual total ÷ 12)",
    max: 5000,
    defaultVal: 300,
    presets: [
      { label: "Occasional ($100)", value: 100 },
      { label: "A few trips ($300)", value: 300 },
      { label: "Frequent ($700)", value: 700 },
      { label: "Road warrior ($2,000)", value: 2000 },
    ],
  },
  {
    key: "other",
    icon: "🛍️",
    label: "Shopping & Other",
    question: "Everything else — what's left?",
    hint: "Shopping, utilities, subscriptions, services",
    max: 5000,
    defaultVal: 500,
    presets: [
      { label: "Minimal ($200)", value: 200 },
      { label: "Average ($500)", value: 500 },
      { label: "Active ($1,000)", value: 1000 },
      { label: "Heavy ($2,500)", value: 2500 },
    ],
  },
];

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function scoreCard(card: CardDef, spend: Record<SpendKey, number>): number {
  const annualEarn = Object.entries(spend).reduce(
    (sum, [k, v]) => sum + v * 12 * card.rates[k as SpendKey],
    0
  );
  return annualEarn - card.annualFee;
}

function getTopCards(spend: Record<SpendKey, number>, n = 3) {
  return [...CARDS]
    .map((c) => ({ ...c, netValue: scoreCard(c, spend) }))
    .sort((a, b) => b.netValue - a.netValue)
    .slice(0, n);
}

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

export default function InteractiveTool() {
  const [toolState, setToolState] = useState<ToolState>("gate");
  const [currentStep, setCurrentStep] = useState(0);
  const [spend, setSpend] = useState<Record<SpendKey, number>>({
    dining: 400, grocery: 600, gas: 150, travel: 300, other: 500,
  });
  const [stepValue, setStepValue] = useState(STEPS[0].defaultVal);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [visible, setVisible] = useState(true);
  const [modalCard, setModalCard] = useState<(CardDef & { netValue: number }) | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const ticker = useTicker();

  // Sync stepValue when step changes
  useEffect(() => {
    setStepValue(spend[STEPS[currentStep].key]);
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
    const key = STEPS[currentStep].key;
    const newSpend = { ...spend, [key]: stepValue };
    setSpend(newSpend);

    if (currentStep < STEPS.length - 1) {
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
      setSpend({ dining: 400, grocery: 600, gas: 150, travel: 300, other: 500 });
      setStepValue(STEPS[0].defaultVal);
      // Go straight to step 1, skip gate
      setToolState("step");
    });
  };

  const openModal = (card: CardDef & { netValue: number }) => {
    setModalCard(card);
    setCardFlipped(false);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalCard(null);
    document.body.style.overflow = "";
  };

  /* ── Calculated values ── */
  const totalMonthly = Object.values(spend).reduce((a, b) => a + b, 0);
  const annualSpend = totalMonthly * 12;
  const currentEarn = annualSpend * BASE_RATE;
  const topCards = getTopCards(spend);
  const bestNetValue = topCards[0]?.netValue ?? 0;
  const leak = Math.max(0, bestNetValue - currentEarn);

  const step = STEPS[currentStep];
  const pct = Math.min((stepValue / step.max) * 100, 100);
  const progress = ((currentStep) / STEPS.length) * 100;

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
                Answer 5 quick questions. We&apos;ll calculate your exact reward leak and
                show you which Canadian cards would earn you more — right now.
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
                <span>5 questions</span>
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
                <span className="step-count-total">{STEPS.length}</span>
              </div>

              {/* Icon + Question */}
              <div className="step-icon">{step.icon}</div>
              <h2 className="step-question">{step.question}</h2>
              <p className="step-hint">{step.hint}</p>

              {/* Current value display */}
              <div className="step-amount-display">
                <span className="step-amount-value">{fmt(stepValue)}</span>
                <span className="step-amount-label">per month</span>
              </div>

              {/* Slider */}
              <div className="step-slider-wrap">
                <input
                  type="range"
                  className="step-slider"
                  min={0}
                  max={step.max}
                  step={10}
                  value={stepValue}
                  style={{ "--pct": `${pct}%` } as React.CSSProperties}
                  onChange={(e) => setStepValue(+e.target.value)}
                />
                <div className="step-slider-labels">
                  <span>$0</span>
                  <span>{fmt(step.max)}</span>
                </div>
              </div>

              {/* Quick presets */}
              <div className="step-presets">
                {step.presets.map((p) => (
                  <button
                    key={p.label}
                    className={`step-preset${stepValue === p.value ? " active" : ""}`}
                    onClick={() => handlePreset(p.value)}
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
                  {currentStep < STEPS.length - 1 ? "Next →" : "See Results →"}
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
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════
              RESULT — card recommendation
          ════════════════════════════════ */}
          {toolState === "result" && (
            <div className={`result-shell${visible ? " result-visible" : ""} result-${animDir}`}>
              {/* Header */}
              <div className="result-header">
                <div className="result-eyebrow">Your personalised analysis</div>
                <h2 className="result-title">
                  You&apos;re leaving{" "}
                  <span className="result-leak">{fmt(leak)}</span>
                  <br />
                  on the table <span className="ital">every year.</span>
                </h2>
              </div>

              {/* Stats row */}
              <div className="result-stats">
                <div className="result-stat">
                  <div className="result-stat-num">{fmt(annualSpend)}</div>
                  <div className="result-stat-label">Annual spend</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-num">{fmt(currentEarn)}</div>
                  <div className="result-stat-label">Current rewards</div>
                </div>
                <div className="result-stat accent">
                  <div className="result-stat-num">{fmt(bestNetValue)}</div>
                  <div className="result-stat-label">With best card</div>
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
            <a
              href={modalCard.bankUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-modal-cta"
              onClick={() => fetch("/api/track-click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: modalCard.id }) }).catch(() => {})}
            >
              Apply at {modalCard.issuer} →
            </a>
          </div>

          {/* Right: rotating card */}
          <div className="card-modal-right">
            <div
              className={`card-modal-spinner${cardFlipped ? " flipped" : ""}`}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
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
              <div className="card-modal-spin-back">
                <div className="card-modal-back-stripe" />
                <div className="card-modal-back-sig" />
                <div className="card-modal-back-label">Tap to flip</div>
              </div>
            </div>
            <div className="card-modal-spin-hint">Click card to flip</div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { useCatalog } from "@/context/CatalogContext";
import { rankCards } from "@/lib/rewardModel";
import { fmt, type SpendKey } from "@/lib/cards";
import styles from "./CalculatorPreview.module.css";

// Illustrative profiles only: changing these never changes calculator answers.
const PROFILES: { label: string; spend: Record<SpendKey, number> }[] = [
  { label: "Everyday", spend: { grocery: 600, dining: 400, gas: 150, travel: 300, other: 500 } },
  { label: "Food lover", spend: { grocery: 800, dining: 700, gas: 100, travel: 100, other: 250 } },
  { label: "Traveller", spend: { grocery: 250, dining: 200, gas: 100, travel: 1000, other: 400 } },
];
const CATEGORIES: [SpendKey, string][] = [["grocery", "Groceries"], ["dining", "Dining"], ["travel", "Travel"], ["gas", "Gas"], ["other", "Other"]];

export default function CalculatorPreview() {
  const [active, setActive] = useState(0);
  const catalog = useCatalog();
  const profile = PROFILES[active];
  const card = rankCards(profile.spend, catalog)[0];
  if (!card) return null;
  const monthly = Object.values(profile.spend).reduce((sum, value) => sum + value, 0);
  const baseline = monthly * 12 * 0.01;
  const difference = card.netValue - baseline;
  const scale = Math.max(baseline, card.netValue, 1);

  return (
    <div className={styles.panel}>
      <div className={styles.heading}>
        <span className={styles.eyebrow}>A clearer card match</span>
        <h3>Your spending.<br />Your next card.</h3>
        <p>Try a sample monthly budget.</p>
      </div>
      <div className={styles.profiles} role="group" aria-label="Illustrative spending profile">
        {PROFILES.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>{item.label}</button>
        ))}
      </div>
      <div key={active} className={styles.result} aria-live="polite" aria-atomic="true">
        <div className={styles.spotlight}>
          <div className={styles.art}>
            {card.img ? <Image src={card.img} alt={card.name} fill sizes="(max-width: 540px) 230px, 260px" style={{ objectFit: "contain" }} /> : <span>{card.issuer}</span>}
          </div>
          <div className={styles.value}>
            <span>Estimated annual value</span>
            <strong>{fmt(card.netValue)}</strong>
            <small>after the {fmt(card.annualFee)} annual fee</small>
          </div>
        </div>
        <div className={styles.cardName}><span>Top estimate for this example</span><h4>{card.name}</h4></div>
        <div className={styles.comparison}>
          <div className={styles.barLabel}><span>Basic 1% card · no fee</span><strong>{fmt(baseline)}</strong></div>
          <div className={styles.track}><div className={styles.baseline} style={{ width: `${baseline / scale * 100}%` }} /></div>
          <div className={styles.barLabel}><span>This card · after fee</span><strong>{fmt(card.netValue)}</strong></div>
          <div className={styles.track}><div className={styles.matched} style={{ width: `${Math.max(0, card.netValue) / scale * 100}%` }} /></div>
          <p className={styles.uplift}><strong>{difference >= 0 ? "+" : "−"}{fmt(Math.abs(difference))}</strong> {difference >= 0 ? "more" : "less"} per year in this example</p>
        </div>
      </div>
      <div className={styles.budget}>
        <div className={styles.budgetTitle}><span>Monthly spending</span><strong>{fmt(monthly)}</strong></div>
        <div className={styles.chips}>{CATEGORIES.map(([key, label]) => <span key={key}>{label} <b>{fmt(profile.spend[key])}</b></span>)}</div>
      </div>
      <p className={styles.note}>Illustrative profile, not a personalized recommendation. Eligibility not checked. Estimates exclude welcome offers, fee waivers and reward caps.</p>
    </div>
  );
}

import Image from "next/image";
import type { CSSProperties } from "react";
import ClearFinWordmark from "@/components/ClearFinWordmark";

const SPENDING = [
  {
    label: "Groceries",
    amount: "$600/mo",
    icon: <><path d="M5 8h14l-1.3 10H6.3L5 8Z" /><path d="M8 8a4 4 0 0 1 8 0" /></>,
  },
  {
    label: "Dining",
    amount: "$400/mo",
    icon: <><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10v11M11.5 3v18M11.5 11c4 0 6-2.2 6-5.2V3" /></>,
  },
  {
    label: "Travel",
    amount: "$300/mo",
    icon: <><path d="m3 13 18-8-7 16-2.5-6.5L3 13Z" /><path d="m11.5 14.5 4-4" /></>,
  },
] as const;

export default function CalculatorPreview() {
  return (
    <div className="match-motion">
      <svg className="match-route" viewBox="0 0 520 430" aria-hidden="true">
        <defs>
          <linearGradient id="matchRouteBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9d6ce" />
            <stop offset="0.55" stopColor="#0071e3" />
            <stop offset="1" stopColor="#2997ff" />
          </linearGradient>
        </defs>
        <path className="match-route-line match-route-one" pathLength="1" d="M118 128C166 128 166 181 211 197" />
        <path className="match-route-line match-route-two" pathLength="1" d="M118 215H208" />
        <path className="match-route-line match-route-three" pathLength="1" d="M118 302C166 302 166 249 211 233" />
        <path className="match-route-line match-route-out" pathLength="1" d="M294 215C333 215 344 191 374 177" />
      </svg>

      <div className="story-inputs">
        <span className="story-kicker">SAMPLE MONTHLY SPENDING</span>
        {SPENDING.map((item, index) => (
          <div className="story-input" key={item.label} style={{ "--story-index": index } as CSSProperties}>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg>
            </span>
            <p><strong>{item.label}</strong><small>{item.amount}</small></p>
          </div>
        ))}
      </div>

      <div className="story-engine">
        <div className="story-engine-ring" />
        <ClearFinWordmark className="story-engine-wordmark" />
        <small>FINDING YOUR FIT</small>
      </div>

      <div className="story-result">
        <span className="story-result-label">BEST FIT · EST. $702/YR</span>
        <div className="story-card-art">
          <Image
            src="/cards/Scotiabank-gold-amex.avif"
            alt=""
            fill
            loading="eager"
            sizes="210px"
          />
        </div>
        <p><strong>One card comes forward.</strong><small>Matched to how you actually spend.</small></p>
        <div className="story-impact">
          <span>With a basic 1% card</span>
          <strong>−$468 <small>/ year</small></strong>
          <b>potential rewards left behind</b>
        </div>
      </div>
    </div>
  );
}

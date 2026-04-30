"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

/* ── Main carousel cards ── */
const CARDS = [
  {
    name: "Amex Cobalt",
    cat: "5x Dining · Streaming · 5% back",
    issuer: "American Express",
    img: "/cards/amex-cobalt.avif",
    badge: "Best Dining",
  },
  {
    name: "Scotiabank Gold Amex",
    cat: "6x Groceries · 5x Dining · 3x Gas",
    issuer: "Scotiabank",
    img: "/cards/scotia-gold-amex.webp",
    badge: "Best Grocery",
  },
  {
    name: "TD Aeroplan Infinite",
    cat: "1.5x on everything · Air Canada miles",
    issuer: "TD Bank",
    img: "/cards/td-aeroplan-infinite.jpeg",
    badge: "Best Travel",
  },
  {
    name: "RBC Avion Visa Infinite",
    cat: "1.25x on everything · Flexible transfer",
    issuer: "RBC",
    img: "/cards/rbc-avion-infinite.webp",
    badge: "Most Flexible",
  },
  {
    name: "Amex Platinum",
    cat: "3x travel · Lounge access · $700 in credits",
    issuer: "American Express",
    img: "/cards/amex-platinum.avif",
    badge: "Premium Pick",
  },
  {
    name: "Wealthsimple Card",
    cat: "1% in Cash or Crypto · No annual fee",
    issuer: "Wealthsimple",
    img: "/cards/wealthsimple.webp",
    badge: "No-Fee Hero",
  },
];

/* ── Marquee strip cards (all available real images) ── */
const MARQUEE = [
  { img: "/cards/amex-cobalt.avif",        label: "Amex Cobalt" },
  { img: "/cards/scotia-gold-amex.webp",   label: "Scotia Gold" },
  { img: "/cards/td-aeroplan-infinite.jpeg", label: "TD Aeroplan" },
  { img: "/cards/rbc-avion-infinite.webp", label: "RBC Avion" },
  { img: "/cards/amex-platinum.avif",      label: "Amex Platinum" },
  { img: "/cards/bmo-eclipse.webp",        label: "BMO Eclipse" },
  { img: "/cards/bmo-ascend.webp",         label: "BMO Ascend WE" },
  { img: "/cards/bmo-cashback-we.webp",    label: "BMO Cashback WE" },
  { img: "/cards/wealthsimple.webp",       label: "Wealthsimple" },
  { img: "/cards/tangerine.webp",          label: "Tangerine" },
  { img: "/cards/simplii.webp",            label: "Simplii" },
  { img: "/cards/rbc-ion-plus.webp",       label: "RBC ion+" },
  { img: "/cards/rbc-westjet-we.webp",     label: "WestJet RBC WE" },
  { img: "/cards/rbc-cashback-we.webp",    label: "RBC CashBack WE" },
  { img: "/cards/scotia-passport.webp",    label: "Scotia Passport" },
  { img: "/cards/td-cashback-infinite.jpeg", label: "TD CashBack" },
  { img: "/cards/td-first-class.jpeg",     label: "TD First Class" },
  { img: "/cards/amex-gold.avif",          label: "Amex Gold" },
  { img: "/cards/amex-aeroplan.png",       label: "Amex Aeroplan" },
  { img: "/cards/rogers-we.png",           label: "Rogers WE" },
  { img: "/cards/pc-we.webp",              label: "PC WE" },
  { img: "/cards/nb-world-elite.png",      label: "NB World Elite" },
  { img: "/cards/amex-simplycash.webp",    label: "Amex SimplyCash" },
  { img: "/cards/scotia-scene-plus.webp",  label: "Scotia Scene+" },
];

export default function CardParade() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const prev = () => setActive((a) => (a - 1 + CARDS.length) % CARDS.length);
  const next = () => setActive((a) => (a + 1) % CARDS.length);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setInterval(next, 4000);
        } else {
          clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => { io.disconnect(); clearInterval(timer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="showcase" ref={sectionRef}>
      <div className="section-num">03 / Showcase</div>
      <div className="showcase-wrap">
        <div className="showcase-head reveal">
          <div className="showcase-eyebrow">Every issuer · Every category</div>
          <h2 className="showcase-title">
            One app. Every card. <span className="ital">One verdict.</span>
          </h2>
        </div>

        {/* ── 3D photo carousel ── */}
        <div className="parade">
          {CARDS.map((c, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const style: React.CSSProperties = {
              transform: `translateX(${offset * 200}px) translateZ(${-abs * 110}px) rotateY(${offset * -20}deg)`,
              opacity: abs > 2 ? 0 : 1 - abs * 0.28,
              zIndex: 10 - abs,
              transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
            };
            return (
              <div
                key={c.name}
                className="parade-card parade-photo-card"
                style={style}
                onClick={() => setActive(i)}
              >
                {c.badge && (
                  <span className="parade-badge">{c.badge}</span>
                )}
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  sizes="280px"
                  style={{ objectFit: "cover", borderRadius: "inherit" }}
                  priority={i === 0}
                />
                <div className="parade-photo-overlay" />
              </div>
            );
          })}
        </div>

        <div className="parade-info">
          <div className="parade-name">{CARDS[active].name}</div>
          <div className="parade-cat">{CARDS[active].cat}</div>
          <div className="parade-issuer">{CARDS[active].issuer}</div>
        </div>

        <div className="parade-controls">
          <button className="parade-ctrl" onClick={prev} aria-label="Previous">←</button>
          <div className="parade-dots">
            {CARDS.map((_, i) => (
              <button
                key={i}
                className={`parade-dot${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Card ${i + 1}`}
              />
            ))}
          </div>
          <button className="parade-ctrl" onClick={next} aria-label="Next">→</button>
        </div>
      </div>

      {/* ── Infinite marquee strip ── */}
      <div className="marquee-wrap">
        <div className="marquee-eyebrow">107 cards tracked · 17 issuers covered</div>
        <div className="marquee-track">
          <div className="marquee-reel">
            {[...MARQUEE, ...MARQUEE].map((c, i) => (
              <div className="marquee-item" key={i}>
                <div className="marquee-img-wrap">
                  <Image
                    src={c.img}
                    alt={c.label}
                    fill
                    sizes="160px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <span className="marquee-label">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-divider-bottom" />
    </section>
  );
}

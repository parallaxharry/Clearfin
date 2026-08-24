"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent, WheelEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hero showcase deck.
 *
 * Ordered by FinlyWealth payout, except the front slot: the owner swapped
 * BMO VIPorter out (its only art is portrait, 378x600, and rendered badly
 * in the landscape frame) for Tangerine Rewards World Elite. Commercially
 * featured selection rather than an editorial pick. The eyebrow says
 * "Featured" rather than "shortlist" for that reason, and the per-card
 * "Best for …" labels were removed — they were never rendered, and keeping
 * merit language on a commercially ordered list would have been misleading.
 *
 * The calculator, comparison tool and best-X pages are unaffected and remain
 * ranked purely on the user's spending.
 */
const FEATURED_CARDS = [
  {
    id: "tangerine-rewards-world-elite",
    name: "Tangerine Rewards World Elite Mastercard",
    issuer: "Tangerine",
    image: "/cards/tangerine-rewards-world-elite.webp",
  },
  {
    id: "scotia-passport-privilege",
    name: "Scotia Passport Visa Infinite Privilege",
    issuer: "Scotiabank",
    image: "/cards/scotia-passport-privilege.avif",
  },
  {
    id: "scotia-platinum",
    name: "Scotiabank Platinum Amex",
    issuer: "Scotiabank",
    image: "/cards/scotia-platinum.webp",
  },
  {
    id: "scotia-gold",
    name: "Scotia Gold Amex",
    issuer: "Scotiabank",
    image: "/cards/Scotiabank-gold-amex.avif",
  },
  {
    id: "amex-gold",
    name: "Amex Gold Rewards",
    issuer: "American Express",
    image: "/cards/amex-gold.avif",
  },
  {
    id: "scotia-momentum-infinite",
    name: "Scotia Momentum Visa Infinite",
    issuer: "Scotiabank",
    image: "/cards/scotia-momentum-infinite.webp",
  },
  {
    id: "amex-platinum",
    name: "Amex Platinum Card",
    issuer: "American Express",
    image: "/cards/amex-platinum.avif",
  },
  {
    id: "bmo-blue-world-elite",
    name: "BMO Blue Rewards World Elite Mastercard",
    issuer: "BMO",
    image: "/cards/bmo-blue-world-elite.webp",
  },
  {
    id: "td-first-class",
    name: "TD First Class Travel Visa Infinite",
    issuer: "TD Bank",
    image: "/cards/td-first-class.jpeg",
  },
  {
    id: "scotiabank-student",
    name: "Scotiabank Scene+ Student Visa",
    issuer: "Scotiabank",
    image: "/cards/scotia_no_fee_visa.webp",
  },
] as const;

function circularOffset(index: number, active: number) {
  let offset = index - active;
  const midpoint = FEATURED_CARDS.length / 2;
  if (offset > midpoint) offset -= FEATURED_CARDS.length;
  if (offset < -midpoint) offset += FEATURED_CARDS.length;
  return offset;
}

export default function HeroCardCarousel() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const lastWheel = useRef(0);

  const step = useCallback((direction: number) => {
    setActive((current) => {
      const next = (current + direction + FEATURED_CARDS.length) % FEATURED_CARDS.length;
      return next;
    });
  }, []);

  useEffect(() => {
    if (interacting) return;
    const timer = window.setInterval(() => step(1), 4200);
    return () => window.clearInterval(timer);
  }, [interacting, step]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    dragged.current = false;
    setInteracting(true);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current !== null) {
      const distance = event.clientX - pointerStart.current;
      if (Math.abs(distance) > 34) {
        dragged.current = true;
        step(distance < 0 ? 1 : -1);
      }
    }
    pointerStart.current = null;
    setInteracting(false);
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) < 14 || Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
    const now = Date.now();
    if (now - lastWheel.current < 450) return;
    lastWheel.current = now;
    step(event.deltaX > 0 ? 1 : -1);
  };

  const selected = FEATURED_CARDS[active];

  return (
    <div
      className="hero-card-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="ClearFin top 10 Canadian credit cards"
      tabIndex={0}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
        setInteracting(false);
      }}
      onWheel={onWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") step(-1);
        if (event.key === "ArrowRight") step(1);
      }}
    >
      <div className="hero-carousel-ambient" aria-hidden="true" />

      <div className="hero-carousel-topline">
        <span>10 Canadian cards · Featured</span>
      </div>

      <div className="hero-carousel-stage" aria-live="polite">
        {FEATURED_CARDS.map((card, index) => {
          const offset = circularOffset(index, active);
          const distance = Math.abs(offset);
          const style = {
            "--card-x": `${offset * 98}px`,
            "--card-y": `${distance * 18}px`,
            "--card-rotate": `${offset * -7}deg`,
            "--card-tilt": `${offset * -13}deg`,
            "--card-scale": Math.max(0.68, 1 - distance * 0.15),
            "--card-opacity": distance === 0 ? 1 : distance === 1 ? 0.72 : 0.34,
            zIndex: 10 - distance,
          } as CSSProperties;

          return (
            <Link
              href={`/credit-cards/${card.id}`}
              className={`hero-carousel-card${offset === 0 ? " is-active" : ""}${distance > 2 ? " is-hidden" : ""}`}
              style={style}
              aria-label={`View ${card.name}`}
              aria-current={offset === 0 ? "true" : undefined}
              onClick={(event) => {
                if (dragged.current) {
                  event.preventDefault();
                  dragged.current = false;
                }
              }}
              key={card.id}
            >
              <Image
                src={card.image}
                alt={`${card.name} credit card`}
                width={420}
                height={265}
                sizes="(max-width: 700px) 210px, 250px"
                loading={index < 5 ? "eager" : "lazy"}
              />
              <span className="hero-card-reflection" aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      <div className="hero-carousel-details">
        <div className="hero-carousel-copy">
          <strong>{selected.name}</strong>
        </div>
        <Link href={`/credit-cards/${selected.id}`} onPointerDown={(event) => event.stopPropagation()}>
          View card <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <p className="hero-carousel-note">Rates and offers can change</p>
    </div>
  );
}

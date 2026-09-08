"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent, WheelEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { setCarouselPaused, useCarouselMotion } from "@/lib/carouselMotion";

/**
 * Hero showcase deck.
 *
 * Ordered by FinlyWealth payout, with two owner overrides. BMO VIPorter was
 * dropped (its only art is portrait, 378x600, and rendered badly in the
 * landscape frame) and Tangerine Rewards World Elite took its place; the
 * owner then asked that Tangerine not be the card shown first, so Scotia
 * Passport Privilege holds the front slot and Tangerine sits second. `active`
 * starts at 0, so index 0 is whatever the deck opens on. Commercially
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
    id: "scotia-passport-privilege",
    name: "Scotia Passport Visa Infinite Privilege",
    issuer: "Scotiabank",
    image: "/cards/scotia-passport-privilege.avif",
  },
  {
    id: "tangerine-rewards-world-elite",
    name: "Tangerine Rewards World Elite Mastercard",
    issuer: "Tangerine",
    image: "/cards/tangerine-rewards-world-elite.webp",
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
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const { paused, blocked } = useCarouselMotion();
  const rotating = !paused && !blocked && !interacting && !hovered && inView;
  const pointerStart = useRef<number | null>(null);
  const depthFrame = useRef(0);
  const depthPoint = useRef({ x: 0, y: 0 });
  const dragged = useRef(false);
  const lastWheel = useRef(0);

  const step = useCallback((direction: number) => {
    setActive((current) => {
      const next = (current + direction + FEATURED_CARDS.length) % FEATURED_CARDS.length;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => step(1), 4200);
    return () => window.clearInterval(timer);
  }, [rotating, step]);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
      if (root.current) observer.observe(root.current);
    } catch { /* Manual controls remain usable when visibility detection is unavailable. */ }
    return () => observer?.disconnect();
  }, []);

  useEffect(() => () => window.cancelAnimationFrame(depthFrame.current), []);

  const resetDepth = () => {
    if (!root.current) return;
    root.current.style.setProperty("--hero-yaw", "0deg");
    root.current.style.setProperty("--hero-pitch", "0deg");
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    depthPoint.current = { x: event.clientX, y: event.clientY };
    if (depthFrame.current) return;
    depthFrame.current = window.requestAnimationFrame(() => {
      depthFrame.current = 0;
      const element = root.current;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      const x = ((depthPoint.current.x - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((depthPoint.current.y - bounds.top) / bounds.height - 0.5) * 2;
      element.style.setProperty("--hero-yaw", `${(x * 2.4).toFixed(2)}deg`);
      element.style.setProperty("--hero-pitch", `${(y * -1.8).toFixed(2)}deg`);
    });
  };

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
      ref={root}
      className="hero-card-carousel"
      data-rotating={rotating}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Canadian credit cards"
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setCarouselPaused(true);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); resetDepth(); }}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
        setInteracting(false);
      }}
      onWheel={onWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      }}
    >
      <div className="hero-carousel-ambient" aria-hidden="true" />

      <div className="hero-carousel-topline">
        <span>10 Canadian cards · Featured</span>
      </div>

      <div className="hero-carousel-controls">
        <button type="button" disabled={blocked} onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); }}
          onClick={() => setCarouselPaused(!paused)}>{blocked ? "Automatic rotation off" : paused ? "Resume automatic rotation" : "Pause automatic rotation"}</button>
        <button type="button" aria-label="Previous featured card" onPointerDown={(event) => event.stopPropagation()} onClick={() => step(-1)}>←</button>
        <button type="button" aria-label="Next featured card" onPointerDown={(event) => event.stopPropagation()} onClick={() => step(1)}>→</button>
      </div>

      <div className="hero-carousel-stage" aria-live={rotating ? "off" : "polite"}>
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
            "--card-order": Math.min(distance, 2),
            zIndex: 10 - distance,
          } as CSSProperties;

          return (
            <Link
              href={`/credit-cards/${card.id}`}
              className={`hero-carousel-card${offset === 0 ? " is-active" : ""}${distance > 2 ? " is-hidden" : ""}`}
              style={style}
              aria-label={`View ${card.name}`}
              tabIndex={offset === 0 ? 0 : -1}
              aria-hidden={offset !== 0}
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

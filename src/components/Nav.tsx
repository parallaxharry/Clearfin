"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchTrigger from "@/components/SearchTrigger";
import ClearFinWordmark from "@/components/ClearFinWordmark";
import HomeLogoLink from "@/components/HomeLogoLink";

function NavIcon({ type }: { type: "card" | "compare" | "calculator" | "learn" }) {
  if (type === "card") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/></svg>;
  }
  if (type === "compare") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16M17 4v16M4 7l3-3 3 3M14 17l3 3 3-3"/></svg>;
  }
  if (type === "calculator") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23V5.5Z"/></svg>;
}

const CARD_MENU = [
  {
    href: "/best-credit-cards-canada",
    title: "Best Credit Cards",
    sub: "Top picks across every category",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.8z"/></svg>,
  },
  {
    href: "/best-cashback-credit-cards-canada",
    title: "Cashback Cards",
    sub: "Real money back on daily spending",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M14.6 9.3c-.6-.8-1.5-1.3-2.6-1.3-1.7 0-2.9.9-2.9 2.1 0 2.8 5.8 1.5 5.8 4.2 0 1.2-1.2 2.1-2.9 2.1-1.1 0-2.1-.5-2.7-1.3"/></svg>,
  },
  {
    href: "/best-travel-credit-cards-canada",
    title: "Travel Cards",
    sub: "Points, lounges and flight perks",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z"/><path d="m10 13 4.5-4.5"/></svg>,
  },
  {
    href: "/best-grocery-credit-cards-canada",
    title: "Grocery Cards",
    sub: "Bigger returns at the checkout",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="16.5" cy="19.5" r="1.4"/><path d="M3 4.5h2.3L7.8 15h10.4l2.3-8H6.2"/></svg>,
  },
  {
    href: "/best-no-fee-credit-cards-canada",
    title: "No-Fee Cards",
    sub: "Rewards without an annual fee",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 18.5 18.5 5.5"/><circle cx="7.5" cy="7.5" r="2.4"/><circle cx="16.5" cy="16.5" r="2.4"/></svg>,
  },
  {
    href: "/best-student-credit-cards-canada",
    title: "Student Cards",
    sub: "Build credit while you study",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4.5 9.5 4L12 12.5l-9.5-4 9.5-4Z"/><path d="M6.5 10.5V15c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5"/></svg>,
  },
  {
    href: "/credit-cards",
    title: "All Credit Cards",
    sub: "Browse the full catalogue",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/></svg>,
  },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [mobileCardsOpen, setMobileCardsOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ddOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDdOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ddOpen]);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <HomeLogoLink className="logo" onActivate={() => setMenuOpen(false)}>
        <ClearFinWordmark className="logo-word" />
      </HomeLogoLink>

      <nav className="nav-links" aria-label="Main navigation">
        <div
          className={`nav-dd${ddOpen ? " open" : ""}`}
          ref={ddRef}
          onMouseEnter={() => setDdOpen(true)}
          onMouseLeave={() => setDdOpen(false)}
        >
          <button
            type="button"
            className="nav-dd-trigger"
            aria-expanded={ddOpen}
            aria-haspopup="true"
            onClick={() => setDdOpen((open) => !open)}
          >
            <NavIcon type="card" />
            Credit Cards
            <svg className="nav-dd-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9.5 6 6 6-6"/></svg>
          </button>
          {ddOpen && (
            <div className="nav-dd-panel">
              <div className="nav-dd-card">
                {CARD_MENU.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-dd-item" onClick={() => setDdOpen(false)}>
                    <span className="nav-dd-item-icon">{item.icon}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.sub}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link href="/compare-credit-cards-canada"><NavIcon type="compare" />Compare</Link>
        <Link href="/credit-card-calculator-canada"><NavIcon type="calculator" />Calculator</Link>
        <Link href="/blog"><NavIcon type="learn" />Blogs</Link>
      </nav>

      <div className="nav-right">
        <SearchTrigger className="nav-search" />
        <Link href="/credit-card-calculator-canada" className="nav-cta">
          Find my best card
        </Link>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
        <button
          type="button"
          className={`mobile-nav-dd-toggle${mobileCardsOpen ? " open" : ""}`}
          aria-expanded={mobileCardsOpen}
          onClick={() => setMobileCardsOpen((open) => !open)}
        >
          <NavIcon type="card" />
          Credit Cards
          <svg className="nav-dd-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9.5 6 6 6-6"/></svg>
        </button>
        {mobileCardsOpen && (
          <div className="mobile-nav-sub">
            {CARD_MENU.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => { setMenuOpen(false); setMobileCardsOpen(false); }}>
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        )}
        <Link href="/compare-credit-cards-canada" onClick={() => setMenuOpen(false)}><NavIcon type="compare" />Compare</Link>
        <Link href="/credit-card-calculator-canada" onClick={() => setMenuOpen(false)}><NavIcon type="calculator" />Calculator</Link>
        <Link href="/blog" onClick={() => setMenuOpen(false)}><NavIcon type="learn" />Blogs</Link>
      </nav>
    </header>
  );
}

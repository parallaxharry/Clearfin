"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchTrigger from "@/components/SearchTrigger";
import ClearFinWordmark from "@/components/ClearFinWordmark";

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

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <Link href="/" className="logo" aria-label="ClearFin home">
        <ClearFinWordmark className="logo-word" />
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/credit-cards"><NavIcon type="card" />Credit Cards</Link>
        <Link href="/compare-credit-cards-canada"><NavIcon type="compare" />Compare</Link>
        <Link href="/credit-card-calculator-canada"><NavIcon type="calculator" />Calculator</Link>
        <Link href="/credit-card-rewards-canada-guide"><NavIcon type="learn" />Learn</Link>
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
        <Link href="/credit-cards" onClick={() => setMenuOpen(false)}><NavIcon type="card" />Credit Cards</Link>
        <Link href="/compare-credit-cards-canada" onClick={() => setMenuOpen(false)}><NavIcon type="compare" />Compare</Link>
        <Link href="/credit-card-calculator-canada" onClick={() => setMenuOpen(false)}><NavIcon type="calculator" />Calculator</Link>
        <Link href="/credit-card-rewards-canada-guide" onClick={() => setMenuOpen(false)}><NavIcon type="learn" />Learn</Link>
      </nav>
    </header>
  );
}

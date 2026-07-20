"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SearchTrigger from "@/components/SearchTrigger";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="/#hero" className="logo">
        <div className="logo-mark">
          <Image src="/logo.png" alt="ClearFin" width={40} height={40} priority />
        </div>
        <div className="logo-word">
          <span className="clear">Clear</span>
          <span className="fin">Fin</span>
        </div>
      </a>

      <nav className="nav-links">
        <a href="/credit-card-calculator-canada">Calculator</a>
        <a href="/credit-cards">Cards</a>
        <a href="/compare-credit-cards-canada">Compare</a>
        <a href="/credit-card-rewards-canada-guide">Rewards Guide</a>
        <a href="/early-access">Waitlist</a>
      </nav>

      <div className="nav-right">
        <SearchTrigger className="nav-search" />
        <a href="/early-access" className="nav-cta">
          Get Early Access
        </a>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#hero" className="logo">
        <div className="logo-mark">
          <Image src="/logo.png" alt="ClearFin" width={40} height={40} priority />
        </div>
        <div className="logo-word">
          <span className="clear">Clear</span>
          <span className="fin">Fin</span>
        </div>
      </a>

      <nav className="nav-links">
        <a href="#tool">Calculator</a>
        <a href="#showcase">Cards</a>
        <a href="#feat-1">Features</a>
        <a href="#waitlist">Waitlist</a>
      </nav>

      <a href="#waitlist" className="nav-cta">
        Get Early Access
      </a>
    </header>
  );
}

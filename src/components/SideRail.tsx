"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero",      num: "01", label: "Hero" },
  { id: "tool",      num: "02", label: "Calculator" },
  { id: "showcase",  num: "03", label: "Top Picks" },
  { id: "statement", num: "04", label: "Analyse" },
  { id: "feat-2",    num: "05", label: "Compare" },
  { id: "feat-app",  num: "06", label: "App" },
  { id: "waitlist",  num: "07", label: "Waitlist" },
];

export default function SideRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="rail" id="rail">
      {SECTIONS.map((s) => (
        <div
          key={s.id}
          className={`rail-item${active === s.id ? " active" : ""}`}
          data-target={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
        >
          <span className="rail-num">{s.num}</span>
          <span className="rail-dot" />
        </div>
      ))}
    </nav>
  );
}

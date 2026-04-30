"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  "hero", "tool", "showcase", "feat-1", "feat-2", "feat-3", "feat-4", "waitlist",
];

export default function PageEffects() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Scroll progress + active section
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(pct);

      let cur = 0;
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i;
      });
      setActiveSection(cur);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update rail active class
  useEffect(() => {
    document.querySelectorAll(".rail-item").forEach((el, i) => {
      el.classList.toggle("active", i === activeSection);
    });
  }, [activeSection]);

  // IntersectionObserver for .reveal elements
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            if (e.target.classList.contains("feat-visual")) {
              e.target.classList.add("in-view");
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
    />
  );
}

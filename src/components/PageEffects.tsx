"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageEffects() {
  const router = useRouter();
  const progressBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const legacyRoutes: Record<string, string> = {
      "#tool": "/credit-card-calculator-canada",
      "#compare": "/compare-credit-cards-canada",
      "#showcase": "/credit-cards",
      "#waitlist": "/early-access",
      "#feat-app": "/early-access",
    };
    const destination = legacyRoutes[window.location.hash];

    if (destination) {
      router.replace(destination);
      return;
    }

    if (window.location.hash === "#hero") {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, [router]);

  useEffect(() => {
    // One compositor-friendly update per frame; no React renders or obsolete rail lookups.
    let frame = 0;
    const paint = () => {
      frame = 0;
      const h = document.documentElement;
      const distance = h.scrollHeight - h.clientHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, h.scrollTop / distance)) : 0;
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      const ambient = (progress - 0.5) * 18;
      h.style.setProperty("--page-ambient-shift", `${ambient.toFixed(2)}px`);
      h.style.setProperty("--page-ambient-return", `${(-ambient * 0.65).toFixed(2)}px`);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      document.documentElement.style.removeProperty("--page-ambient-shift");
      document.documentElement.style.removeProperty("--page-ambient-return");
    };
  }, []);

  // Content is visible in CSS; animation is a progressive enhancement.
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let io: IntersectionObserver | undefined;
    const showAll = () => {
      io?.disconnect();
      animations.forEach((animation) => animation.cancel());
      elements.forEach((el) => el.classList.add("in", "in-view"));
    };
    const onMotionChange = () => { if (media.matches) showAll(); };
    try {
      if (media.matches) { showAll(); return; }
      io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            if (e.target.classList.contains("feat-visual")) {
              e.target.classList.add("in-view");
            }
            try {
              animations.push(e.target.animate(
                [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "translateY(0)" }],
                { duration: 700, easing: "ease-out" },
              ));
            } catch { /* The visible base style remains readable. */ }
            io?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
      elements.forEach((el) => io?.observe(el));
      media.addEventListener("change", onMotionChange);
    } catch { showAll(); }
    return () => {
      showAll();
      media.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      ref={progressBar}
      aria-hidden="true"
    />
  );
}

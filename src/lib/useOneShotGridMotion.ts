"use client";

import { useEffect, useRef } from "react";

/**
 * Adds a small, one-time entrance to cards that are actually visible.
 * The base CSS stays visible, so unsupported observers/animations never hide content.
 */
export function useOneShotGridMotion<T extends HTMLElement>(dependencyKey: string) {
  const root = useRef<T>(null);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    const container = root.current;
    if (!container) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(container.querySelectorAll<HTMLElement>("[data-motion-key]"));
    if (media.matches) {
      elements.forEach(element => {
        const key = element.dataset.motionKey;
        if (key) seen.current.add(key);
      });
      return;
    }

    const animations: Animation[] = [];
    let observer: IntersectionObserver | null = null;
    const animate = (element: HTMLElement) => {
      const key = element.dataset.motionKey;
      if (!key || seen.current.has(key)) return;
      seen.current.add(key);
      const order = Math.min(5, Math.max(0, Number(element.dataset.motionOrder) || 0));
      try {
        animations.push(element.animate(
          [
            { opacity: 0, transform: "translate3d(0, 18px, 0) scale(.985)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 520, delay: order * 55, easing: "cubic-bezier(.2,.75,.25,1)" },
        ));
      } catch { /* Visible base styles remain the fallback. */ }
    };

    try {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          animate(entry.target as HTMLElement);
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      elements.forEach(element => {
        const key = element.dataset.motionKey;
        if (!key || seen.current.has(key)) return;
        observer?.observe(element);
      });
    } catch {
      // No observer means no enhancement; cards are already visible and interactive.
    }

    return () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
    };
  }, [dependencyKey]);

  return root;
}

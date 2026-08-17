"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

function slugify(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `section-${index + 1}`;
}

/** A shared on-page guide for long editorial pages, built from their h2s. */
export default function SeoTableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".seo-content > h2"),
    );
    const used = new Set<string>();
    const nextItems = headings.map((heading, index) => {
      const base = heading.id || slugify(heading.textContent ?? "", index);
      let id = base;
      let duplicate = 2;
      while (used.has(id)) id = `${base}-${duplicate++}`;
      used.add(id);
      heading.id = id;
      return { id, label: heading.textContent?.trim() || `Section ${index + 1}` };
    });
    const frame = window.requestAnimationFrame(() => {
      setItems(nextItems);
      setActiveId(nextItems[0]?.id ?? "");
    });

    if (headings.length === 0) return () => window.cancelAnimationFrame(frame);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -68% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={`seo-toc${items.length < 2 ? " is-loading" : ""}`}
      aria-label="On this page"
      aria-hidden={items.length < 2 || undefined}
    >
      <span className="seo-toc-label">On this page</span>
      <ol>
        {(items.length >= 2 ? items : [{ id: "loading", label: "Loading guide sections" }]).map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "is-active" : undefined}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

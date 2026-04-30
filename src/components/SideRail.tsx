"use client";

const SECTIONS = [
  { id: "hero", num: "01" },
  { id: "tool", num: "02" },
  { id: "showcase", num: "03" },
  { id: "feat-1", num: "04" },
  { id: "feat-2", num: "05" },
  { id: "feat-3", num: "06" },
  { id: "feat-4", num: "07" },
  { id: "waitlist", num: "08" },
];

export default function SideRail() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="rail" id="rail">
      {SECTIONS.map((s, i) => (
        <div
          key={s.id}
          className={`rail-item${i === 0 ? " active" : ""}`}
          data-target={s.id}
          onClick={() => scrollTo(s.id)}
        >
          <span className="rail-num">{s.num}</span>
          <span className="rail-dot" />
        </div>
      ))}
    </nav>
  );
}

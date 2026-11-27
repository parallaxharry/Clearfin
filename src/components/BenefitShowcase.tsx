import Image from "next/image";
import type { ResolvedShowcaseGroup, ShowcaseItem } from "@/lib/benefitShowcase";

const PANEL_ICONS: Record<NonNullable<ShowcaseItem["icon"]>, string> = {
  plane: "M2.5 19h19M4.6 14.8 2 10.5l2.2-.6 2.6 2.1 4.1-1.1L7.4 4.6l2.4-.7 6 5.6 4.3-1.2a1.8 1.8 0 0 1 .9 3.5L6.5 15.6a1.7 1.7 0 0 1-1.9-.8Z",
  car: "M5 16.5h14M5 16.5a1.75 1.75 0 1 0 3.5 0M15.5 16.5a1.75 1.75 0 1 0 3.5 0M3.5 16.5v-4l2-5h13l2 5v4M3.5 12.5h17M8 9.5h8",
  bag: "M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2",
};

/**
 * Grouped, photo-led layout for benefits and coverage (see src/lib/benefitShowcase.ts).
 * Server component: the "+" uses <details>, so it works without JavaScript.
 */
export default function BenefitShowcase({
  groups,
  cardName,
}: {
  groups: ResolvedShowcaseGroup[];
  cardName: string;
}) {
  return (
    <div className="bshow">
      {groups.map((group) => (
        <section className={`bshow-group bshow-${group.variant}`} key={group.title}>
          <header className="bshow-group-head">
            <h3>{group.title}</h3>
            <p>{group.subtitle}</p>
          </header>
          <div className="bshow-grid">
            {group.items.map((item) => {
              const key = Array.isArray(item.match) ? item.match.join("|") : item.match;
              const single = item.details.length === 1 ? item.details[0] : null;
              const hasMore = single ? Boolean(single.description) && single.description !== item.summary : item.details.length > 1;
              return (
                <article className="bshow-card" key={key}>
                  {group.variant === "photo" ? (
                    item.image ? (
                      <div className="bshow-media">
                        <Image
                          src={item.image}
                          alt={item.imageAlt ?? ""}
                          fill
                          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
                          quality={75}
                        />
                      </div>
                    ) : (
                      <div className="bshow-media bshow-media-stat" aria-hidden="true">
                        {item.stat ? (
                          <span>{item.stat}</span>
                        ) : item.icon ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d={PANEL_ICONS[item.icon]} />
                          </svg>
                        ) : null}
                      </div>
                    )
                  ) : null}
                  <div className="bshow-body">
                    <h4>{item.headline}</h4>
                    <p className="bshow-summary">{item.summary}</p>
                    {item.note ? <p className="bshow-note">{item.note}</p> : null}
                    {hasMore ? (
                      <details className="bshow-more">
                        <summary aria-label={`Full details: ${item.headline} on the ${cardName}`}>
                          <span className="bshow-more-label">
                            {single ? "Details" : `All ${item.details.length} coverages`}
                          </span>
                          <span className="bshow-plus" aria-hidden="true" />
                        </summary>
                        {single ? (
                          <p>{single.description}</p>
                        ) : (
                          <ul>
                            {item.details.map((d) => (
                              <li key={d.title}>
                                <strong>{d.title}</strong>
                                {d.description ? <span>{d.description}</span> : null}
                              </li>
                            ))}
                          </ul>
                        )}
                      </details>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

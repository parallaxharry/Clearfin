import Image from "next/image";
import type { ResolvedShowcaseGroup } from "@/lib/benefitShowcase";

/**
 * Grouped, photo-led benefits layout (see src/lib/benefitShowcase.ts).
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
            {group.items.map((item) => (
              <article className="bshow-card" key={item.match}>
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
                      <span>{item.stat}</span>
                    </div>
                  )
                ) : null}
                <div className="bshow-body">
                  <h4>{item.headline}</h4>
                  <p className="bshow-summary">{item.summary}</p>
                  {item.note ? <p className="bshow-note">{item.note}</p> : null}
                  {item.description && item.description !== item.summary ? (
                    <details className="bshow-more">
                      <summary aria-label={`Full details: ${item.headline} on the ${cardName}`}>
                        <span className="bshow-more-label">Details</span>
                        <span className="bshow-plus" aria-hidden="true" />
                      </summary>
                      <p>{item.description}</p>
                    </details>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

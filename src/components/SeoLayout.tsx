import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import SeoTableOfContents from "@/components/SeoTableOfContents";
import SiteFooter from "@/components/SiteFooter";

interface SeoLayoutProps {
  title: string;
  subtitle: string;
  breadcrumb: { label: string; href: string }[];
  lastUpdated: string;
  eyebrow?: string;
  heroImage?: string | null;
  heroImageAlt?: string;
  children: React.ReactNode;
}

export default function SeoLayout({
  title,
  subtitle,
  breadcrumb,
  lastUpdated,
  eyebrow = "ClearFin editorial guide",
  heroImage,
  heroImageAlt,
  children,
}: SeoLayoutProps) {
  const heroIsCardArt = heroImage?.startsWith("/cards/");

  return (
    <div className="seo-page">
      {/* ── Nav (shared site-wide) ── */}
      <Nav />

      <main className="seo-main">
        {/* ── Breadcrumb ── */}
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.href}>
              {i < breadcrumb.length - 1 ? (
                <>
                  <Link href={crumb.href}>{crumb.label}</Link>
                  <span className="seo-breadcrumb-sep" aria-hidden="true">
                    {" "}›{" "}
                  </span>
                </>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* ── Hero ── */}
        <header className={`seo-hero${heroImage ? " has-image" : ""}`}>
          <div className="seo-hero-copy">
            <p className="seo-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="seo-hero-sub">{subtitle}</p>
            <div className="seo-hero-meta">
              <span className="seo-updated">Last updated: {lastUpdated}</span>
              <span>Independent Canadian guide</span>
              <span>Issuer terms checked before applying</span>
            </div>
          </div>
          {heroImage ? (
            <figure
              className="seo-hero-image"
              style={
                heroIsCardArt
                  ? {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #f8fafc 0%, #eef3f8 100%)",
                      padding: "34px",
                    }
                  : undefined
              }
            >
              {heroIsCardArt ? (
                <Image
                  src={heroImage}
                  alt={heroImageAlt ?? title}
                  width={1200}
                  height={760}
                  sizes="(max-width: 720px) 84vw, (max-width: 1100px) 36vw, 390px"
                  quality={92}
                  style={{
                    width: "92%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "14px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
                  }}
                  preload
                />
              ) : (
                <Image
                  src={heroImage}
                  alt={heroImageAlt ?? title}
                  fill
                  sizes="(max-width: 720px) 92vw, (max-width: 1100px) 40vw, 430px"
                  quality={90}
                  style={{ objectFit: "cover" }}
                  preload
                />
              )}
            </figure>
          ) : null}
        </header>

        {/* ── Article body with shared on-page navigation ── */}
        <div className="seo-article-shell">
          <aside className="seo-toc-rail">
            <SeoTableOfContents />
          </aside>
          <article className="seo-content">{children}</article>
        </div>

        {/* ── Bottom CTA ── */}
        <section className="seo-cta">
          <span className="seo-cta-kicker">Free · No sign-up required</span>
          <h2>See which card fits your spending</h2>
          <p>
            Enter your real monthly spending and compare estimated rewards after annual fees.
          </p>
          <Link href="/credit-card-calculator-canada" className="seo-cta-btn">
            Find my best card →
          </Link>
          <div className="seo-cta-trust">
            <span>Canadian cards</span>
            <span>Fees included</span>
            <span>About 30 seconds</span>
          </div>
        </section>
      </main>

      {/* ── Footer (shared site-wide) ── */}
      <SiteFooter />
    </div>
  );
}

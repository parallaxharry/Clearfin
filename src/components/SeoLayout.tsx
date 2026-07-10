import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

interface SeoLayoutProps {
  title: string;
  subtitle: string;
  breadcrumb: { label: string; href: string }[];
  lastUpdated: string;
  children: React.ReactNode;
}

export default function SeoLayout({
  title,
  subtitle,
  breadcrumb,
  lastUpdated,
  children,
}: SeoLayoutProps) {
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
        <header className="seo-hero">
          <h1>{title}</h1>
          <p className="seo-hero-sub">{subtitle}</p>
          <span className="seo-updated">Last updated: {lastUpdated}</span>
        </header>

        {/* ── Article body ── */}
        <article className="seo-content">{children}</article>

        {/* ── Bottom CTA ── */}
        <section className="seo-cta">
          <h2>Find your best card</h2>
          <p>
            Match your spending to the card that rewards you most.
          </p>
          <Link href="/credit-card-calculator-canada" className="seo-cta-btn">
            Try the Calculator →
          </Link>
        </section>
      </main>

      {/* ── Footer (shared site-wide) ── */}
      <SiteFooter />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import SearchTrigger from "@/components/SearchTrigger";

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
      {/* ── Nav ── */}
      <header className="seo-nav">
        <Link href="/" className="seo-nav-logo">
          <div className="seo-nav-logo-mark">
            <Image src="/cf-logo.svg" alt="ClearFin" width={36} height={36} />
          </div>
          <div className="seo-nav-logo-word">
            <span className="clear">Clear</span>
            <span className="fin">Fin</span>
          </div>
        </Link>

        <div className="seo-nav-right">
          <SearchTrigger className="nav-search" />
          <Link href="/#waitlist" className="seo-nav-cta">
            Get Early Access
          </Link>
        </div>
      </header>

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
          <Link href="/#tool" className="seo-cta-btn">
            Try the Calculator →
          </Link>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="seo-footer">
        <div className="seo-footer-inner">
          <div className="seo-footer-brand">
            <Link href="/" className="seo-footer-logo">
              <span className="clear">Clear</span>
              <span className="fin">Fin</span>
            </Link>
            <p className="seo-footer-tagline">
              Smarter credit card recommendations, powered by your real spending.
            </p>
          </div>

          <div className="seo-footer-links">
            <Link href="/">Home</Link>
            <Link href="/#tool">Calculator</Link>
            <Link href="/#waitlist">Waitlist</Link>
          </div>

          <p className="seo-footer-copy">
            &copy; {new Date().getFullYear()} ClearFin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

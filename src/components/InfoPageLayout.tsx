import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

type InfoPageLayoutProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  meta: string;
  children: ReactNode;
  showContactCta?: boolean;
};

export default function InfoPageLayout({
  eyebrow,
  title,
  accent,
  description,
  meta,
  children,
  showContactCta = true,
}: InfoPageLayoutProps) {
  return (
    <div className="info-page">
      <Nav />

      <main className="info-main">
        <nav className="info-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{eyebrow}</span>
        </nav>

        <header className="info-hero">
          <div className="info-hero-copy">
            <span className="info-eyebrow">ClearFin · {eyebrow}</span>
            <h1>
              {title} <em>{accent}</em>
            </h1>
            <p>{description}</p>
          </div>
          <div className="info-hero-meta">
            <span className="info-meta-dot" aria-hidden="true" />
            {meta}
          </div>
        </header>

        <div className="info-content">{children}</div>

        {showContactCta ? (
          <aside className="info-help">
            <div>
              <span className="info-eyebrow">Still have a question?</span>
              <h2>We believe clarity should feel personal.</h2>
            </div>
            <Link href="/contact" className="info-primary-button">
              Contact ClearFin <span aria-hidden="true">→</span>
            </Link>
          </aside>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

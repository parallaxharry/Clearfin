import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "About | ClearFin",
  description:
    "ClearFin was built by Canadians who got tired of missing payments and leaving rewards unclaimed. Meet the team making credit cards simple.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | ClearFin",
    description:
      "ClearFin was built by Canadians who got tired of missing payments and leaving rewards unclaimed. Meet the team making credit cards simple.",
    type: "website",
    locale: "en_CA",
    url: "https://clearfin.ca/about",
    siteName: "ClearFin",
  },
};

const team = [
  {
    name: "Simran Jhangria",
    title: "Founder & CEO",
    initials: "SJ",
  },
  {
    name: "Jainam Shah",
    title: "Founder & Chief Marketing Officer (CMO)",
    initials: "JS",
  },
  {
    name: "Kashyap Badiani",
    title: "Founder & CFO",
    initials: "KB",
  },
];

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://clearfin.ca/about",
  mainEntity: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClearFin",
    alternateName: "ClearFin Digital Inc.",
    url: "https://clearfin.ca",
    foundingLocation: {
      "@type": "Place",
      name: "Calgary, Alberta, Canada",
    },
    description:
      "ClearFin is a Canadian credit card optimisation platform that helps people choose the right card for every purchase and manage their finances in one unified app.",
    founder: team.map((m) => ({
      "@type": "Person",
      name: m.name,
      jobTitle: m.title,
    })),
  },
};

export default function AboutPage() {
  return (
    <main className="privacy-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <div className="grain" />
      <div className="privacy-shell">
        <Logo className="privacy-logo" />

        <header className="privacy-hero">
          <div className="privacy-kicker">ClearFin Digital Inc. · Calgary, AB</div>
          <h1>
            Built for <span className="ital">real</span> life.
          </h1>
          <p>
            We are Canadians who ran into the same problems everyone else does — and
            decided to actually fix them.
          </p>
          <div className="privacy-updated">Founded 2026 · Calgary first</div>
        </header>

        <div className="privacy-content">

          <section className="privacy-section">
            <h2>Why we built this</h2>
            <p>
              It started with the small frustrations that add up. A missed credit card
              payment. Realising you used the wrong card at the grocery store and left 4x
              points on the table. Owning four cards and having no idea which one to tap.
            </p>
            <p style={{ marginTop: "16px" }}>
              The average Canadian holds four credit cards and leaves $847 a year in
              rewards unclaimed — not because they don&apos;t care, but because the system
              is genuinely confusing. Banks don&apos;t make it easy. Reward programs are
              designed to be complicated.
            </p>
            <p style={{ marginTop: "16px" }}>
              We wanted one place that makes all of it simple: which card to use, when to
              use it, and how much you are actually earning. No spreadsheets. No guessing.
              One app.
            </p>
          </section>

          <section className="privacy-section">
            <h2>What we are building</h2>
            <p>
              ClearFin is a unified financial system for your credit cards. The calculator
              shows you which of 107 Canadian cards earns the most for your actual spending
              habits. The app tracks your cards, reminds you before payments are due, flags
              active subscriptions, and tells you — in real time — whether you used the
              right card for every purchase.
            </p>
            <p style={{ marginTop: "16px" }}>
              Everything visible. Everything simple. One place.
            </p>
          </section>

          <section className="privacy-section">
            <h2>The team</h2>
            <div className="about-team">
              {team.map((member) => (
                <div className="about-card" key={member.name}>
                  <div className="about-initials">{member.initials}</div>
                  <div className="about-card-name">{member.name}</div>
                  <div className="about-card-title">{member.title}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="privacy-section">
            <h2>Independence</h2>
            <p>
              ClearFin is not affiliated with any bank, credit card issuer, or payment
              network. Every comparison is based on publicly available rates and terms.
              We earn nothing from card applications. Our only job is to give you the
              most accurate picture of your options.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Contact</h2>
            <p>
              Questions, corrections, or feedback — reach us at{" "}
              <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}

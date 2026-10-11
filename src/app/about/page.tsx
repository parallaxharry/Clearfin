import type { Metadata } from "next";
import Link from "next/link";
import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "About | ClearFin",
  description:
    "ClearFin is a Canadian credit card comparison platform built in Calgary. Meet the team and learn how our independent card comparisons work.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | ClearFin",
    description:
      "ClearFin is a Canadian credit card comparison platform built in Calgary. Meet the team and learn how our independent card comparisons work.",
    type: "website",
    locale: "en_CA",
    url: "https://www.clearfin.ca/about",
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
  url: "https://www.clearfin.ca/about",
  mainEntity: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClearFin",
    alternateName: "ClearFin Digital Inc.",
    url: "https://www.clearfin.ca",
    foundingLocation: {
      "@type": "Place",
      name: "Calgary, Alberta, Canada",
    },
    description:
      "ClearFin is a Canadian credit card comparison platform that helps people compare cards using their spending, fees, reward rates, and eligibility profile.",
    founder: team.map((m) => ({
      "@type": "Person",
      name: m.name,
      jobTitle: m.title,
    })),
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <InfoPageLayout
        eyebrow="About"
        title="Built for"
        accent="real life."
        description="We are Canadians who ran into the same credit-card decisions everyone else does — and wanted a clearer way to compare them."
        meta="Founded 2026 · Calgary, Alberta"
      >
        <section className="info-section">
          <h2>Why we built this</h2>
          <p>
            Credit card rewards are useful only when people can understand them. Earn
            rates change by merchant category, annual fees can erase part of the return,
            and the strongest card for one household can be a poor fit for another.
          </p>
          <p>
            We built ClearFin to make those trade-offs easier to see. Instead of starting
            with a headline welcome offer or one advertised multiplier, ClearFin starts
            with how you actually spend and estimates the annual value after card fees.
          </p>
          <p>
            The goal is simple: make the assumptions visible, keep the underlying card
            information traceable, and give Canadians a clearer starting point before
            they apply.
          </p>
        </section>

        <section className="info-section">
          <h2>What is available today</h2>
          <p>
            ClearFin Web is available now. The calculator and side-by-side comparison
            tools are free to use and cover 120+ active Canadian credit cards across 19
            issuers. No signup or card number is required to run a comparison.
          </p>
          <p>
            We are also developing the ClearFin mobile app, with features planned around
            card organization, reward guidance, bill reminders, and easier day-to-day
            card decisions. The mobile product is separate from the tools already live on
            this website.
          </p>
        </section>

        <section className="info-section">
          <h2>How we handle card information</h2>
          <p>
            We use issuer information, product pages, benefit guides, insurance
            certificates, and other primary sources where available. Card terms can
            change, so detail pages show source and review information when we have it,
            and we encourage users to confirm current issuer terms before applying.
          </p>
          <p>
            If you spot something that looks outdated or incorrect, email us at{" "}
            <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>. Corrections are part of
            maintaining the catalogue, not an afterthought.
          </p>
        </section>

        <section className="info-section">
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

        <section className="info-section">
          <h2>Independence and how we make money</h2>
          <p>
            ClearFin is not a bank, credit card issuer, or payment network. Comparisons
            use publicly available card terms and ClearFin&apos;s calculation methodology.
          </p>
          <p>
            Some &ldquo;Apply&rdquo; links are affiliate links. ClearFin may earn a
            commission if you are approved for a card through one, at no extra cost to
            you. Affiliate compensation does not change a card&apos;s calculated value or
            its position in our recommendation logic, and we do not accept payment for
            placement. Read the full <Link href="/disclosures">site disclosures</Link>.
          </p>
        </section>

        <section className="info-section">
          <h2>Contact</h2>
          <p>
            Questions, corrections, or feedback — reach us at{" "}
            <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
          </p>
        </section>
      </InfoPageLayout>
    </>
  );
}

import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Disclosures | ClearFin",
  description:
    "ClearFin is independent — not affiliated with any bank or card issuer. These disclosures cover our independence, card data sourcing, and correction request process.",
  alternates: {
    canonical: "/disclosures",
  },
  openGraph: {
    title: "Disclosures | ClearFin",
    description:
      "ClearFin is independent — not affiliated with any bank or card issuer. These disclosures cover our independence, card data sourcing, and correction request process.",
    type: "website",
    locale: "en_CA",
    url: "https://www.clearfin.ca/disclosures",
    siteName: "ClearFin",
  },
};

const disclosureSections = [
  {
    title: "Independent Comparison",
    body:
      "ClearFin is independent. We are not sponsored, endorsed, authorized, or affiliated with any bank, credit card issuer, payment network, or credit card provider shown on this website.",
  },
  {
    title: "Card Information",
    body:
      "Card names, images, trademarks, rates, fees, rewards, welcome offers, and eligibility details belong to their respective owners and may change without notice. ClearFin presents card information for educational comparison only.",
  },
  {
    title: "Verify Before Applying",
    body:
      "Before applying for any card, review the official issuer terms, fees, reward rules, eligibility requirements, and offer details directly with the provider.",
  },
  {
    title: "Corrections And Takedown Requests",
    body:
      "If you believe information should be corrected, updated, modified, or removed, contact us at info@clearfin.ca and include the card name, page location, and requested change.",
  },
];

export default function DisclosuresPage() {
  return (
    <main className="privacy-page">
      <div className="grain" />
      <div className="privacy-shell">
        <Logo className="privacy-logo" />

        <header className="privacy-hero">
          <div className="privacy-kicker">ClearFin Digital Inc.</div>
          <h1>
            Site <span className="ital">Disclosures</span>
          </h1>
          <p>
            These disclosures explain ClearFin&apos;s independence, how card information is
            presented, and how banks, issuers, providers, or users can request updates.
          </p>
          <div className="privacy-updated">Last updated: May 2026</div>
        </header>

        <section className="privacy-notice">
          <strong>No bank affiliation.</strong> ClearFin is not affiliated with any bank
          or credit card provider. For corrections, removals, or modifications, contact{" "}
          <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
        </section>

        <div className="privacy-content">
          {disclosureSections.map((section) => (
            <section className="privacy-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

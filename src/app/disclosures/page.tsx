import type { Metadata } from "next";
import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "Disclosures | ClearFin",
  description:
    "How ClearFin earns affiliate commissions, distinguishes featured cards from calculated rankings, and maintains card information.",
  alternates: {
    canonical: "/disclosures",
  },
  openGraph: {
    title: "Disclosures | ClearFin",
    description:
      "How ClearFin earns affiliate commissions, distinguishes featured cards from calculated rankings, and maintains card information.",
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
      "ClearFin is an independent comparison platform, not a bank, credit card issuer or payment network. Listing a card does not imply that its issuer endorses ClearFin. Some application links are affiliate links.",
  },
  {
    title: "How ClearFin Makes Money",
    body:
      "Some Apply links are affiliate links. ClearFin may earn a commission if you are approved through one, at no extra cost to you. Application links can lead through an affiliate partner before reaching the issuer. Official research sources are separate from these application links.",
  },
  {
    title: "Calculated Recommendations",
    body:
      "Affiliate compensation does not change a card's calculated reward value or its position in calculator results. Estimates use your spending assumptions, annual fees and the reward rules supported by the calculator. The calculator states its limitations; results are estimates, not approval guarantees.",
  },
  {
    title: "Featured Cards",
    body:
      "The homepage Featured carousel is a commercial selection. Affiliate compensation can influence which cards appear there and their order. It is not a personalized ranking or a list of the best cards for everyone. Use the calculator and comparison tool to evaluate cards for your spending.",
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
    <InfoPageLayout
      eyebrow="Disclosures"
      title="Site"
      accent="disclosures"
      description="These disclosures explain ClearFin's independence, how card information is presented, and how banks, issuers, providers, or users can request updates."
      meta="Last updated October 12, 2026"
    >
      <section className="info-section info-section-lead">
        <h2>Independent comparisons, disclosed commissions</h2>
        <p>
          ClearFin is free to use and may earn affiliate commissions. This page
          explains where commercial relationships affect featured placement and
          how calculated recommendations work. For corrections, contact{" "}
          <a href="mailto:info@clearfin.ca">info@clearfin.ca</a>.
        </p>
      </section>

      {disclosureSections.map((section) => (
        <section className="info-section" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </InfoPageLayout>
  );
}

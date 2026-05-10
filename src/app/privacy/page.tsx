import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Statement | ClearFin",
  description:
    "How ClearFin collects, uses, protects, and manages personal information.",
};

const privacySections = [
  {
    title: "Information We Collect",
    body: [
      "Contact details you choose to share, such as your name and email address when you join the waitlist, request early access, or book a card strategy call.",
      "Card comparison inputs you provide, such as spending categories, estimated monthly spend, preferred issuers, and reward preferences.",
      "Website usage information, including basic analytics, card click activity, browser type, device information, and pages visited, so we can improve the product and understand which comparisons are useful.",
      "Statement upload previews if you choose to use that feature. We only use this information to help explain card and rewards options, and we will update this statement before introducing broader file storage or automated financial account connections.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "To operate the website, waitlist, calculator, statement preview, and card comparison features.",
      "To personalize educational card recommendations based on your stated shopping habits and spending categories.",
      "To respond to your requests, send product updates, and manage early access communications.",
      "To measure website performance, prevent misuse, debug errors, and improve ClearFin.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We do not sell your personal information.",
      "We may share limited information with trusted service providers that help us host the website, manage the waitlist, process analytics, send emails, or keep the service secure.",
      "We may disclose information if required by law, to protect our rights, or to investigate security or fraud concerns.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You can ask to access, correct, or delete personal information we hold about you, subject to legal and operational requirements.",
      "You can unsubscribe from non-essential emails using the link in those messages or by contacting us directly.",
      "You can choose not to provide optional calculator inputs, but some comparison features may be less useful without them.",
    ],
  },
  {
    title: "Security And Retention",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information.",
      "No website, email, or internet transmission is completely secure, so please avoid uploading sensitive information unless it is needed for the feature you are using.",
      "We keep personal information only as long as reasonably necessary for the purposes described in this statement, unless a longer period is required or permitted by law.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <div className="grain" />
      <div className="privacy-shell">
        <Link href="/" className="privacy-back">
          &lt;- Back to ClearFin
        </Link>

        <header className="privacy-hero">
          <div className="privacy-kicker">ClearFin Digital Inc.</div>
          <h1>
            Privacy <span className="ital">Statement</span>
          </h1>
          <p>
            This statement explains how ClearFin collects, uses, protects, and manages
            personal information when you use our website, waitlist, calculator, and
            early access features.
          </p>
          <div className="privacy-updated">Last updated: May 2026</div>
        </header>

        <section className="privacy-notice">
          <strong>Educational information only.</strong> ClearFin provides educational
          credit card comparison information. It is not financial, legal, tax, or
          investment advice. You should review card terms directly with the issuer and
          make decisions based on your own circumstances.
        </section>

        <div className="privacy-content">
          {privacySections.map((section) => (
            <section className="privacy-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className="privacy-section">
            <h2>Canadian Privacy Rights</h2>
            <p>
              ClearFin is built for Canada. We aim to handle personal information in
              line with Canadian private-sector privacy principles, including limiting
              collection, identifying purposes, safeguarding information, and giving
              people a way to ask questions about their personal information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Contact</h2>
            <p>
              For privacy questions or requests, contact{" "}
              <a href="mailto:privacy@clearfin.ca">privacy@clearfin.ca</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

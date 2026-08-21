import type { Metadata } from "next";
import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "Privacy Statement | ClearFin",
  description:
    "How ClearFin collects, uses, protects, and manages personal information. ClearFin is built for Canada and handles data in line with Canadian privacy principles.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Statement | ClearFin",
    description:
      "How ClearFin collects, uses, protects, and manages personal information. ClearFin is built for Canada and handles data in line with Canadian privacy principles.",
    type: "website",
    locale: "en_CA",
    url: "https://www.clearfin.ca/privacy",
    siteName: "ClearFin",
  },
};

const privacySections = [
  {
    title: "Information We Collect",
    body: [
      "Contact details you choose to share, such as your name and email address when you join the waitlist, request early access, or book a card strategy call.",
      "Card comparison inputs you provide, such as spending categories, estimated monthly spend, preferred issuers, and reward preferences.",
      "If you accept analytics cookies, Google Analytics may collect website usage information such as pages visited, approximate location, browser type, device information, and interactions with the site.",
      "Card application click activity, such as which card or issuer link was selected, so we can measure whether our comparisons are useful and administer affiliate relationships.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "To operate the website, waitlist, calculator, search, and card comparison features.",
      "To personalize educational card recommendations based on your stated shopping habits and spending categories.",
      "To respond to your requests, send product updates, and manage early access communications.",
      "To measure website performance, prevent misuse, debug errors, and improve ClearFin.",
    ],
  },
  {
    title: "Where Information Is Stored",
    body: [
      "Waitlist emails and card click activity may be stored in ClearFin's Supabase-hosted database.",
      "Google processes analytics information on our behalf when you accept analytics cookies. Google's handling of that information is governed by its own privacy terms.",
      "Access to ClearFin's stored records is limited to authorized systems and people who need it to operate the service.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We do not sell your personal information.",
      "We may share limited information with trusted service providers, including hosting, database, file storage, analytics, email, scheduling, and security providers that help us operate ClearFin.",
      "We may disclose information if required by law, to protect our rights, or to investigate security or fraud concerns.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You can ask to access, correct, or delete personal information we hold about you, subject to legal and operational requirements.",
      "You can unsubscribe from non-essential emails using the link in those messages or by contacting us directly.",
      "You can choose not to provide optional calculator inputs, but some comparison features may be less useful without them.",
      "You can accept or decline Google Analytics from the cookie notice. To change a saved choice later, clear ClearFin's site data in your browser and reload the website.",
    ],
  },
  {
    title: "Security And Retention",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information.",
      "ClearFin's current website does not ask you to upload credit card statements or provide full credit card numbers.",
      "No website, email, storage system, or internet transmission is completely secure, so please do not send sensitive financial information through website forms or email.",
      "We keep personal information only as long as reasonably necessary for the purposes described in this statement, unless a longer period is required or permitted by law.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      eyebrow="Privacy"
      title="Privacy"
      accent="statement"
      description="How ClearFin handles your information — what we collect, what we never collect, and the choices you control."
      meta="Last updated July 26, 2026"
    >
      <section className="info-section info-section-lead">
        <h2>Educational information only</h2>
        <p>
          ClearFin provides educational credit card comparison information. It is
          not financial, legal, tax, or investment advice. You should review card
          terms directly with the issuer and make decisions based on your own
          circumstances.
        </p>
      </section>

      {privacySections.map((section) => (
          <section className="info-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="info-section">
          <h2>ClearFin Ask (the card assistant)</h2>
          <p>
            When you use the card assistant, ClearFin stores the questions you
            send and the answers you receive, so we can understand what people
            need help with and improve the service. These records are deleted
            automatically after 7 days.
          </p>
          <p>
            Your browser is given a random identifier, kept in your browser&apos;s
            local storage, which counts how many questions you have asked. After
            the first 10 questions we ask for your email address before
            continuing. If you provide one, it is stored with your session and
            attached to the questions you have already asked, so we can follow up
            with you about them. We also store a one-way hashed version of your IP
            address to help prevent abuse; the address itself is never stored.
          </p>
          <p>
            Your questions are sent to OpenAI, which generates the answers on our
            behalf. Do not enter account numbers, passwords, or other sensitive
            personal information into the assistant. You can clear your browser&apos;s
            site data at any time to remove the identifier and stored email, or
            contact us to ask for your records to be deleted.
          </p>
        </section>

        <section className="info-section">
          <h2>Google Analytics</h2>
          <p>
            ClearFin uses Google Analytics only according to the choice saved
            in your browser. When analytics storage is declined, ClearFin
            tells Google that analytics storage is denied. When it is
            accepted, Google Analytics can use cookies and similar
            technologies to help us understand site traffic and page use.
            Learn more in{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s privacy policy
            </a>
            .
          </p>
        </section>

        <section className="info-section">
          <h2>Canadian Privacy Rights</h2>
          <p>
            ClearFin is built for Canada. We aim to handle personal information in
            line with Canadian private-sector privacy principles, including limiting
            collection, identifying purposes, safeguarding information, and giving
            people a way to ask questions about their personal information.
          </p>
        </section>

        <section className="info-section">
          <h2>Contact</h2>
          <p>
            For privacy questions or requests, contact{" "}
            <a href="mailto:privacy@clearfin.ca">privacy@clearfin.ca</a>.
          </p>
        </section>
          </InfoPageLayout>
  );
}

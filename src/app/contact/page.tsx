import type { Metadata } from "next";
import Link from "next/link";
import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "Contact | ClearFin",
  description:
    "Contact ClearFin for general questions, card-data corrections, privacy requests, or early-access support.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | ClearFin",
    description:
      "Contact ClearFin for questions, card-data corrections, privacy requests, or early-access support.",
    type: "website",
    locale: "en_CA",
    url: "https://www.clearfin.ca/contact",
    siteName: "ClearFin",
  },
};

const contactOptions = [
  {
    number: "01",
    label: "General questions",
    description: "Product feedback, partnerships, media, or anything that does not fit elsewhere.",
    email: "info@clearfin.ca",
  },
  {
    number: "02",
    label: "Card data corrections",
    description: "Send the card name, page link, what needs changing, and an official issuer source when available.",
    email: "info@clearfin.ca",
  },
  {
    number: "03",
    label: "Privacy requests",
    description: "Ask about personal information, or request access, correction, or deletion where applicable.",
    email: "privacy@clearfin.ca",
  },
];

export default function ContactPage() {
  return (
    <InfoPageLayout
      eyebrow="Contact"
      title="Let&apos;s make things"
      accent="clear."
      description="Choose the most relevant channel below. A little context in your first message helps us give you a more useful answer."
      meta="ClearFin Digital Inc. · Calgary, Alberta"
      showContactCta={false}
    >
      <div className="contact-grid">
        {contactOptions.map((option) => (
          <article className="contact-card" key={option.number}>
            <span className="contact-card-number">{option.number}</span>
            <h2>{option.label}</h2>
            <p>{option.description}</p>
            <a href={`mailto:${option.email}`}>
              {option.email} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>

      <section className="contact-early-access">
        <div>
          <span className="info-eyebrow">Interested in ClearFin?</span>
          <h2>Get early access, without the noise.</h2>
          <p>Join the waitlist and we will let you know when your spot is ready.</p>
        </div>
        <Link href="/early-access" className="info-primary-button">
          Join the waitlist <span aria-hidden="true">→</span>
        </Link>
      </section>
    </InfoPageLayout>
  );
}

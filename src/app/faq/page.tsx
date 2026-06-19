import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | ClearFin",
  description:
    "Answers to common questions about ClearFin — how the credit card calculator works, which cards are tracked, data privacy, launch timing, and more.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | ClearFin",
    description:
      "Answers to common questions about ClearFin — how the credit card calculator works, which cards are tracked, data privacy, launch timing, and more.",
    type: "website",
    locale: "en_CA",
    url: "https://clearfin.ca/faq",
    siteName: "ClearFin",
  },
};

const faqs = [
  {
    question: "How does ClearFin work?",
    answer:
      "ClearFin compares Canadian credit cards based on your actual monthly spending. Answer 7 quick questions about your dining, grocery, gas, travel, and other spend, plus your income and credit score. ClearFin applies each card's earn rate to your numbers, calculates annual rewards, subtracts the annual fee, ranks the cards by net annual value, and shows only the cards you qualify for.",
  },
  {
    question: "Is ClearFin free to use?",
    answer:
      "Yes. The ClearFin calculator and card comparison tools are completely free. ClearFin is currently in early access — join the waitlist to be notified when it launches.",
  },
  {
    question: "Which credit cards does ClearFin track?",
    answer:
      "ClearFin tracks 107 Canadian credit cards across 17 major issuers, including American Express, Scotiabank, TD Bank, RBC, BMO, CIBC, Tangerine, Rogers, Wealthsimple, PC Financial, and more.",
  },
  {
    question: "Is ClearFin affiliated with any bank or card issuer?",
    answer:
      "No. ClearFin is completely independent. We are not sponsored, endorsed, or affiliated with any bank, credit card issuer, or payment network. Card comparisons are based on publicly available rates and terms.",
  },
  {
    question: "How accurate are the cashback estimates?",
    answer:
      "Estimates are calculated using each card's published earn rates applied to your stated monthly spend, annualized and reduced by the annual fee. Actual rewards depend on your specific purchases, issuer terms, and any promotional rates. Always verify card details directly with the issuer before applying.",
  },
  {
    question: "When does ClearFin launch?",
    answer:
      "ClearFin is launching in 2026, with early access starting in Calgary. Join the waitlist to secure your spot. We will send one email when it is your turn — no spam.",
  },
  {
    question: "Is ClearFin available outside of Calgary?",
    answer:
      "Early access is Calgary-first, then rolling out nationally across Canada. The card comparison calculator is available to all Canadians right now on the website.",
  },
  {
    question: "How does the credit card calculator work?",
    answer:
      "Enter your monthly spend across five categories: dining, groceries, gas, travel, and other. ClearFin applies each card's earn rate to your spend, calculates annual rewards, subtracts the annual fee, and ranks all 107 cards by net annual value. The process takes about 30 seconds.",
  },
  {
    question: "Can I upload my credit card statement?",
    answer:
      "Yes. ClearFin offers an optional statement upload feature that analyzes your actual spending breakdown. Your statement is stored privately and securely and is not shared with third parties. See the Privacy Statement for full details.",
  },
  {
    question: "How do I request a correction to card information?",
    answer:
      "If you believe any card information is inaccurate or outdated, contact us at info@clearfin.ca with the card name, page location, and the requested change. We aim to keep all card data current.",
  },
  {
    question: "What is ClearSave?",
    answer:
      "ClearSave is an upcoming feature in the ClearFin mobile app. It analyses the card you used for a purchase and tells you whether it was the best card for that spending category — helping you maximise rewards on every transaction. It is part of the 2026 app launch and is not yet available.",
  },
  {
    question: "Does using ClearFin affect my credit score?",
    answer:
      "No. ClearFin is a comparison tool only. We do not access your credit report, perform any credit checks, or share your information with lenders. Your credit score is not affected in any way.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <main className="privacy-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="grain" />
      <div className="privacy-shell">
        <Link href="/" className="privacy-back">
          &lt;- Back to ClearFin
        </Link>

        <header className="privacy-hero">
          <div className="privacy-kicker">ClearFin Digital Inc.</div>
          <h1>
            Frequently Asked <span className="ital">Questions</span>
          </h1>
          <p>
            Everything you need to know about how ClearFin works, which cards we
            track, and what to expect at launch.
          </p>
          <div className="privacy-updated">Updated: May 2026</div>
        </header>

        <div className="privacy-content">
          {faqs.map((faq) => (
            <section className="privacy-section" key={faq.question}>
              <h2>{faq.question}</h2>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

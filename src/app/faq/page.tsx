import type { Metadata } from "next";
import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "FAQ | ClearFin",
  description:
    "Answers to common questions about ClearFin — how the credit card calculator works, which cards are tracked, data privacy, the mobile app, and more.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | ClearFin",
    description:
      "Answers to common questions about ClearFin — how the credit card calculator works, which cards are tracked, data privacy, the mobile app, and more.",
    type: "website",
    locale: "en_CA",
    url: "https://www.clearfin.ca/faq",
    siteName: "ClearFin",
  },
};

const faqs = [
  {
    question: "How does ClearFin work?",
    answer:
      "ClearFin compares Canadian credit cards based on your monthly spending. Answer 7 quick questions covering dining, groceries, gas, travel, other spending, personal income, and household income. ClearFin applies the card earn rates used by our calculator, estimates annual rewards, subtracts the annual fee, and uses issuer-published income requirements where available to rank eligible matches by estimated net annual value.",
  },
  {
    question: "Is ClearFin free to use?",
    answer:
      "Yes. ClearFin Web is available now, and the credit card calculator and side-by-side comparison tools are free to use. No signup or credit card number is required to run a comparison.",
  },
  {
    question: "Which credit cards does ClearFin track?",
    answer:
      "ClearFin currently tracks 120+ active Canadian credit cards across 19 issuers, including American Express, Scotiabank, TD Bank, RBC, BMO, CIBC, Tangerine, Rogers Bank, Wealthsimple, PC Financial, and others. The catalogue changes as products are added, updated, or discontinued.",
  },
  {
    question: "Is ClearFin affiliated with any bank or card issuer?",
    answer:
      "No. ClearFin is not a bank, credit card issuer, or payment network. Some Apply links are affiliate links, so ClearFin may earn a commission if you are approved through one, at no extra cost to you. Affiliate compensation does not change a card's calculated value or its position in our recommendation logic, and we do not accept payment for placement.",
  },
  {
    question: "How accurate are the reward estimates?",
    answer:
      "ClearFin estimates rewards using the card rates and assumptions in our catalogue, your stated spending, and the annual fee. The result is an estimate, not a guaranteed return. Merchant coding, spending caps, point values, redemption choices, promotional offers, and issuer changes can affect the actual amount you receive. Check current issuer terms before applying.",
  },
  {
    question: "Is the ClearFin mobile app available?",
    answer:
      "The website tools are live now. The ClearFin mobile app is still in development and is planned to roll out separately through early-access testing, starting in Calgary before a broader Canadian release.",
  },
  {
    question: "Is ClearFin available outside of Calgary?",
    answer:
      "Yes. The ClearFin website, calculator, catalogue, and comparison tools can be used across Canada today. Calgary-first messaging refers to the planned mobile-app early-access rollout, not the web tools.",
  },
  {
    question: "How does the credit card calculator work?",
    answer:
      "Enter your monthly spend across five categories — dining, groceries, gas, travel, and other — plus approximate personal and household income. ClearFin estimates annual rewards, subtracts the annual fee, applies issuer-published personal or household income requirements where available, and ranks the resulting cards by estimated net value. The process takes about 30 seconds.",
  },
  {
    question: "Can I upload my credit card statement?",
    answer:
      "Not on the current public website. ClearFin does not currently require or offer statement upload as part of the live calculator. If we add statement analysis in the future, the feature and its privacy handling will be explained before users provide any data.",
  },
  {
    question: "How do I request a correction to card information?",
    answer:
      "Email info@clearfin.ca with the card name, page URL, and the information you believe should be corrected. Card terms can change, so we review corrections against issuer or other primary sources before updating the catalogue.",
  },
  {
    question: "What is ClearSave?",
    answer:
      "ClearSave is a planned mobile-app feature intended to help users understand whether another card in their wallet could earn more for a purchase. It is not part of the live website today, and its final functionality may change before release.",
  },
  {
    question: "Does using ClearFin affect my credit score?",
    answer:
      "No. Using the ClearFin website does not access your credit report, perform a hard credit check, or submit a credit-card application. The current calculator does not use a credit-score estimate as a hard eligibility cutoff. Some card pages may show ClearFin credit-range estimates for context, but the issuer makes the actual approval decision using its own underwriting process.",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <InfoPageLayout
        eyebrow="FAQ"
        title="Frequently asked"
        accent="questions"
        description="Everything you need to know about the live ClearFin tools, our card data, and the mobile product we are building."
        meta="Updated October 2026"
      >
        {faqs.map((faq) => (
          <section className="info-section" key={faq.question}>
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </section>
        ))}
      </InfoPageLayout>
    </>
  );
}

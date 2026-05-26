# SEO / GEO / AEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add robots.txt, sitemap.xml, canonical tags, full Open Graph + Twitter Card metadata, Organization/WebSite/SoftwareApplication/HowTo JSON-LD schema, a /faq page with FAQPage schema, and an accessible comparison table — with zero changes to visual design, copy, component architecture, or Supabase integration.

**Architecture:** All changes are purely additive infrastructure: new static files in `/public`, metadata additions to existing Next.js page files, inline JSON-LD script tags in layout and page components, and one new page (`/faq`) styled to match the existing dark aesthetic using the same CSS classes as `/privacy`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4 (sr-only utility), Next.js Metadata API

---

## File Map

| File | Action | What changes |
|---|---|---|
| `public/robots.txt` | Create | Crawl directives + sitemap pointer |
| `public/sitemap.xml` | Create | URL inventory for /, /privacy, /disclosures, /faq |
| `src/app/layout.tsx` | Modify | metadataBase, canonical, og:image, og:url, siteName, twitter:*, Organization + WebSite JSON-LD |
| `src/app/privacy/page.tsx` | Modify | canonical, OG tags, expand description to 155 chars |
| `src/app/disclosures/page.tsx` | Modify | canonical, OG tags, expand description to 149 chars |
| `src/app/page.tsx` | Modify | Remove dead Terms link, add /faq to footer, SoftwareApplication + HowTo JSON-LD, sr-only comparison table |
| `src/app/faq/page.tsx` | Create | FAQ page with 12 Q&A pairs + FAQPage JSON-LD schema |

---

## Task 1: Create robots.txt and sitemap.xml

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Create public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://clearfin.ca/sitemap.xml
```

- [ ] **Step 2: Create public/sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://clearfin.ca/</loc>
    <lastmod>2026-05-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://clearfin.ca/faq</loc>
    <lastmod>2026-05-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://clearfin.ca/privacy</loc>
    <lastmod>2026-05-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://clearfin.ca/disclosures</loc>
    <lastmod>2026-05-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Verify both files serve correctly**

Run: `npm run dev`
Open: `http://localhost:3000/robots.txt` — should show the plain text content.
Open: `http://localhost:3000/sitemap.xml` — should show the XML content.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt public/sitemap.xml
git commit -m "feat: add robots.txt and sitemap.xml"
```

---

## Task 2: Update layout.tsx metadata (metadataBase, OG, Twitter Card, canonical)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the metadata export**

Replace the entire existing `export const metadata: Metadata = { ... }` block with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://clearfin.ca"),
  title: "ClearFin — Every swipe should hit maximum cashback.",
  description:
    "ClearFin finds your best credit card for every purchase. Maximize rewards on every transaction. Built for Canada.",
  keywords: [
    "credit card optimizer Canada",
    "best credit card rewards Canada",
    "cashback maximizer",
    "Canadian credit cards",
    "credit card comparison Canada",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ClearFin — Every swipe should hit maximum cashback.",
    description:
      "ClearFin finds your best credit card for every purchase. Built for Canada.",
    type: "website",
    locale: "en_CA",
    url: "https://clearfin.ca",
    siteName: "ClearFin",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ClearFin — Canadian credit card optimizer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ClearFin — Every swipe should hit maximum cashback.",
    description:
      "ClearFin finds your best credit card for every purchase. Built for Canada.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};
```

- [ ] **Step 2: Build and verify no TypeScript errors**

Run: `npm run build`
Expected: Build completes with no errors. Check the build output confirms `<meta property="og:image">`, `<meta name="twitter:card">`, and `<link rel="canonical">` are present in the homepage HTML.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add metadataBase, og:image, og:url, siteName, Twitter Card, canonical to layout"
```

---

## Task 3: Add Organization + WebSite JSON-LD to layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add schema constants above the RootLayout function**

Add these two constants directly above the `export default function RootLayout` line:

```ts
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClearFin",
  alternateName: "ClearFin Digital Inc.",
  url: "https://clearfin.ca",
  logo: "https://clearfin.ca/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@clearfin.ca",
    contactType: "customer support",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  sameAs: [] as string[],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ClearFin",
  url: "https://clearfin.ca",
};
```

- [ ] **Step 2: Inject the JSON-LD scripts inside the body**

In the `RootLayout` return, add the two script tags as the first children of `<body>`:

```tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${fraunces.variable} ${jetbrains.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build completes. View source of `http://localhost:3000` — two `<script type="application/ld+json">` blocks should appear at the top of `<body>`, one containing `"@type":"Organization"` and one containing `"@type":"WebSite"`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Organization and WebSite JSON-LD schema to layout"
```

---

## Task 4: Update /privacy and /disclosures metadata

**Files:**
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/disclosures/page.tsx`

- [ ] **Step 1: Replace the metadata export in privacy/page.tsx**

Replace the existing `export const metadata: Metadata = { ... }` in `src/app/privacy/page.tsx` with:

```ts
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
    url: "https://clearfin.ca/privacy",
    siteName: "ClearFin",
  },
};
```

- [ ] **Step 2: Replace the metadata export in disclosures/page.tsx**

Replace the existing `export const metadata: Metadata = { ... }` in `src/app/disclosures/page.tsx` with:

```ts
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
    url: "https://clearfin.ca/disclosures",
    siteName: "ClearFin",
  },
};
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build completes. Open `http://localhost:3000/privacy` and view source — confirm `<link rel="canonical" href="https://clearfin.ca/privacy">` and `<meta property="og:url" content="https://clearfin.ca/privacy">` are present.

- [ ] **Step 4: Commit**

```bash
git add src/app/privacy/page.tsx src/app/disclosures/page.tsx
git commit -m "feat: add canonical, OG tags, and expanded meta descriptions to /privacy and /disclosures"
```

---

## Task 5: Fix footer in page.tsx — remove dead Terms link, add /faq

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update the footer-links div**

Find this block in `src/app/page.tsx`:

```tsx
<div className="footer-links">
  <a href="/privacy">Privacy</a>
  <a href="#">Terms</a>
  <a href="/disclosures">Disclosures</a>
  <a href="mailto:info@clearfin.ca">Contact</a>
</div>
```

Replace with:

```tsx
<div className="footer-links">
  <a href="/privacy">Privacy</a>
  <a href="/faq">FAQ</a>
  <a href="/disclosures">Disclosures</a>
  <a href="mailto:info@clearfin.ca">Contact</a>
</div>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Open: `http://localhost:3000` — scroll to footer. Confirm "FAQ" link appears and clicking it navigates to `/faq` (will 404 until Task 8 is complete, which is expected). Confirm "Terms" link is gone.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "fix: remove dead Terms link from footer, add /faq link"
```

---

## Task 6: Add SoftwareApplication + HowTo JSON-LD to page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add schema constants at the top of page.tsx (after imports)**

Add these two constants directly after the import statements, before the `export default function HomePage()` line:

```ts
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClearFin Credit Card Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://clearfin.ca/#tool",
  description:
    "Compare 107 Canadian credit cards based on your actual monthly spending. Find which card earns you the most cashback and rewards across dining, groceries, gas, travel, and other spend.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
  },
  creator: {
    "@type": "Organization",
    name: "ClearFin",
    url: "https://clearfin.ca",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find your best Canadian credit card with ClearFin",
  description:
    "Answer 5 quick questions about your monthly spending. ClearFin calculates your exact reward leak and shows which of 107 Canadian credit cards earns you the most.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Open the ClearFin calculator",
      text: "Click 'Open the Calculator' or 'Start in 30 seconds' on the ClearFin homepage.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter your monthly dining spend",
      text: "Enter how much you spend each month on restaurants, cafes, takeout, and food delivery.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Enter your monthly grocery budget",
      text: "Enter your monthly spend at supermarkets, Costco, and grocery stores.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Enter your monthly gas spend",
      text: "Enter your monthly fuel costs including petrol, diesel, and EV charging.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Enter your monthly travel spend",
      text: "Enter your average monthly travel budget including flights, hotels, and car rentals.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Enter your remaining monthly spend",
      text: "Enter everything else: shopping, utilities, subscriptions, and services.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "Review your personalized card recommendations",
      text: "ClearFin calculates your estimated annual earnings across all 107 Canadian cards and ranks them by net value for your specific spending profile.",
    },
  ],
};
```

- [ ] **Step 2: Inject the JSON-LD scripts into the page JSX**

In the `HomePage` return, add the two script tags directly after the opening `<>` fragment, before `<Loader />`:

```tsx
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {/* ── Global overlays ── */}
      <Loader />
      ...
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build completes. View source of `http://localhost:3000` — two new `<script type="application/ld+json">` blocks should appear, one with `"@type":"SoftwareApplication"` and one with `"@type":"HowTo"` containing 7 steps.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add SoftwareApplication and HowTo JSON-LD schema to homepage"
```

---

## Task 7: Add sr-only accessible comparison table to page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add the sr-only table after the visual bars div**

Find this block in `src/app/page.tsx` (the `<div className="bars">` inside section `feat-2`):

```tsx
<div className="feat-visual reveal">
  <div className="bars">
    {[
      { name: "Cobalt",    w: 0.92, amt: "$1,142" },
      { name: "Scotia G", w: 0.78, amt: "$967" },
      { name: "Aeroplan", w: 0.61, amt: "$754" },
      { name: "Avion",    w: 0.48, amt: "$595" },
      { name: "Tangerine",w: 0.34, amt: "$421" },
    ].map((b) => (
      <div className="bar-row" key={b.name}>
        <div className="bar-name">{b.name}</div>
        <div className="bar-track">
          <div className="bar-fill" style={{ "--w": b.w } as React.CSSProperties} />
        </div>
        <div className="bar-amt">{b.amt}</div>
      </div>
    ))}
  </div>
</div>
```

Replace with:

```tsx
<div className="feat-visual reveal">
  <div className="bars" aria-hidden="true">
    {[
      { name: "Cobalt",    w: 0.92, amt: "$1,142" },
      { name: "Scotia G", w: 0.78, amt: "$967" },
      { name: "Aeroplan", w: 0.61, amt: "$754" },
      { name: "Avion",    w: 0.48, amt: "$595" },
      { name: "Tangerine",w: 0.34, amt: "$421" },
    ].map((b) => (
      <div className="bar-row" key={b.name}>
        <div className="bar-name">{b.name}</div>
        <div className="bar-track">
          <div className="bar-fill" style={{ "--w": b.w } as React.CSSProperties} />
        </div>
        <div className="bar-amt">{b.amt}</div>
      </div>
    ))}
  </div>
  <table className="sr-only">
    <caption>Estimated annual cashback and rewards by Canadian credit card</caption>
    <thead>
      <tr>
        <th scope="col">Card</th>
        <th scope="col">Estimated Annual Value</th>
      </tr>
    </thead>
    <tbody>
      {[
        { name: "Amex Cobalt", amt: "$1,142" },
        { name: "Scotiabank Gold Amex", amt: "$967" },
        { name: "TD Aeroplan Visa Infinite", amt: "$754" },
        { name: "RBC Avion Visa Infinite", amt: "$595" },
        { name: "Tangerine Money-Back", amt: "$421" },
      ].map((row) => (
        <tr key={row.name}>
          <td>{row.name}</td>
          <td>{row.amt}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build completes. Open `http://localhost:3000` — visually nothing has changed. View source — the `<table class="sr-only">` should be present with 5 data rows. The `.bars` div now has `aria-hidden="true"`.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add sr-only accessible comparison table for table snippet eligibility"
```

---

## Task 8: Create /faq page with FAQPage JSON-LD

**Files:**
- Create: `src/app/faq/page.tsx`

- [ ] **Step 1: Create the file src/app/faq/page.tsx**

```tsx
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
      "ClearFin compares 107 Canadian credit cards based on your actual monthly spending. Answer 5 quick questions about your dining, grocery, gas, travel, and other spend. ClearFin applies each card's earn rate to your numbers, calculates annual rewards, subtracts the annual fee, and ranks the cards by net annual value.",
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
      "ClearSave is an upcoming feature in the ClearFin mobile app that will automatically apply extra rewards at eligible retailers. It is part of the 2026 app launch and is not yet available.",
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
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build completes with no errors. Open `http://localhost:3000/faq` — the page should render with the same dark style as `/privacy`, with 12 Q&A sections. The footer FAQ link should now work correctly.

- [ ] **Step 3: Verify schema in page source**

Open `http://localhost:3000/faq` and view source. Confirm a `<script type="application/ld+json">` block is present containing `"@type":"FAQPage"` with a `mainEntity` array of 12 Question objects.

- [ ] **Step 4: Commit**

```bash
git add src/app/faq/page.tsx
git commit -m "feat: add /faq page with 12 Q&A pairs and FAQPage JSON-LD schema"
```

---

## Verification Checklist (run after all tasks complete)

- [ ] `http://localhost:3000/robots.txt` returns 200 with correct content
- [ ] `http://localhost:3000/sitemap.xml` returns 200 with 4 URLs
- [ ] Homepage source contains `<link rel="canonical" href="https://clearfin.ca/">` 
- [ ] Homepage source contains `<meta property="og:image">`
- [ ] Homepage source contains `<meta name="twitter:card">`
- [ ] Homepage source contains Organization JSON-LD with `"addressLocality":"Calgary"`
- [ ] Homepage source contains SoftwareApplication JSON-LD with 7 HowTo steps
- [ ] `/privacy` source contains canonical + og:url
- [ ] `/disclosures` source contains canonical + og:url
- [ ] `/faq` renders with correct dark styling matching `/privacy`
- [ ] `/faq` source contains FAQPage JSON-LD with 12 questions
- [ ] Footer: Terms link gone, FAQ link present and working
- [ ] Bar chart section: `aria-hidden="true"` on `.bars` div, `sr-only` table present
- [ ] `npm run build` completes with zero errors

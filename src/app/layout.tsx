import type { Metadata } from "next";
import { Archivo, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

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

import type { Metadata } from "next";
import { Archivo, Fraunces, JetBrains_Mono } from "next/font/google";
import { SearchProvider } from "@/context/SearchContext";
import { getSearchCards } from "@/lib/cardDetail";
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
    "best credit cards Canada 2026",
    "best cashback credit cards Canada",
    "best travel credit cards Canada",
    "best grocery credit cards Canada",
    "best no fee credit cards Canada",
    "best student credit cards Canada",
    "credit card rewards guide Canada",
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
        width: 1254,
        height: 1254,
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchCards = await getSearchCards();
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
        <SearchProvider cards={searchCards}>{children}</SearchProvider>
      </body>
    </html>
  );
}

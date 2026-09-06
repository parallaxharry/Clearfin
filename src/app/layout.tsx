import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import MetaPixel from "@/components/MetaPixel";
import { SearchProvider } from "@/context/SearchContext";
import { SpendProvider } from "@/context/SpendContext";
import { getSearchCards } from "@/lib/cardDetail";
// Self-hosted copies of the same files next/font/google used to download at
// build time. Fetching them from Google was intermittently failing the build.
import "./fonts.css";
import "./globals.css";

/** Client-only and below the fold — keep it out of the initial bundle. */
const ChatWidget = dynamic(() => import("@/components/ChatWidget"));

const GOOGLE_ANALYTICS_ID = "G-7E7SRWHXL4";




export const metadata: Metadata = {
  metadataBase: new URL("https://www.clearfin.ca"),
  title: "Compare Credit Cards Canada: Find Your Best Card | ClearFin",
  description:
    "Compare Canadian credit cards, rewards, cash back, travel perks, and welcome bonuses with tools that help match cards to your spending habits.",
  keywords: [
    "compare credit cards in Canada",
    "Canadian credit card comparison",
    "compare Canadian credit card rewards",
    "best credit card based on my spending Canada",
    "credit card rewards calculator Canada",
    "cash back calculator Canada",
    "which credit card should I use Canada",
    "credit card rewards optimizer Canada",
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
    title: "Compare Credit Cards Canada: Find Your Best Card | ClearFin",
    description:
      "Compare Canadian credit cards, rewards, cash back, travel perks, and welcome bonuses with tools that help match cards to your spending habits.",
    type: "website",
    locale: "en_CA",
    url: "https://www.clearfin.ca",
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
    title: "Compare Credit Cards Canada: Find Your Best Card | ClearFin",
    description:
      "Compare Canadian credit cards, rewards, cash back, travel perks, and welcome bonuses with tools that help match cards to your spending habits.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClearFin",
  alternateName: "ClearFin Digital Inc.",
  url: "https://www.clearfin.ca",
  logo: "https://www.clearfin.ca/logo.png",
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
  url: "https://www.clearfin.ca",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchCards = await getSearchCards();
  return (
    <html
      lang="en"
      // globals.css sets scroll-behavior: smooth. Next 16 no longer suppresses
      // that during route changes unless this attribute is present, which made
      // every navigation smooth-scroll instead of landing at the top instantly.
      data-scroll-behavior="smooth"
    >
      <body>
        <Script id="clearfin-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            var clearfinConsent = null;
            try { clearfinConsent = window.localStorage.getItem("clearfin-analytics-consent"); } catch (e) {}
            gtag("consent", "default", {
              analytics_storage: clearfinConsent === "granted" ? "granted" : "denied",
              wait_for_update: 500
            });
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="clearfin-google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){dataLayer.push(arguments);}
            window.gtag("js", new Date());
            window.gtag("config", "${GOOGLE_ANALYTICS_ID}");
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SpendProvider>
          <SearchProvider cards={searchCards}>{children}</SearchProvider>
        </SpendProvider>
        <AnalyticsConsent />
        <MetaPixel />
        <ChatWidget />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import MetaPixel from "@/components/MetaPixel";
import { SearchProvider } from "@/context/SearchContext";
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
  title: "ClearFin | Find a Credit Card That Fits Your Spending",
  description:
    "Find Canadian credit cards that fit your real spending, fees and eligibility. Use ClearFin's calculator, comparison tool and independent card guides.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ClearFin | Find a Credit Card That Fits Your Spending",
    description:
      "Find Canadian credit cards that fit your real spending, fees and eligibility with ClearFin's calculator, comparison tool and independent guides.",
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
    title: "ClearFin | Find a Credit Card That Fits Your Spending",
    description:
      "Find Canadian credit cards that fit your real spending, fees and eligibility with ClearFin's calculator and comparison tools.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.clearfin.ca/#organization",
  name: "ClearFin",
  alternateName: "ClearFin Digital Inc.",
  url: "https://www.clearfin.ca",
  logo: {
    "@type": "ImageObject",
    url: "https://www.clearfin.ca/logo.png",
    width: 1254,
    height: 1254,
  },
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
  "@id": "https://www.clearfin.ca/#website",
  name: "ClearFin",
  url: "https://www.clearfin.ca",
  publisher: { "@id": "https://www.clearfin.ca/#organization" },
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
        <SearchProvider cards={searchCards}>{children}</SearchProvider>
        <AnalyticsConsent />
        <MetaPixel />
        <ChatWidget />
      </body>
    </html>
  );
}

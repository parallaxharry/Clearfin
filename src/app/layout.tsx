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
  title: "ClearFin — Every swipe should hit maximum cashback.",
  description:
    "ClearFin tells you which card to use, before you tap. Maximize rewards on every transaction. Built for Canada.",
  keywords: [
    "credit card optimizer Canada",
    "best credit card rewards Canada",
    "cashback maximizer",
    "Canadian credit cards",
    "credit card comparison Canada",
  ],
  openGraph: {
    title: "ClearFin — Every swipe should hit maximum cashback.",
    description:
      "ClearFin tells you which card to use, before you tap. Built for Canada.",
    type: "website",
    locale: "en_CA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${fraunces.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

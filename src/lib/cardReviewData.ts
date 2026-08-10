import type { Benefit, WelcomeBonus } from "@/lib/cardDetail";
import { CARDS } from "@/lib/cards";

export type CardResearchLevel = "issuer-catalogue" | "product-page" | "certificate";

export interface CardReviewEnrichment {
  /** Prefer this issuer-verified review over older catalogue copy. */
  authoritative?: boolean;
  annualFee?: number;
  rates?: Partial<Record<"dining" | "grocery" | "gas" | "travel" | "other", number>>;
  purchaseApr?: number;
  cashAdvanceApr?: number;
  balanceTransferApr?: number;
  additionalCardFee?: number;
  fxFee?: number;
  minIncomePersonal?: number;
  minIncomeHousehold?: number;
  welcomeBonus?: WelcomeBonus;
  rewards?: string[];
  benefits?: Benefit[];
  insurance?: Benefit[];
  redemptions?: string[];
  pros?: string[];
  cons?: string[];
  editorialSummary?: string;
  sourceUrl: string;
  insuranceSourceUrl?: string;
  reviewedAt: string;
  /** How directly the public source supports this record. */
  researchLevel?: CardResearchLevel;
  /** Plain-language scope note shown beside the source date. */
  researchNote?: string;
}

const REVIEW_DATE = "2026-08-09";

/**
 * Official issuer catalogues and disclosure hubs checked during the full-card
 * audit. Product-specific records below replace these broader sources whenever
 * a current product page or insurance certificate was available.
 */
const ISSUER_RESEARCH_SOURCES: Record<string, string> = {
  "American Express": "https://www.americanexpress.com/ca/en/credit-cards/",
  Scotiabank: "https://www.scotiabank.com/ca/en/personal/credit-cards/compare-cards.html",
  "TD Bank": "https://www.td.com/ca/en/personal-banking/products/credit-cards/compare-cards",
  RBC: "https://www.rbcroyalbank.com/credit-cards/index.html",
  BMO: "https://www.bmo.com/main/personal/credit-cards/",
  Wealthsimple: "https://www.wealthsimple.com/en-ca/credit-card",
  CIBC: "https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards.html",
  "National Bank": "https://www.nbc.ca/personal/mastercard-credit-cards.html",
  Desjardins: "https://www.desjardins.com/en/credit-cards.html",
  MBNA: "https://www.mbna.ca/en/credit-cards/compare-cards",
  "PC Financial": "https://www.pcfinancial.ca/en/credit-cards/",
  "Brim Financial": "https://brimfinancial.com/credit-cards",
  "Rogers Bank": "https://www.rogersbank.com/en/credit_cards/",
  "Canadian Tire": "https://www.ctfs.com/content/ctfs3/en/cards.html",
  Tangerine: "https://www.tangerine.ca/en/personal/spend/credit-cards",
  "Simplii Financial": "https://www.simplii.com/en/credit-cards/cash-back-visa.html",
  "ATB Financial": "https://www.atb.com/personal/everyday-banking/credit-cards/",
  "Neo Financial": "https://www.neofinancial.com/credit-cards",
  "Capital One": "https://www.capitalone.ca/credit-cards/",
};

/** Common financial terms only where the issuer's current comparison page
 * publishes the same figures for the named products. Product overrides below
 * remain the source of truth when their terms differ. */
const COMMON_FINANCIALS: Record<string, Partial<CardReviewEnrichment>> = {
  wealthsimple: { purchaseApr: 20.99, cashAdvanceApr: 22.99, fxFee: 0 },

  "scotia-gold": {
    purchaseApr: 21.99,
    cashAdvanceApr: 22.99,
    welcomeBonus: { headline: "Up to 50,000 Scene+ points — up to $500 toward eligible travel", eligibility: "The issuer currently advertises up to $950 in first-year value when the welcome points, annual fee and selected benefits are combined. Full offer terms apply." },
  },
  "scotia-passport": {
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    additionalCardFee: 50,
    minIncomePersonal: 60000,
    minIncomeHousehold: 100000,
    welcomeBonus: { headline: "Up to 60,000 Scene+ points", eligibility: "The issuer currently advertises up to $1,500 in first-year value when the offer and selected card benefits are combined. Full offer terms apply." },
  },
  "scotia-passport-privilege": {
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    minIncomePersonal: 150000,
    minIncomeHousehold: 200000,
    welcomeBonus: { headline: "Up to 80,000 Scene+ points in the first 14 months", eligibility: "New-account eligibility, spending, timing and account-standing conditions apply." },
  },
  "scotia-momentum-infinite": {
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    minIncomePersonal: 60000,
    minIncomeHousehold: 100000,
    welcomeBonus: {
      headline: "15% cash back for 3 months on up to $2,000 in eligible purchases, plus first-year fee rebate",
      eligibility: "A 0% promotional balance-transfer rate for 12 months with a 2% transfer fee is also advertised. Full category, cap, account and timing terms apply.",
    },
  },
  "scotia-momentum": { purchaseApr: 21.99, cashAdvanceApr: 22.99 },
  "scotia-momentum-student": { annualFee: 0, purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0, welcomeBonus: { headline: "5% cash back for 3 months on up to $2,000 in eligible purchases", eligibility: "A 0.99% promotional balance-transfer rate for 9 months with a 2% transfer fee is also advertised. Full offer terms apply." } },
  "scene-plus-visa": { purchaseApr: 21.99, cashAdvanceApr: 22.99, welcomeBonus: { headline: "Up to 5,000 Scene+ points in the first 3 months", eligibility: "New-account purchase and account-standing conditions apply." } },
  "scotiabank-amex": { purchaseApr: 21.99, cashAdvanceApr: 22.99 },
  "scotia-platinum": { purchaseApr: 9.99, cashAdvanceApr: 9.99, welcomeBonus: { headline: "Up to 100,000 Scene+ points in the first 14 months", eligibility: "The issuer currently describes up to $3,000 in first-14-month value when points and selected benefits are combined. Full offer terms apply." } },
  "scotia-momentum-no-fee": { purchaseApr: 20.99, cashAdvanceApr: 22.99, welcomeBonus: { headline: "7.99% introductory purchase rate for 6 months", eligibility: "The standard purchase rate applies after the introductory period. Full offer terms apply." } },
  "scotiabank-student": { purchaseApr: 21.99, cashAdvanceApr: 22.99, welcomeBonus: { headline: "Up to 5,000 Scene+ points in the first 3 months", estimated_value_cad: 50, eligibility: "The issuer describes the points as up to $50 toward eligible travel. Full offer terms apply." } },
  "scotiabank-value": { purchaseApr: 13.99, cashAdvanceApr: 13.99, welcomeBonus: { headline: "0% promotional balance-transfer rate for 9 months plus first-year fee waiver", eligibility: "A 1% balance-transfer fee and the issuer's full eligibility and timing terms apply." } },

  "td-aeroplan": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 75, minIncomePersonal: 60000, minIncomeHousehold: 100000, welcomeBonus: { headline: "Up to 40,000 Aeroplan points plus a first-year annual-fee rebate", eligibility: "New-account eligibility, purchase, spending and account-standing conditions apply." } },
  "td-aeroplan-platinum": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 35, welcomeBonus: { headline: "Up to 20,000 Aeroplan points plus a first-year annual-fee rebate", eligibility: "New-account eligibility, purchase and account-standing conditions apply." } },
  "td-aeroplan-privilege": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 199, minIncomePersonal: 150000, minIncomeHousehold: 200000, welcomeBonus: { headline: "Up to 85,000 Aeroplan points", eligibility: "New-account eligibility, purchase, spending and account-standing conditions apply." } },
  "td-cashback-infinite": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 50, minIncomePersonal: 60000, minIncomeHousehold: 100000, welcomeBonus: { headline: "10% cash back for 3 months on up to $3,500 in eligible purchases, plus first-year fee rebate", estimated_value_cad: 600, eligibility: "The issuer describes up to $600 in combined first-year value. Full category, cap and account terms apply." } },
  "td-cashback-visa": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 0 },
  "td-first-class": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 50, minIncomePersonal: 60000, minIncomeHousehold: 100000, welcomeBonus: { headline: "Up to 146,000 TD Rewards points plus a first-year annual-fee rebate", eligibility: "New-account eligibility, purchase, spending and account-standing conditions apply." } },
  "td-platinum-travel": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 35, welcomeBonus: { headline: "Up to 50,000 TD Rewards points plus a first-year annual-fee rebate", eligibility: "New-account eligibility, purchase, spending and account-standing conditions apply." } },
  "td-rewards-visa": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 0, welcomeBonus: { headline: "$100 in TD Rewards value for eligible Amazon.ca purchases", estimated_value_cad: 100, eligibility: "The issuer's current comparison page lists conditions for earning and using the offer." } },
  "td-business-travel": { purchaseApr: 19.99, cashAdvanceApr: 22.99, additionalCardFee: 49, welcomeBonus: { headline: "Up to 200,000 TD Rewards points plus first-year fee rebates", eligibility: "Offer effective March 2, 2026. Multiple spend milestones and account-standing requirements apply." } },
  "td-emerald": { purchaseApr: 12.9, cashAdvanceApr: 12.9, additionalCardFee: 0, welcomeBonus: { headline: "0% promotional purchase rate for 6 months plus first-year fee rebate", eligibility: "The standard rate applies after the promotional period. Full issuer conditions apply." } },

  "rbc-avion": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 50, minIncomePersonal: 60000, minIncomeHousehold: 100000 },
  "rbc-avion-platinum": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 50 },
  "rbc-avion-privilege": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 99, minIncomePersonal: 200000, minIncomeHousehold: 200000 },
  "rbc-ion-plus": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0 },
  "rbc-ion": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0 },
  "rbc-cashback": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0 },
  "rbc-cashback-world-elite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  "rbc-more-rewards": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0 },
  "rbc-more-rewards-infinite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0, minIncomePersonal: 60000, minIncomeHousehold: 100000, welcomeBonus: { headline: "Up to 20,000 bonus More Rewards points", estimated_value_cad: 30, eligibility: "Available to eligible new applications received by September 25, 2026. A linked More Rewards account, first purchase and account-standing requirements apply.", offer_end_date: "September 25, 2026" } },
  "rbc-westjet-world-elite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  "rbc-westjet": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "rbc-british-airways": { purchaseApr: 20.5, cashAdvanceApr: 22.99, additionalCardFee: 75, minIncomePersonal: 60000, minIncomeHousehold: 100000 },

  "bmo-eclipse": { purchaseApr: 21.99, cashAdvanceApr: 23.99, minIncomePersonal: 60000, minIncomeHousehold: 100000 },
  "bmo-eclipse-rise": { purchaseApr: 21.99, cashAdvanceApr: 23.99 },
  "bmo-ascend-world-elite": { purchaseApr: 21.99, cashAdvanceApr: 23.99, minIncomePersonal: 80000, minIncomeHousehold: 150000, welcomeBonus: { headline: "Up to 90,000 BMO Rewards points plus first-year fee waivers", eligibility: "The current offer includes the primary card and eligible authorized users. Spending, timing and account-standing conditions apply." } },
  "bmo-eclipse-privilege": { purchaseApr: 21.99, cashAdvanceApr: 23.99, minIncomePersonal: 150000, minIncomeHousehold: 200000 },
  "bmo-viporter": { purchaseApr: 21.99, cashAdvanceApr: 23.99 },
  "bmo-viporter-world-elite": { purchaseApr: 21.99, cashAdvanceApr: 23.99, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  "bmo-cashback-world-elite": { purchaseApr: 21.99, cashAdvanceApr: 23.99, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  "bmo-cashback": { purchaseApr: 21.99, cashAdvanceApr: 23.99 },
  "bmo-preferred-rate": { purchaseApr: 13.99 },
  "bmo-student": { purchaseApr: 21.99, cashAdvanceApr: 23.99 },

  "cibc-aventura-infinite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, minIncomePersonal: 60000, minIncomeHousehold: 100000 },
  "cibc-aventura-privilege": { purchaseApr: 20.99, cashAdvanceApr: 22.99, minIncomePersonal: 150000, minIncomeHousehold: 200000 },
  "cibc-aventura-gold": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-aventura-visa": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-adapta": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-adapta-student": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-aventura-student": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-aeroplan-student": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-classic-student": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-dividend-infinite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, minIncomePersonal: 60000, minIncomeHousehold: 100000 },
  "cibc-dividend-platinum": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-costco": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-dividend-visa": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-aeroplan-infinite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, minIncomePersonal: 60000, minIncomeHousehold: 100000 },
  "cibc-aeroplan-privilege": { purchaseApr: 20.99, cashAdvanceApr: 22.99, minIncomePersonal: 150000, minIncomeHousehold: 200000 },
  "cibc-aeroplan-no-fee": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-classic": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },
  "cibc-student": { purchaseApr: 20.99, cashAdvanceApr: 22.99 },

  "nbc-world-elite": { purchaseApr: 20.99, cashAdvanceApr: 22.49, balanceTransferApr: 22.49, fxFee: 2.5, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  "nbc-world": { purchaseApr: 20.99, cashAdvanceApr: 22.49, balanceTransferApr: 22.49, fxFee: 2.5 },
  "nbc-world-mastercard": { purchaseApr: 20.99, cashAdvanceApr: 22.49, balanceTransferApr: 22.49, fxFee: 2.5 },
  "nbc-allure": { purchaseApr: 20.99, cashAdvanceApr: 22.49, balanceTransferApr: 22.49, fxFee: 2.5 },
  "nbc-mycredit": { purchaseApr: 20.99, cashAdvanceApr: 22.49, balanceTransferApr: 22.49, fxFee: 2.5 },
  "nbc-echo": { purchaseApr: 20.99, cashAdvanceApr: 22.49, balanceTransferApr: 22.49, fxFee: 2.5 },
  "nbc-syncro": {
    fxFee: 2.5,
    additionalCardFee: 0,
    researchNote: "The Syncro rate is variable: National Bank prime + 4% for purchases (minimum 8.90%) and prime + 8% for cash advances and balance transfers (minimum 12.90%). It is not converted to a fixed APR.",
  },

  "desjardins-flexi": { purchaseApr: 10.9, cashAdvanceApr: 12.9, additionalCardFee: 0 },
  "desjardins-cashback-visa": { purchaseApr: 20.9, cashAdvanceApr: 21.9, additionalCardFee: 0 },
  "desjardins-cashback-mc": { purchaseApr: 20.9, cashAdvanceApr: 21.9, additionalCardFee: 0 },
  "desjardins-bonus-visa": { purchaseApr: 20.9, cashAdvanceApr: 21.9, additionalCardFee: 0 },
  "desjardins-odyssey-world": { purchaseApr: 20.9, cashAdvanceApr: 21.9, additionalCardFee: 40 },
  "desjardins-odyssey": { purchaseApr: 20.9, cashAdvanceApr: 21.9, additionalCardFee: 30 },
  "desjardins-cash-world": { purchaseApr: 20.9, cashAdvanceApr: 21.9, additionalCardFee: 30 },
  "desjardins-visa-infinite": { purchaseApr: 11.9, cashAdvanceApr: 12.9 },

  "mbna-rewards-world-elite": { purchaseApr: 21.99, cashAdvanceApr: 22.99, balanceTransferApr: 22.99, additionalCardFee: 50, welcomeBonus: { headline: "Up to 30,000 bonus MBNA Rewards points", eligibility: "New-account, purchase, spending and account-standing conditions apply." } },
  "mbna-rewards-platinum": { purchaseApr: 21.99, cashAdvanceApr: 22.99, balanceTransferApr: 22.99, additionalCardFee: 0, welcomeBonus: { headline: "Up to 10,000 bonus MBNA Rewards points", eligibility: "New-account, purchase, spending and account-standing conditions apply." } },
  "mbna-smart-cash": { purchaseApr: 21.99, cashAdvanceApr: 22.99, balanceTransferApr: 22.99, additionalCardFee: 0, welcomeBonus: { headline: "5% cash back on gas and groceries for the first 6 months", eligibility: "The accelerated offer applies subject to the issuer's monthly purchase cap and full offer terms." } },
  "mbna-smart-cash-world": { purchaseApr: 21.99, cashAdvanceApr: 22.99, balanceTransferApr: 22.99 },
  "mbna-true-line": { purchaseApr: 12.99, cashAdvanceApr: 24.99, balanceTransferApr: 17.99, additionalCardFee: 0, welcomeBonus: { headline: "0% promotional balance-transfer rate for 12 months", eligibility: "Eligible transfers must be completed within 90 days of account opening. A transfer fee and full issuer conditions apply." } },
  "mbna-true-line-gold": { purchaseApr: 10.99, cashAdvanceApr: 24.99, balanceTransferApr: 13.99 },

  "pc-mastercard": { purchaseApr: 21.99, cashAdvanceApr: 22.97, additionalCardFee: 0 },
  "pc-world": { purchaseApr: 21.99, cashAdvanceApr: 22.97, additionalCardFee: 0, minIncomePersonal: 50000, minIncomeHousehold: 80000 },
  "pc-world-elite": { purchaseApr: 21.99, cashAdvanceApr: 22.97, additionalCardFee: 0, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  "pc-insiders": { purchaseApr: 21.99, cashAdvanceApr: 22.97, additionalCardFee: 0, minIncomePersonal: 80000, minIncomeHousehold: 150000 },

  "brim-world-elite": { fxFee: 1.5 },
  brim: { fxFee: 1.5 },

  "rogers-world-elite": {
    additionalCardFee: 0,
    minIncomePersonal: 80000,
    minIncomeHousehold: 150000,
    sourceUrl: "https://www.rogersbank.com/en/rogers_red_worldelite_mastercard_details/",
    insuranceSourceUrl: "https://www.rogersbank.com/legaldocs/en/Rogers_Red_World_Elite_Mastercard_Benefits_Guide.pdf",
    researchLevel: "certificate",
    researchNote: "Rogers publishes an account-dependent APR range, so ClearFin shows the official range in the research note instead of reducing it to a misleading single rate: purchases 21.99%–25.99% from the August 2026 statement period; cash advances and balance transfers 22.99%–27.99%.",
  },
  "rogers-red": {
    additionalCardFee: 0,
    researchNote: "Rogers publishes account-dependent APR ranges. ClearFin does not replace those ranges with a single estimated APR; review the issuer disclosure supplied with an application.",
  },

  "triangle-world-elite": { purchaseApr: 21.99, cashAdvanceApr: 22.99, balanceTransferApr: 22.99, additionalCardFee: 0, fxFee: 2.5, minIncomePersonal: 80000, minIncomeHousehold: 150000 },
  triangle: { purchaseApr: 21.99, cashAdvanceApr: 22.99, balanceTransferApr: 22.99, additionalCardFee: 0, fxFee: 2.5 },

  "tangerine-money-back": { purchaseApr: 20.95, cashAdvanceApr: 22.95, additionalCardFee: 0, fxFee: 2.5, minIncomePersonal: 12000, welcomeBonus: { headline: "10% cash back for 2 months — up to $100", estimated_value_cad: 100, eligibility: "New-account and eligible-purchase terms apply; the bonus is in addition to regular cash back." } },
  "tangerine-world": { purchaseApr: 20.95, cashAdvanceApr: 22.95, additionalCardFee: 0, fxFee: 2.5, minIncomePersonal: 50000, minIncomeHousehold: 80000, welcomeBonus: { headline: "$100 after $1,500 in purchases in the first 3 months", estimated_value_cad: 100, eligibility: "New-account, eligible-purchase and account-standing conditions apply." } },
  "tangerine-rewards-world-elite": { purchaseApr: 20.95, cashAdvanceApr: 22.95, additionalCardFee: 30, minIncomePersonal: 80000, minIncomeHousehold: 150000, welcomeBonus: { headline: "Up to $600 in advertised value", estimated_value_cad: 600, eligibility: "The issuer combines introductory rewards and selected benefits in this value estimate. Review the current offer breakdown before applying." } },

  "simplii-cashback": { purchaseApr: 21.99, cashAdvanceApr: 22.99, additionalCardFee: 0, fxFee: 2.5, minIncomeHousehold: 15000, welcomeBonus: { headline: "20% cash back on selected everyday categories for the first 3 statements — up to $100 total cash back", estimated_value_cad: 100, eligibility: "Offer applies to eligible gas, groceries, drugstores and pre-authorized payments on up to $500 in total qualifying purchases. Full issuer terms apply." } },

  "atb-gold-cash": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 0, welcomeBonus: { headline: "5% cash back for 3 months on up to $2,000 in eligible purchases", estimated_value_cad: 100, eligibility: "Available on eligible new accounts; the offer ends when the three-month period or $100 bonus cap is reached." } },
  "atb-world-elite": { purchaseApr: 20.99, cashAdvanceApr: 22.99, additionalCardFee: 35, minIncomePersonal: 80000, minIncomeHousehold: 150000, welcomeBonus: { headline: "40,000 ATB My Rewards points — $200 stated value — plus first-year fee waiver", estimated_value_cad: 320, eligibility: "The points are awarded after the first eligible purchase; the stated combined value includes the $120 first-year fee waiver." } },
  "atb-mastercard": { purchaseApr: 19.99, cashAdvanceApr: 22.99, additionalCardFee: 0, welcomeBonus: { headline: "10,000 ATB My Rewards points — $50 stated value", estimated_value_cad: 50, eligibility: "The bonus is awarded after the first eligible card use, subject to account terms." } },

  "neo-world-elite": { additionalCardFee: 0, minIncomePersonal: 50000 },
  "neo-world-elite-mc": { annualFee: 149, additionalCardFee: 49, minIncomePersonal: 80000 },
  "neo-mastercard": { annualFee: 0, additionalCardFee: 0 },

  "capital-one-guaranteed": { purchaseApr: 29.9, cashAdvanceApr: 29.9, balanceTransferApr: 29.9, additionalCardFee: 0 },
  "capital-one-secured": { purchaseApr: 29.9, cashAdvanceApr: 29.9, balanceTransferApr: 29.9, additionalCardFee: 0 },
};

/**
 * Editorial facts verified against primary issuer pages. Additions are made in
 * issuer batches so every claim has a traceable source and review date.
 */
const CURATED_CARD_REVIEW_ENRICHMENT: Record<string, CardReviewEnrichment> = {
  cobalt: {
    authoritative: true,
    purchaseApr: 21.99,
    cashAdvanceApr: 21.99,
    additionalCardFee: 0,
    fxFee: 2.5,
    welcomeBonus: {
      headline: "Up to 15,000 Membership Rewards points — up to $150 in statement-credit value",
      stages: [
        {
          reward: "1,250 points each month",
          requirement: "Spend $750 in purchases during a monthly billing period in your first year, up to 12 times",
        },
      ],
      eligibility:
        "Available to eligible new American Express Cobalt Cardmembers. Your account must remain in good standing, and the issuer's full offer terms apply.",
      estimated_value_cad: 150,
    },
    rewards: [
      "5× points on eligible restaurants, cafés, bars, stand-alone groceries, and food delivery in Canada · up to $2,500 per month, then 1×.",
      "3× points on eligible Canadian streaming subscriptions.",
      "2× points on eligible gas, local transit, taxis, and rideshare in Canada.",
      "1× point on other eligible purchases, including general travel.",
      "2× points in total on eligible hotels and car rentals booked through Amex Travel, subject to exclusions.",
    ],
    benefits: [
      {
        title: "Instacart monthly credit",
        description:
          "After registration, earn a $5 statement credit in each month you make an eligible Instacart purchase of at least $10, through December 31, 2027—up to $60 per year. Terms apply.",
      },
      {
        title: "The Hotel Collection",
        description:
          "Book two or more consecutive nights at participating properties for up to US$100 in eligible hotel credit, plus a possible room upgrade, noon check-in, and late checkout, subject to availability.",
      },
      {
        title: "Amex Offers",
        description:
          "Register for targeted offers in the Amex app or Online Services to access eligible statement credits and bonus rewards.",
      },
      {
        title: "Amex Experiences",
        description:
          "Access eligible Front Of The Line presales, reserved tickets, and selected Cardmember events.",
      },
      {
        title: "No-fee supplementary cards",
        description:
          "Add up to nine supplementary cards with no annual fee. American Express age and account requirements apply.",
      },
    ],
    insurance: [
      {
        title: "Out-of-province/country emergency medical",
        description: "Up to $5 million · first 15 trip days · under age 65.",
      },
      {
        title: "Flight delay",
        description: "Up to $500 combined with baggage delay · after 4 hours.",
      },
      {
        title: "Baggage delay",
        description: "Up to $500 combined with flight delay · after 6 hours.",
      },
      {
        title: "Hotel burglary",
        description: "Up to $500 for eligible stolen personal property.",
      },
      {
        title: "Lost or stolen baggage",
        description: "Up to $500 per trip for eligible baggage and personal effects.",
      },
      {
        title: "Travel accident",
        description: "Up to $250,000 for an eligible common-carrier accident.",
      },
      {
        title: "Car-rental theft and damage",
        description: "Vehicles up to $85,000 MSRP · rentals of 48 days or fewer.",
      },
      {
        title: "Mobile device insurance",
        description: "Up to $1,000 · eligible devices · coverage for up to 2 years.",
      },
      {
        title: "Purchase Protection",
        description: "Up to $1,000 per occurrence · first 90 days after purchase.",
      },
      {
        title: "Buyer's Assurance Protection Plan",
        description: "Extends an eligible manufacturer's warranty by up to 1 year.",
      },
    ],
    redemptions: [
      "Apply points to an eligible card purchase as a statement credit at 1,000 points for $10 in value.",
      "Transfer points to participating airline and hotel loyalty programs. Several airline partners use a 1:1 ratio, while ratios and availability vary by partner.",
      "Use Fixed Points Travel for eligible flights, where a set number of points can cover a base ticket price up to the program maximum.",
      "Book eligible travel through American Express Travel or use points for eligible travel purchases charged to the card.",
      "Use points toward eligible Air Canada purchases through Pay with Points, with a minimum redemption of 10 points.",
      "Redeem for gift cards, merchandise, or eligible Amazon purchases; the value per point can vary by option.",
    ],
    pros: [
      "Exceptional earning on eligible food and grocery purchases",
      "Flexible Membership Rewards redemptions, including transfer partners and simple statement credits",
      "Ten included insurance coverages plus useful lifestyle benefits",
      "No annual fee for supplementary cards",
    ],
    cons: [
      "$15.99 monthly fee totals $191.88 per year",
      "The 5-points-per-$1 category is capped at $2,500 in net purchases per monthly billing period",
      "General travel purchases now earn the base 1 point per $1 unless an eligible Amex Travel bonus applies",
      "American Express acceptance can be less consistent than Visa or Mastercard at some merchants",
    ],
    editorialSummary:
      "A food-first rewards card for people who spend heavily at eligible restaurants and grocery stores and can use flexible Membership Rewards points. Its strongest case is everyday earning—not lounge access—and the monthly fee deserves a deliberate value check.",
    sourceUrl: "https://www.americanexpress.com/ca/en/benefits/cobalt-card/index.html",
    insuranceSourceUrl:
      "https://www.americanexpress.com/content/dam/amex/en-ca/insurance/pdfs/certificates-of-insurance/Cobalt-Card-COI-EN.pdf",
    reviewedAt: "2026-08-08",
  },
  "amex-gold": {
    authoritative: true,
    annualFee: 250,
    rates: { dining: 0.01, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.01 },
    purchaseApr: 21.99,
    cashAdvanceApr: 21.99,
    additionalCardFee: 50,
    welcomeBonus: { headline: "No current welcome bonus verified" },
    rewards: [
      "Earn 2 Membership Rewards points per $1 on eligible travel purchases.",
      "Earn 2 points per $1 at eligible stand-alone gas stations, grocery stores, and drugstores in Canada.",
      "Earn 1 point per $1 on other eligible purchases.",
      "Eligible hotel and car-rental bookings through American Express Travel Online can earn 1 additional point per $1.",
    ],
    benefits: [
      { title: "$100 annual travel credit", description: "Apply the credit to one eligible booking of $100 or more through American Express Travel Online each Cardmembership year." },
      { title: "$50 NEXUS credit", description: "Receive up to $50 in statement credits for an eligible NEXUS application or renewal fee once every four years." },
      { title: "Airport lounge access", description: "Includes Priority Pass enrolment and four annual Plaza Premium lounge visits, subject to current program terms." },
      { title: "One free supplementary Gold card", description: "The first supplementary Gold Rewards Card has no annual fee; additional Gold cards are $50 each annually." },
    ],
    insurance: [
      { title: "Emergency medical", description: "Out-of-province/country emergency medical coverage for eligible travellers under age 65; certificate limits and exclusions apply." },
      { title: "Trip cancellation and interruption", description: "Coverage for eligible prepaid travel arrangements when a covered reason applies." },
      { title: "Flight and baggage delay", description: "Included coverage for qualifying delays after the certificate's waiting period." },
      { title: "Lost or stolen baggage and hotel burglary", description: "Coverage applies to eligible losses when the required travel costs are charged to the card." },
      { title: "Car-rental theft and damage", description: "Coverage for eligible rental vehicles when payment and waiver requirements are met." },
      { title: "Travel accident", description: "Up to $500,000 for an eligible common-carrier accident." },
      { title: "Purchase Protection and Buyer's Assurance", description: "Eligible purchases receive short-term loss/damage protection and a possible warranty extension." },
    ],
    redemptions: [
      "Apply Membership Rewards points to eligible card purchases at 1,000 points for a $10 statement credit.",
      "Transfer eligible points to participating airline and hotel loyalty programs; ratios vary by partner.",
      "Use points for eligible travel through American Express Travel, Fixed Points Travel, gift cards, merchandise, or participating checkout options.",
    ],
    editorialSummary: "A travel-oriented Membership Rewards card with annual credits, lounge visits, flexible points, and broad insurance. The $250 fee is easiest to justify when the travel credit and airport benefits are used deliberately.",
    sourceUrl: "https://www.americanexpress.com/ca/en/benefits/gold-rewards-card/index.shtml",
    insuranceSourceUrl: "https://www.americanexpress.com/en-ca/insurance/coverage/",
    reviewedAt: REVIEW_DATE,
  },
  "amex-platinum": {
    authoritative: true,
    annualFee: 799,
    rates: { dining: 0.02, grocery: 0.01, gas: 0.01, travel: 0.02, other: 0.01 },
    welcomeBonus: { headline: "No current welcome bonus verified" },
    rewards: [
      "Earn 2 Membership Rewards points per $1 on eligible dining purchases in Canada.",
      "Earn 2 points per $1 on eligible travel purchases.",
      "Earn 1 point per $1 on other eligible purchases.",
    ],
    benefits: [
      { title: "$200 annual travel credit", description: "Use the annual credit toward an eligible booking through American Express Travel Online or Platinum Card Travel Service." },
      { title: "$200 annual dining credit", description: "Receive a statement credit after an eligible purchase of at least $200 at participating Canadian restaurants; registration and terms apply." },
      { title: "$100 NEXUS credit", description: "Receive up to $100 in statement credits for an eligible NEXUS application or renewal fee every four years." },
      { title: "Global Lounge Collection", description: "Access more than 1,550 participating airport lounges across 140 countries, subject to each lounge program's terms." },
      { title: "Fine Hotels + Resorts", description: "Eligible bookings can include breakfast for two, a guaranteed 4 p.m. checkout, and other property benefits." },
      { title: "Hotel elite status", description: "Enrollment can provide Marriott Bonvoy Gold Elite and Hilton Honors Gold status while eligibility is maintained." },
    ],
    insurance: [
      { title: "Emergency medical", description: "Out-of-province/country emergency medical coverage for eligible travellers under age 65." },
      { title: "Trip cancellation and interruption", description: "Coverage for eligible prepaid travel arrangements when a covered reason applies." },
      { title: "Flight and baggage delay", description: "Included coverage for eligible delays after the certificate's waiting period." },
      { title: "Lost or stolen baggage and hotel burglary", description: "Coverage applies to eligible travel losses when payment requirements are met." },
      { title: "Car-rental theft and damage", description: "Coverage for eligible rental vehicles, subject to vehicle, rental-length, and payment rules." },
      { title: "Travel accident", description: "Up to $500,000 for an eligible common-carrier accident." },
      { title: "Purchase Protection and Buyer's Assurance", description: "Eligible purchases receive short-term loss/damage protection and a possible warranty extension." },
    ],
    redemptions: [
      "Apply Membership Rewards points to eligible purchases at 1,000 points for a $10 statement credit.",
      "Transfer eligible points to participating airline and hotel loyalty programs; ratios vary.",
      "Use points for eligible travel, Fixed Points Travel, gift cards, merchandise, and participating checkout options.",
    ],
    editorialSummary: "A premium travel and lifestyle card built around airport access, annual credits, hotel privileges, flexible points, and extensive insurance. Its high annual fee requires disciplined use of the included benefits.",
    sourceUrl: "https://www.americanexpress.com/en-ca/benefits/the-platinum-card/",
    insuranceSourceUrl: "https://www.americanexpress.com/en-ca/benefits/insurance/the-platinum-card/",
    reviewedAt: REVIEW_DATE,
  },
  "amex-simply-cash-preferred": {
    authoritative: true,
    annualFee: 119.88,
    rates: { dining: 0.02, grocery: 0.04, gas: 0.04, travel: 0.02, other: 0.02 },
    purchaseApr: 21.99,
    cashAdvanceApr: 21.99,
    additionalCardFee: 0,
    welcomeBonus: { headline: "No current welcome bonus verified" },
    rewards: [
      "Earn 4% cash back at eligible stand-alone gas stations in Canada.",
      "Earn 4% cash back at eligible stand-alone grocery stores in Canada on up to $30,000 in combined annual gas and grocery purchases; the rate then becomes 2%.",
      "Earn 2% cash back on other eligible purchases without a separate base-category cap.",
      "Cash back is applied as an annual account credit on the September statement.",
    ],
    benefits: [
      { title: "No-fee supplementary cards", description: "Add up to nine supplementary cards with no annual fee, subject to age and account requirements." },
      { title: "Amex Offers and Experiences", description: "Eligible cardmembers can register for targeted offers and access selected presales and reserved tickets." },
    ],
    insurance: [
      { title: "Mobile device insurance", description: "Up to $1,000 for an eligible device, for up to two years from purchase." },
      { title: "Emergency medical", description: "Up to $5 million for eligible emergency medical expenses during the first 15 consecutive days of travel for insured persons under age 65." },
      { title: "Flight and baggage delay", description: "Up to $500 combined after the applicable four-hour flight or six-hour baggage delay." },
      { title: "Lost or stolen baggage and hotel burglary", description: "Up to $500 for eligible baggage loss and up to $500 for eligible hotel burglary loss." },
      { title: "Car-rental theft and damage", description: "Eligible vehicles up to $85,000 MSRP for rentals of 48 days or fewer." },
      { title: "Travel accident", description: "Up to $100,000 for an eligible common-carrier accident." },
      { title: "Purchase Protection and Buyer's Assurance", description: "Up to $1,000 per eligible purchase-protection occurrence and up to one additional warranty year." },
    ],
    redemptions: ["Cash back is posted as a credit to the card account annually, on the September statement."],
    editorialSummary: "A straightforward cash-back card with strong gas and grocery earning, a 2% base rate, and unusually broad insurance for its price. The monthly fee makes the most sense for meaningful annual spend.",
    sourceUrl: "https://www.americanexpress.com/en-ca/benefits/simplycashpreferred-card/",
    insuranceSourceUrl: "https://www.americanexpress.com/content/dam/amex/en-ca/insurance/pdfs/certificates-of-insurance/SimplyCash-Preferred-Card-COI-EN.pdf",
    reviewedAt: REVIEW_DATE,
  },
  "amex-simply-cash": {
    authoritative: true,
    annualFee: 0,
    rates: { dining: 0.0125, grocery: 0.02, gas: 0.02, travel: 0.0125, other: 0.0125 },
    additionalCardFee: 0,
    welcomeBonus: { headline: "No current welcome bonus verified" },
    rewards: [
      "Earn 2% cash back at eligible stand-alone gas stations in Canada.",
      "Earn 2% cash back at eligible stand-alone grocery stores in Canada on up to $15,000 in annual grocery purchases; the rate then becomes 1.25%.",
      "Earn 1.25% cash back on other eligible purchases.",
      "Cash back is applied as an annual account credit on the September statement.",
    ],
    benefits: [
      { title: "No annual fee", description: "There is no annual fee for the primary card or supplementary cards." },
      { title: "Amex Offers", description: "Eligible cardmembers can register for targeted merchant offers in Online Services or the Amex app." },
    ],
    insurance: [
      { title: "Travel accident", description: "Up to $100,000 for eligible accidental death or dismemberment when common-carrier tickets are fully charged to the card." },
      { title: "Purchase Protection", description: "Eligible purchases can be covered for theft or accidental physical damage for 90 days, up to $1,000 per occurrence." },
      { title: "Buyer's Assurance", description: "May extend an eligible manufacturer's warranty by up to one additional year." },
    ],
    redemptions: ["Cash back is posted as a credit to the card account annually, on the September statement."],
    editorialSummary: "A no-fee cash-back card with accelerated gas and grocery earning and a stronger-than-basic 1.25% return elsewhere. The grocery cap and annual payout timing are the main tradeoffs.",
    sourceUrl: "https://www.americanexpress.com/en-ca/benefits/simplycash-card/",
    reviewedAt: REVIEW_DATE,
  },
  "amex-marriott": {
    authoritative: true,
    annualFee: 120,
    rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.02 },
    purchaseApr: 21.99,
    cashAdvanceApr: 21.99,
    additionalCardFee: 0,
    welcomeBonus: { headline: "No current welcome bonus verified" },
    rewards: [
      "Earn 5 Marriott Bonvoy points per $1 on eligible purchases charged directly by participating Marriott Bonvoy properties and eligible Marriott retail channels.",
      "Earn 2 Marriott Bonvoy points per $1 on other eligible card purchases.",
    ],
    benefits: [
      { title: "Annual Free Night Award", description: "Starting after the first Cardmembership year, receive an award for an eligible room costing up to 35,000 points; up to 15,000 points may be added under program rules." },
      { title: "15 Elite Night Credits", description: "Receive 15 elite-night credits each calendar year toward Marriott Bonvoy status." },
      { title: "Silver Elite status", description: "Receive automatic Silver Elite status while eligible; Gold Elite can be earned after $30,000 in annual card purchases or through qualifying nights." },
    ],
    insurance: [
      { title: "Flight and baggage delay", description: "Up to $500 combined for eligible flight and baggage delays after the certificate's waiting periods." },
      { title: "Lost or stolen baggage", description: "Up to $500 per trip for eligible baggage and personal effects." },
      { title: "Hotel burglary", description: "Up to $500 for eligible personal-property loss from a covered hotel burglary." },
      { title: "Car-rental theft and damage", description: "Eligible vehicles up to $85,000 MSRP for rentals of 48 days or fewer." },
      { title: "Travel accident", description: "Up to $500,000 for an eligible common-carrier accident." },
      { title: "Purchase Protection and Buyer's Assurance", description: "Up to $1,000 per eligible purchase-protection occurrence and up to one additional warranty year." },
    ],
    redemptions: [
      "Redeem points for eligible Marriott Bonvoy hotel stays; required points vary by hotel and date.",
      "Use eligible Free Night Awards within their validity period and add up to 15,000 points when program rules permit.",
      "Transfer points to participating airline programs or redeem for eligible Marriott experiences and other options; ratios and values vary.",
    ],
    editorialSummary: "A Marriott-focused hotel card whose value rests on the annual Free Night Award, 15 elite-night credits, and 5-point earning at participating Marriott properties—not bonus earning on general travel or dining.",
    sourceUrl: "https://www.americanexpress.com/ca/en/membership-benefits/marriott.html",
    insuranceSourceUrl: "https://www.americanexpress.com/content/dam/amex/en-ca/insurance/pdfs/certificates-of-insurance/Marriott-Bonvoy-Card-COI-EN.pdf",
    reviewedAt: REVIEW_DATE,
  },
  "amex-business-edge": {
    authoritative: true,
    rates: { dining: 0.03, grocery: 0.01, gas: 0.03, travel: 0.01, other: 0.01 },
    welcomeBonus: { headline: "No current welcome bonus verified" },
    rewards: [
      "Earn 3 Membership Rewards points per $1 at eligible Canadian office-supply and electronics retailers, gas stations, local commuter transportation, restaurants, cafés, bars, and food-delivery merchants.",
      "The 3-point earn rate applies until 75,000 points are earned from the combined accelerated categories each Cardmembership year; eligible purchases then earn 1 point per $1.",
      "Earn 1 point per $1 on other eligible purchases.",
    ],
    benefits: [
      { title: "Employee cards and controls", description: "Add employee cards and use online account tools to separate and monitor eligible business spending." },
      { title: "Plan It", description: "Eligible purchases can be divided into fixed monthly installments for a disclosed fee, subject to availability and account terms." },
      { title: "Business service", description: "Access customer service specialists trained for American Express small-business accounts." },
    ],
    insurance: [
      { title: "Car-rental theft and damage", description: "Eligible rental vehicles up to $85,000 MSRP for rentals of 48 days or fewer." },
      { title: "Employee Card Misuse Protection", description: "Up to $100,000 per cardmember for eligible unauthorized employee charges when notification and cancellation requirements are met." },
      { title: "Purchase Protection", description: "Eligible purchases can be covered for theft or accidental physical damage for 90 days, up to $1,000 per occurrence." },
      { title: "Buyer's Assurance", description: "May extend an eligible manufacturer's warranty by up to one additional year." },
    ],
    redemptions: [
      "Apply Membership Rewards points to eligible purchases or use them for available travel, gift cards, merchandise, and participating checkout options.",
      "Transfer eligible points to participating loyalty programs; ratios and eligibility vary.",
    ],
    editorialSummary: "A small-business rewards card aimed at office supplies, electronics, fuel, local transportation, and food spending. The accelerated-category cap and narrower insurance package should be reviewed against the business's actual expenses.",
    sourceUrl: "https://www.americanexpress.com/ca/en/business/small-business/benefits/business-edge-card/index.html",
    reviewedAt: REVIEW_DATE,
  },
  "amex-aeroplan": {
    authoritative: true,
    annualFee: 599,
    rates: { dining: 0.02, grocery: 0.0125, gas: 0.0125, travel: 0.0125, other: 0.0125 },
    purchaseApr: 21.99,
    cashAdvanceApr: 21.99,
    additionalCardFee: 199,
    welcomeBonus: { headline: "No current welcome bonus verified", eligibility: "The previously published limited-time offer ended July 28, 2026. Check the issuer for a replacement offer." },
    rewards: [
      "Earn 3 Aeroplan points per $1 on eligible purchases made directly with Air Canada and Air Canada Vacations.",
      "Earn 2 points per $1 on eligible dining and food-delivery purchases in Canada.",
      "Earn 1.25 points per $1 on other eligible purchases.",
    ],
    benefits: [
      { title: "Maple Leaf Lounge access", description: "Access eligible Maple Leaf Lounges in North America and the Air Canada Café for the cardmember and one guest with a same-day eligible itinerary." },
      { title: "Free first checked bag", description: "The cardmember and up to eight companions on the same reservation can receive a free first checked bag on eligible Air Canada travel." },
      { title: "$100 NEXUS credit", description: "Receive up to $100 in statement credits for an eligible NEXUS application or renewal fee every four years." },
      { title: "Annual companion benefit", description: "An eligible companion pass can be earned after $25,000 in net purchases during the Cardmembership year, subject to Aeroplan terms." },
    ],
    insurance: [
      { title: "Emergency medical", description: "Out-of-province/country emergency medical coverage for eligible travellers under age 65." },
      { title: "Trip cancellation and interruption", description: "Coverage for eligible prepaid travel arrangements when a covered reason applies." },
      { title: "Flight and baggage delay", description: "Included coverage for eligible delays after the certificate's waiting period." },
      { title: "Lost or stolen baggage and hotel burglary", description: "Coverage applies to eligible travel losses when payment requirements are met." },
      { title: "Car-rental theft and damage", description: "Coverage for eligible rental vehicles, subject to vehicle, rental-length, and payment rules." },
      { title: "Travel accident", description: "Up to $500,000 for an eligible common-carrier accident." },
      { title: "Purchase Protection and Buyer's Assurance", description: "Eligible purchases receive short-term loss/damage protection and a possible warranty extension." },
    ],
    redemptions: [
      "Redeem Aeroplan points for eligible Air Canada and partner-airline flights; required points vary by itinerary and demand.",
      "Use eligible points for hotels, car rentals, merchandise, gift cards, and other Aeroplan options; values vary.",
      "Combine the card with Aeroplan status and Air Canada benefits where eligibility requirements are met.",
    ],
    editorialSummary: "A premium Air Canada card for frequent flyers who can use lounge access, checked-bag savings, Aeroplan benefits, and broad insurance. The expired July 2026 offer is intentionally not presented as current.",
    sourceUrl: "https://www.americanexpress.com/en-ca/membership-benefits/aeroplan-reserve-card/",
    insuranceSourceUrl: "https://www.americanexpress.com/content/dam/amex/en-ca/insurance/pdfs/certificates-of-insurance/Aeroplan-Reserve-Card-COI-EN.pdf",
    reviewedAt: REVIEW_DATE,
  },
  "rbc-ion-plus": {
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    additionalCardFee: 0,
    welcomeBonus: {
      headline: "Up to 28,000 Avion points — up to $200 in gift-card value",
      stages: [
        { reward: "7,000 Avion points", requirement: "Receive approval for an eligible new account" },
        { reward: "14,000 Avion points", requirement: "Spend $1,500 in the first 6 months" },
        { reward: "7,000 Avion points", requirement: "Keep the account open and in good standing through the first anniversary" },
      ],
      offer_end_date: "November 4, 2026",
      estimated_value_cad: 200,
    },
    rewards: [
      "Earn 3 Avion points per $1 on groceries, dining, food delivery, gas, EV charging, rides, streaming, digital gaming, and subscriptions.",
      "Earn 1 Avion point per $1 on other qualifying purchases.",
    ],
    benefits: [
      { title: "Mobile device insurance", description: "Coverage of up to $1,000, subject to the certificate's conditions and exclusions." },
      { title: "Purchase security", description: "Protection for eligible new purchases, subject to the insurance certificate." },
      { title: "Extended warranty", description: "Eligible manufacturer warranties may be extended under the card's coverage." },
      { title: "Petro-Canada benefits", description: "Link an eligible RBC card to save on fuel and earn additional partner rewards." },
      { title: "Monthly fee rebate", description: "Students and eligible clients age 24 or younger may receive the monthly fee rebate while requirements are met." },
    ],
    redemptions: ["Gift cards and merchandise through Avion Rewards", "Travel and eligible WestJet redemptions", "Statement credits and select financial products"],
    pros: ["Strong earning across common everyday categories", "Low $4 monthly fee", "Mobile device insurance is unusual at this price point"],
    cons: ["Avion Premium points have fewer high-value transfer options than Avion Elite points", "Travel insurance is less comprehensive than many premium travel cards"],
    editorialSummary: "A practical low-fee rewards card for households whose spending is concentrated in groceries, dining, fuel, rides, and subscriptions.",
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/rewards/rbc-ion-plus-visa.html",
    reviewedAt: "2026-08-06",
  },
  "rbc-ion": {
    authoritative: true,
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    additionalCardFee: 0,
    welcomeBonus: {
      headline: "Up to 14,000 Avion points — up to $100 in gift-card value",
      stages: [
        { reward: "7,000 Avion points", requirement: "Receive approval for an eligible new account" },
        { reward: "7,000 Avion points", requirement: "Spend $500 in the first 3 months" },
      ],
      eligibility:
        "Available for eligible new RBC ION Visa applications received by November 4, 2026. The account must remain open and in good standing when points are awarded. RBC's complete offer terms apply.",
      offer_end_date: "November 4, 2026",
      estimated_value_cad: 100,
    },
    rewards: [
      "Earn 1.5 Avion points per $1 on eligible groceries.",
      "Earn 1.5 Avion points per $1 on eligible gas, EV charging, local transit, taxis, and rideshare.",
      "Earn 1.5 Avion points per $1 on eligible streaming, digital gaming, subscriptions, downloads, and in-game purchases.",
      "Earn 1 Avion point per $1 on all other qualifying purchases, including eligible pre-authorized bill payments.",
    ],
    benefits: [
      {
        title: "Avion Rewards access",
        description: "Access offers from more than 2,000 brands and redeem points for eligible merchandise, gift cards, travel, account credits, bills, investments, and charitable donations.",
      },
      {
        title: "Petro-Canada partner benefit",
        description: "Link an eligible RBC card to save 3 cents per litre on fuel and earn 20% more Petro-Points at participating Petro-Canada locations. Partner terms apply.",
      },
      {
        title: "Rexall partner benefit",
        description: "Link an eligible RBC card to earn 50 Be Well points per $1 on qualifying purchases at participating Rexall locations. Partner terms apply.",
      },
      {
        title: "DoorDash benefit",
        description: "Add the card to an eligible DoorDash account for a complimentary three-month DashPass subscription. Enrollment and partner terms apply.",
      },
      {
        title: "No-fee additional cards",
        description: "RBC lists a $0 fee for additional cards, allowing a household to share the account without another annual card fee.",
      },
    ],
    insurance: [
      {
        title: "Purchase Security",
        description: "Loss or accidental physical damage on eligible purchases · first 90 days · up to $50,000 per card account per calendar year.",
      },
      {
        title: "Extended Warranty",
        description: "Doubles an eligible original manufacturer's warranty by up to 1 additional year · combined warranty limited to 5 years.",
      },
    ],
    redemptions: [
      "Start with as few as 1,400 Avion points for an eligible $10 gift card; gift-card values and minimums can vary.",
      "Redeem for eligible merchandise from participating brands through Avion Rewards.",
      "Use points for eligible flights, hotels, car rentals, and vacation packages. RBC ION cardholders currently redeem eligible travel at 172 points per $1, with a 2,500-point minimum.",
      "Apply eligible points toward the RBC ION Visa balance, bills, investments, or charitable donations through Avion Rewards.",
    ],
    pros: [
      "No annual fee for the primary card or additional cards",
      "1.5 points per $1 across several common everyday categories",
      "Flexible Avion redemption choices beyond travel",
      "Purchase Security and Extended Warranty coverage are included",
    ],
    cons: [
      "RBC ION travel redemptions use a lower-value rate than many Avion Premium products",
      "The accelerated earn rate depends on Visa merchant-category coding",
      "No emergency medical, trip cancellation, flight delay, baggage, or rental-car insurance",
      "Interest can outweigh rewards when a balance is carried",
    ],
    editorialSummary:
      "A no-fee everyday rewards card for people who want simple Avion points on groceries, transportation, and digital entertainment. Its appeal is low carrying cost and flexible redemptions, not premium travel value or broad insurance.",
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/rewards/rbc-ion-visa.html",
    insuranceSourceUrl:
      "https://www.rbcroyalbank.com/credit-cards/rewards/rbc-ion-visa/rbc-ion-visa-certificate-of-insurance.pdf",
    reviewedAt: "2026-08-09",
  },
  "rbc-avion": {
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    additionalCardFee: 50,
    minIncomePersonal: 60000,
    minIncomeHousehold: 100000,
    welcomeBonus: {
      headline: "Up to 70,000 Avion points — up to $1,500 in stated travel value",
      stages: [
        { reward: "35,000 Avion points", requirement: "Receive approval for an eligible new account" },
        { reward: "20,000 Avion points", requirement: "Spend $5,000 in the first 6 months" },
        { reward: "15,000 Avion points", requirement: "Keep the account open through the first anniversary" },
      ],
      offer_end_date: "July 15, 2026",
      estimated_value_cad: 1500,
    },
    rewards: ["Earn 1.25 Avion points per $1 on eligible travel purchases.", "Earn 1 Avion point per $1 on other eligible purchases."],
    benefits: [
      { title: "Flexible flight redemptions", description: "Book eligible flights across more than 500 airlines without blackout dates or seat restrictions." },
      { title: "Travel insurance", description: "Includes several coverages such as emergency medical, travel accident, and trip cancellation, subject to certificates." },
      { title: "Mobile device insurance", description: "Coverage is included subject to eligibility, limits, and exclusions." },
      { title: "Purchase security and extended warranty", description: "Protection for eligible purchases under the applicable insurance policy." },
      { title: "Airline transfer partners", description: "Eligible Avion points can transfer to participating airline loyalty programs." },
    ],
    redemptions: ["Flights on eligible airlines through the Avion air-travel schedule", "Hotels, car rentals, merchandise, and gift cards", "Transfers to participating airline programs", "Statement credits, bills, investments, and charitable donations"],
    pros: ["Flexible airline and travel redemptions", "Useful travel and purchase insurance", "Access to airline transfer partners"],
    cons: ["$120 annual fee plus $50 per additional card", "Base earning remains 1 point per $1 outside travel"],
    editorialSummary: "A flexible travel card for people who value broad airline choice and insurance more than high category multipliers.",
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/travel/rbc-avion-visa-infinite.html",
    reviewedAt: "2026-08-06",
  },
  "rbc-cashback": {
    purchaseApr: 20.99,
    cashAdvanceApr: 22.99,
    additionalCardFee: 0,
    rewards: ["Earn up to 2% cash back on eligible grocery-store purchases.", "Earn up to 1% cash back on other eligible everyday purchases under the program's tiered structure."],
    benefits: [
      { title: "Purchase security", description: "Protection for eligible new purchases, subject to the policy terms." },
      { title: "Extended warranty", description: "Eligible manufacturer warranties may be extended under the card's coverage." },
      { title: "Partner offers", description: "Access eligible RBC offers and partner benefits at participating brands." },
      { title: "No annual fee", description: "No annual fee for primary or additional cards." },
    ],
    redemptions: ["Cash back credited under the RBC Cash Back program", "Request a credit once the program's minimum redemption threshold is met"],
    pros: ["No annual fee", "Accelerated cash back on eligible groceries", "Purchase security and extended warranty"],
    cons: ["Cash-back rates are tiered and subject to program thresholds", "Lower return than many fee-based cards for high spenders"],
    editorialSummary: "A simple no-fee cash-back card best suited to people who want grocery rewards and basic purchase coverage without managing points.",
    sourceUrl: "https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-cashback-mastercard.html",
    reviewedAt: "2026-08-06",
  },
};

const ISSUER_AUDIT_ENRICHMENT = Object.fromEntries(
  CARDS.map((card) => [
    card.id,
    {
      authoritative: Boolean(COMMON_FINANCIALS[card.id]),
      sourceUrl: ISSUER_RESEARCH_SOURCES[card.issuer] ?? card.bankUrl,
      reviewedAt: REVIEW_DATE,
      researchLevel: "issuer-catalogue" as const,
      researchNote:
        "The issuer's current catalogue was checked. Any field not explicitly listed remains marked as unverified rather than estimated.",
      ...COMMON_FINANCIALS[card.id],
    } satisfies CardReviewEnrichment,
  ]),
) as Record<string, CardReviewEnrichment>;

/**
 * Every local card receives an issuer-catalogue audit record. Deep product
 * research is layered on top and wins field-by-field, while live Supabase data
 * can still override non-authoritative catalogue records.
 */
export const CARD_REVIEW_ENRICHMENT: Record<string, CardReviewEnrichment> = {
  ...ISSUER_AUDIT_ENRICHMENT,
  ...Object.fromEntries(
    Object.entries(CURATED_CARD_REVIEW_ENRICHMENT).map(([id, detail]) => [
      id,
      {
        ...ISSUER_AUDIT_ENRICHMENT[id],
        ...detail,
        researchLevel: detail.insuranceSourceUrl ? "certificate" : "product-page",
        researchNote: detail.insuranceSourceUrl
          ? "Card terms and the linked insurance certificate were checked against official issuer material."
          : "Card terms were checked against the issuer's official product page.",
      },
    ]),
  ),
};

export type SpendKey = "dining" | "grocery" | "gas" | "travel" | "other";

export interface CardDef {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  rates: Record<SpendKey, number>;
  badge: string;
  color: string;
  description: string;
  img: string;
  bankUrl: string;
  perks: string[];
}

export interface Step {
  key: SpendKey;
  icon: string;
  label: string;
  question: string;
  hint: string;
  max: number;
  defaultVal: number;
  presets: { label: string; value: number }[];
}

export const DEFAULT_SPEND: Record<SpendKey, number> = {
  dining: 400, grocery: 600, gas: 150, travel: 300, other: 500,
};

export const CAT_LABELS: Record<SpendKey, string> = {
  dining: "Dining", grocery: "Groceries", gas: "Gas", travel: "Travel", other: "Shopping",
};

export const CARDS: CardDef[] = [
  {
    id: "cobalt",
    name: "Amex Cobalt",
    issuer: "American Express",
    annualFee: 156,
    rates: { dining: 0.05, grocery: 0.05, gas: 0.02, travel: 0.02, other: 0.01 },
    badge: "🍽️ Best for Dining",
    color: "var(--accent-rose)",
    description: "5x points on dining & groceries. Massive welcome bonus. Best for food spenders.",
    img: "/cards/amex-cobalt.webp",
    bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/cobalt-card/",
    perks: ["5x on dining & food delivery", "5x on groceries", "2x on travel & transit", "1x everything else", "$156/yr · $13/month"],
  },
  {
    id: "scotia-gold",
    name: "Scotia Gold Amex",
    issuer: "Scotiabank",
    annualFee: 120,
    rates: { dining: 0.05, grocery: 0.06, gas: 0.03, travel: 0.03, other: 0.01 },
    badge: "🛒 Best Grocery Card",
    color: "var(--accent-warm)",
    description: "6x on groceries + 5x dining. Exceptional for everyday Canadian spending.",
    img: "/cards/Scotiabank-gold-amex.avif",
    bankUrl: "https://hello.scotiabank.com/lending/triage?productCode=AXG&subProductCode=GC&source=116B&language=en",
    perks: ["6x Scene+ on groceries", "5x on dining & entertainment", "3x on gas & transit", "No foreign transaction fees", "$120/yr annual fee"],
  },
  {
    id: "td-aeroplan",
    name: "TD Aeroplan Visa Infinite",
    issuer: "TD Bank",
    annualFee: 139,
    rates: { dining: 0.03, grocery: 0.015, gas: 0.015, travel: 0.03, other: 0.01 },
    badge: "✈️ Best Travel",
    color: "#6B8FC9",
    description: "3x on Air Canada & travel. 1.5x on everyday. Best for Air Canada flyers.",
    img: "/cards/td-aeroplan-infinite.png",
    bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/",
    perks: ["3x Aeroplan on Air Canada", "3x on grocery & dining", "1.5x on all other purchases", "Air Canada companion pass", "$139/yr annual fee"],
  },
  {
    id: "rbc-avion",
    name: "RBC Avion Visa Infinite",
    issuer: "RBC",
    annualFee: 120,
    rates: { dining: 0.0125, grocery: 0.0125, gas: 0.0125, travel: 0.0125, other: 0.0125 },
    badge: "🔄 Most Flexible",
    color: "#4A90D9",
    description: "1.25x on everything. Transfer to 30+ airline partners. Suits diverse spenders.",
    img: "/cards/rbc-avion-infinite.webp",
    bankUrl: "https://apps.royalbank.com/apps/IAO/apply/cardapp?pid1=avion_inf&ASC=3D2111&_gl=1*1jecaqy*_gcl_au*MzQ5OTM5MDc2LjE3NzgzNzQ5MjI.*_ga*MjEwMDcyNDEyNC4xNzc4Mzc0OTIy*_ga_89NPCTDXQR*czE3NzgzNzQ5MjEkbzEkZzEkdDE3NzgzNzQ5NDgkajMzJGwwJGgw",
    perks: ["1.25x RBC Avion points on all purchases", "Transfer to 30+ airline partners", "Airport lounge access", "Travel insurance included", "$120/yr annual fee"],
  },
  {
    id: "bmo-eclipse",
    name: "BMO Eclipse Visa Infinite",
    issuer: "BMO",
    annualFee: 120,
    rates: { dining: 0.05, grocery: 0.05, gas: 0.05, travel: 0.01, other: 0.01 },
    badge: "⛽ Best Gas Card",
    color: "#2B6CB0",
    description: "5x on dining, grocery, and gas. $50 lifestyle credit. Great all-rounder.",
    img: "/cards/bmo-eclipse.png",
    bankUrl: "https://www.bmo.com/main/personal/credit-cards/getting-started/?lang=en&rg=BMO&PID=VISDX&MID=3930192&OFFERCODE=RQTSX00008&OFFERDATE=20251031&income_quiz=true&income=60000&household_income=100000&monthly_spend=1250&PIDBASE=VPVDM&PIDUP=VISDY&MIDBASE=3930758&OFFERCODEBASE=RQTVP00001&OFFERDATEBASE=20220910&MIDUP=6011141&OFFERCODEUP=RQTSY00005&OFFERDATEUP=20251031&income_up=150000&household_income_up=200000&monthly_spend_up=4167",
    perks: ["5x on dining, grocery & gas", "5x on drugstore purchases", "$50 annual lifestyle credit", "No foreign transaction fees", "$120/yr annual fee"],
  },
  {
    id: "wealthsimple",
    name: "Wealthsimple Card",
    issuer: "Wealthsimple",
    annualFee: 0,
    rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 },
    badge: "💸 No-Fee Pick",
    color: "#48BB78",
    description: "1% cashback on everything. No annual fee. Ideal as a backup or starter card.",
    img: "/cards/newwealthsimple.webp",
    bankUrl: "https://www.wealthsimple.com/en-ca/spend",
    perks: ["1% back in cash or crypto", "No annual fee ever", "No foreign transaction fees", "Instant cashback at checkout", "Works with all major retailers"],
  },

  // ── AMERICAN EXPRESS ──────────────────────────────────────
  { id: "amex-gold", name: "Amex Gold Rewards", issuer: "American Express", annualFee: 250, rates: { dining: 0.02, grocery: 0.01, gas: 0.01, travel: 0.02, other: 0.01 }, badge: "✈️ Travel Rewards", color: "#D4AF37", description: "2x on travel & dining. Flexible Membership Rewards. Good for travel spenders.", img: "/cards/amex-gold.avif", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/gold-rewards-card/", perks: ["2x points on travel & dining", "1x on everything else", "Airport lounge access", "Travel insurance included", "$250/yr annual fee"] },
  { id: "amex-platinum", name: "Amex Platinum Card", issuer: "American Express", annualFee: 799, rates: { dining: 0.03, grocery: 0.01, gas: 0.01, travel: 0.03, other: 0.01 }, badge: "💎 Ultra Premium", color: "#C0C0C0", description: "Premium travel card with unlimited lounge access and top-tier insurance.", img: "/cards/amex-platinum.avif", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/the-platinum-card/", perks: ["3x on travel & dining", "Unlimited airport lounge access", "$200 annual travel credit", "Premium concierge service", "$799/yr annual fee"] },
  { id: "amex-simply-cash-preferred", name: "Amex SimplyCash Preferred", issuer: "American Express", annualFee: 99, rates: { dining: 0.02, grocery: 0.02, gas: 0.04, travel: 0.02, other: 0.0125 }, badge: "⛽ Gas Cashback", color: "#2D5A27", description: "4% cashback on gas, 2% on groceries. Best flat-rate cashback Amex.", img: "/cards/amex-simply-cash-preferred.avif", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/simplycash-preferred-card/", perks: ["4% cashback on gas", "2% on groceries", "1.25% on all other purchases", "Purchase protection", "$99/yr annual fee"] },
  { id: "amex-simply-cash", name: "Amex SimplyCash", issuer: "American Express", annualFee: 0, rates: { dining: 0.0125, grocery: 0.0125, gas: 0.0125, travel: 0.0125, other: 0.0125 }, badge: "💸 No-Fee Cashback", color: "#2D5A27", description: "1.25% cashback on everything. No annual fee Amex option.", img: "/cards/amex-simply-cash.webp", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/simplycash-card/", perks: ["1.25% cashback on all purchases", "No annual fee", "Purchase protection", "Fraud protection", "Easy redemption"] },
  { id: "amex-marriott", name: "Amex Marriott Bonvoy", issuer: "American Express", annualFee: 120, rates: { dining: 0.02, grocery: 0.01, gas: 0.01, travel: 0.05, other: 0.01 }, badge: "🏨 Hotel Points", color: "#8B0000", description: "5x at Marriott properties. Free night certificate annually.", img: "/cards/amex-marriott.avif", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/marriott-bonvoy-american-express/", perks: ["5x Marriott Bonvoy points at Marriott", "2x on dining", "1x on everything else", "Annual free night certificate", "$120/yr annual fee"] },
  { id: "amex-business-edge", name: "Amex Business Edge", issuer: "American Express", annualFee: 99, rates: { dining: 0.03, grocery: 0.03, gas: 0.03, travel: 0.01, other: 0.01 }, badge: "💼 Business Card", color: "#1a3a5c", description: "3x on business essentials: dining, grocery, gas. Great for small business owners.", img: "/cards/amex-business-edge.avif", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/business-edge-card/", perks: ["3x on dining, groceries & gas", "1x on all other purchases", "Employee cards available", "Business insights dashboard", "$99/yr annual fee"] },
  { id: "amex-aeroplan", name: "Amex Aeroplan Reserve", issuer: "American Express", annualFee: 599, rates: { dining: 0.03, grocery: 0.02, gas: 0.02, travel: 0.03, other: 0.015 }, badge: "✈️ Aeroplan Elite", color: "#003366", description: "Premium Aeroplan card with priority boarding and lounge access.", img: "/cards/amex-aeroplan.avif", bankUrl: "https://www.americanexpress.com/en-ca/credit-cards/aeroplan-reserve-card/", perks: ["3x Aeroplan on Air Canada", "Priority boarding & check-in", "Maple Leaf Lounge access", "Comprehensive travel insurance", "$599/yr annual fee"] },

  // ── SCOTIABANK ────────────────────────────────────────────
  { id: "scotia-passport", name: "Scotia Passport Visa Infinite", issuer: "Scotiabank", annualFee: 150, rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.01 }, badge: "🌍 No FX Fees", color: "#CC0000", description: "2x Scene+ points on dining, grocery, travel. No foreign transaction fees.", img: "/cards/scotia-passport.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/visa/passport-infinite-card.html", perks: ["2x Scene+ on dining, grocery, travel", "No foreign transaction fees", "Airport lounge access", "Comprehensive travel insurance", "$150/yr annual fee"] },
  { id: "scotia-momentum-infinite", name: "Scotia Momentum Visa Infinite", issuer: "Scotiabank", annualFee: 120, rates: { dining: 0.04, grocery: 0.04, gas: 0.04, travel: 0.02, other: 0.01 }, badge: "💵 Cashback King", color: "#CC0000", description: "4% cashback on groceries, dining, and gas. Top cashback card in Canada.", img: "/cards/scotia-momentum-infinite.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-infinite-card.html", perks: ["4% cashback on groceries & dining", "4% cashback on gas & transit", "2% on recurring bills", "1% on everything else", "$120/yr annual fee"] },
  { id: "scotia-momentum", name: "Scotia Momentum Visa", issuer: "Scotiabank", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "💸 No-Fee Cashback", color: "#CC0000", description: "1% cashback on all purchases. No annual fee cashback starter card.", img: "/cards/scotia_momentum_visa.avif", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-no-fee-card.html", perks: ["1% cashback on all purchases", "No annual fee", "Purchase security", "Extended warranty", "Fraud alert service"] },
  { id: "scene-plus-visa", name: "Scene+ Visa", issuer: "Scotiabank", annualFee: 0, rates: { dining: 0.02, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 }, badge: "🎬 Scene+ Points", color: "#CC0000", description: "2x Scene+ on dining, 1x on everything. Free Scene+ rewards card.", img: "/cards/scene-plus-visa.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/visa/scene-card.html", perks: ["2x Scene+ on dining & entertainment", "1x Scene+ on all purchases", "No annual fee", "Redeem for movies, travel, more", "Easy Scene+ redemptions"] },
  { id: "scotia-platinum", name: "Scotiabank Platinum Amex", issuer: "Scotiabank", annualFee: 399, rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.02 }, badge: "💳 Flat-Rate Premium", color: "#CC0000", description: "2x Scene+ on everything. Top travel perks with unlimited lounge access.", img: "/cards/scotia-platinum.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/american-express/platinum-card.html", perks: ["2x Scene+ on all purchases", "Unlimited airport lounge access", "No foreign transaction fees", "Concierge service", "$399/yr annual fee"] },
  { id: "scotiabank-value", name: "Scotiabank Value Visa", issuer: "Scotiabank", annualFee: 29, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "📉 Low Rate", color: "#CC0000", description: "Low 12.99% interest rate. Best for carrying a balance occasionally.", img: "/cards/scotiabank-value.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/visa/value-card.html", perks: ["12.99% purchase interest rate", "Low balance transfer rate", "Purchase security", "$29/yr annual fee", "Simple rewards-free option"] },
  { id: "scotiabank-no-fee", name: "Scotiabank No-Fee Visa", issuer: "Scotiabank", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🆓 No Fee", color: "#CC0000", description: "Basic no-fee Visa. Entry-level card with no frills.", img: "/cards/scotia_no_fee_visa.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards.html", perks: ["No annual fee", "Purchase security", "Online banking access", "Fraud monitoring", "Basic starter card"] },

  // ── TD BANK ───────────────────────────────────────────────
  { id: "td-aeroplan-platinum", name: "TD Aeroplan Visa Platinum", issuer: "TD Bank", annualFee: 89, rates: { dining: 0.015, grocery: 0.01, gas: 0.01, travel: 0.015, other: 0.0067 }, badge: "✈️ Aeroplan Starter", color: "#00A758", description: "Entry-level Aeroplan card. Earn miles on everyday spending at a lower fee.", img: "/cards/td-aeroplan-platinum.jpeg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/", perks: ["1.5x Aeroplan on Air Canada", "1x on everyday purchases", "Travel insurance included", "Aeroplan points accumulation", "$89/yr annual fee"] },
  { id: "td-aeroplan-privilege", name: "TD Aeroplan Visa Infinite Privilege", issuer: "TD Bank", annualFee: 599, rates: { dining: 0.03, grocery: 0.02, gas: 0.02, travel: 0.03, other: 0.015 }, badge: "✈️ Aeroplan Elite", color: "#00A758", description: "Top-tier Aeroplan card with priority benefits and comprehensive insurance.", img: "/cards/td-aeroplan-privilege.jpeg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/", perks: ["3x Aeroplan on Air Canada & travel", "Priority boarding & check-in", "Maple Leaf Lounge access", "Most comprehensive travel insurance", "$599/yr annual fee"] },
  { id: "td-cashback-infinite", name: "TD Cash Back Visa Infinite", issuer: "TD Bank", annualFee: 120, rates: { dining: 0.03, grocery: 0.03, gas: 0.03, travel: 0.01, other: 0.01 }, badge: "💵 3% Cashback", color: "#00A758", description: "3% cashback on groceries, dining, and gas. Solid everyday cashback card.", img: "/cards/td-cashback-infinite.jpeg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/", perks: ["3% cashback on groceries, dining & gas", "1% on all other purchases", "Auto rental collision coverage", "Purchase security", "$120/yr annual fee"] },
  { id: "td-first-class", name: "TD First Class Travel Visa Infinite", issuer: "TD Bank", annualFee: 139, rates: { dining: 0.03, grocery: 0.015, gas: 0.015, travel: 0.03, other: 0.01 }, badge: "✈️ Travel Points", color: "#00A758", description: "Earn TD Rewards points on travel and everyday purchases.", img: "/cards/td-first-class.jpeg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/travel/", perks: ["3x TD Rewards on travel & dining", "1.5x on groceries & gas", "Travel medical insurance", "Trip cancellation coverage", "$139/yr annual fee"] },
  { id: "td-platinum-travel", name: "TD Platinum Travel Visa", issuer: "TD Bank", annualFee: 89, rates: { dining: 0.02, grocery: 0.015, gas: 0.015, travel: 0.02, other: 0.01 }, badge: "✈️ Travel Starter", color: "#00A758", description: "Entry travel card with TD Rewards. Good everyday earner at a lower fee.", img: "/cards/td-platinum-travel.jpg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/travel/", perks: ["2x TD Rewards on travel", "1.5x on grocery & gas", "Travel insurance", "TD Rewards program", "$89/yr annual fee"] },
  { id: "td-rewards-visa", name: "TD Rewards Visa", issuer: "TD Bank", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "🆓 No-Fee Points", color: "#00A758", description: "Earn TD Rewards points with no annual fee.", img: "/cards/td-rewards-visa.jpg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/", perks: ["TD Rewards points on all purchases", "No annual fee", "Redeem for travel, merchandise", "Purchase security", "Easy online management"] },
  { id: "td-emerald", name: "TD Emerald Flex Rate Visa", issuer: "TD Bank", annualFee: 25, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "📉 Flexible Rate", color: "#00A758", description: "Variable low interest rate. Good for those who occasionally carry a balance.", img: "/cards/td-emerald.png", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/", perks: ["Variable interest rate", "Low annual fee", "Purchase security", "Online banking access", "$25/yr annual fee"] },
  { id: "td-green", name: "TD Green Visa", issuer: "TD Bank", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🌱 Starter Card", color: "#00A758", description: "TD's most basic no-fee card. Simple, no rewards.", img: "/cards/td-green.jpeg", bankUrl: "https://www.td.com/ca/en/personal-banking/products/credit-cards/", perks: ["No annual fee", "Basic Visa benefits", "Fraud protection", "Online banking", "Good for credit building"] },

  // ── RBC ───────────────────────────────────────────────────
  { id: "rbc-avion-privilege", name: "RBC Avion Visa Infinite Privilege", issuer: "RBC", annualFee: 399, rates: { dining: 0.0125, grocery: 0.0125, gas: 0.0125, travel: 0.02, other: 0.0125 }, badge: "💎 Premium Avion", color: "#005DAA", description: "Premium Avion card with priority airport benefits and enhanced earn on travel.", img: "/cards/rbc-avion-privilege.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/avion-infinite-privilege.html", perks: ["1.25x Avion on all purchases", "Priority airport check-in", "Airport lounge access", "Comprehensive travel insurance", "$399/yr annual fee"] },
  { id: "rbc-ion-plus", name: "RBC ION+ Visa", issuer: "RBC", annualFee: 48, rates: { dining: 0.03, grocery: 0.03, gas: 0.03, travel: 0.01, other: 0.01 }, badge: "⚡ Everyday Earn", color: "#005DAA", description: "3x Avion points on groceries, dining, and gas. Great everyday earner for the price.", img: "/cards/rbc-ion-plus.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/ion-plus-visa.html", perks: ["3x Avion on grocery, dining & gas", "1x on all other purchases", "ION+ Rewards redemption", "Purchase security", "$48/yr annual fee"] },
  { id: "rbc-ion", name: "RBC ION Visa", issuer: "RBC", annualFee: 0, rates: { dining: 0.015, grocery: 0.015, gas: 0.015, travel: 0.01, other: 0.01 }, badge: "🆓 No-Fee Earn", color: "#005DAA", description: "1.5x on groceries, gas, and streaming. No annual fee entry into Avion rewards.", img: "/cards/rbc-ion.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/ion-visa.html", perks: ["1.5x Avion on grocery, dining & gas", "1x on all other purchases", "No annual fee", "Avion Rewards program", "Easy mobile management"] },
  { id: "rbc-cashback-world-elite", name: "RBC Cash Back World Elite Mastercard", issuer: "RBC", annualFee: 99, rates: { dining: 0.015, grocery: 0.02, gas: 0.015, travel: 0.01, other: 0.01 }, badge: "💵 Grocery Cashback", color: "#005DAA", description: "2% cashback on groceries. Solid everyday cashback earner.", img: "/cards/rbc-cashback-world-elite.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/cash-back-world-elite-mastercard.html", perks: ["2% cashback on groceries", "1.5% on gas & dining", "1% on all other purchases", "World Elite Mastercard benefits", "$99/yr annual fee"] },
  { id: "rbc-rewards-plus", name: "RBC Rewards+ Visa", issuer: "RBC", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "🆓 No-Fee Points", color: "#005DAA", description: "Earn RBC Rewards points with no annual fee.", img: "/cards/rbc-rewards-plus.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/rewards-plus-visa.html", perks: ["RBC Rewards points on purchases", "No annual fee", "Flexible redemption options", "Purchase security", "Online banking access"] },
  { id: "rbc-westjet-world-elite", name: "RBC WestJet World Elite Mastercard", issuer: "RBC", annualFee: 119, rates: { dining: 0.015, grocery: 0.015, gas: 0.015, travel: 0.02, other: 0.01 }, badge: "✈️ WestJet Dollars", color: "#0A5FA8", description: "Earn WestJet dollars on everyday purchases. Annual companion voucher.", img: "/cards/rbc-westjet-world-elite.webp", bankUrl: "https://www.westjet.com/en-ca/credit-cards/world-elite-mastercard", perks: ["2% WestJet dollars on WestJet", "1.5% on everyday purchases", "Annual companion voucher", "Free checked bag on WestJet", "$119/yr annual fee"] },
  { id: "rbc-westjet", name: "RBC WestJet Mastercard", issuer: "RBC", annualFee: 39, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.015, other: 0.005 }, badge: "✈️ WestJet Starter", color: "#0A5FA8", description: "Entry WestJet card. Earn WestJet dollars at a lower fee.", img: "/cards/rbc-westjet.webp", bankUrl: "https://www.westjet.com/en-ca/credit-cards/mastercard", perks: ["1.5% WestJet dollars on WestJet", "1% on everyday purchases", "Free checked bag on WestJet", "Travel insurance", "$39/yr annual fee"] },
  { id: "rbc-british-airways", name: "RBC British Airways Visa Infinite", issuer: "RBC", annualFee: 165, rates: { dining: 0.015, grocery: 0.01, gas: 0.01, travel: 0.03, other: 0.01 }, badge: "✈️ Avios Points", color: "#075AAA", description: "Earn British Airways Avios. Good for transatlantic travel via BA.", img: "/cards/rbc-british-airways.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/british-airways-visa-infinite.html", perks: ["3x Avios on British Airways", "1.5x Avios on dining", "1x on all other purchases", "Avios travel redemptions", "$165/yr annual fee"] },
  { id: "rbc-visa-classic", name: "RBC Visa Classic", issuer: "RBC", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🌱 Starter", color: "#005DAA", description: "RBC's basic no-fee Visa. Simple credit building card.", img: "/cards/rbc-visa-classic.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/classic-visa.html", perks: ["No annual fee", "Basic Visa benefits", "Fraud protection", "Online banking", "Credit building card"] },

  // ── BMO ───────────────────────────────────────────────────
  { id: "bmo-eclipse-rise", name: "BMO Eclipse Rise Visa", issuer: "BMO", annualFee: 0, rates: { dining: 0.03, grocery: 0.03, gas: 0.03, travel: 0.01, other: 0.01 }, badge: "🆓 No-Fee 3%", color: "#0079C1", description: "3x points on dining, grocery, gas. No annual fee version of Eclipse.", img: "/cards/bmo-eclipse-rise.jpg", bankUrl: "https://www.bmo.com/main/personal/credit-cards/", perks: ["3x points on dining, grocery & gas", "1x on all other purchases", "No annual fee", "BMO Rewards program", "Easy online redemption"] },
  { id: "bmo-cashback-world-elite", name: "BMO CashBack World Elite Mastercard", issuer: "BMO", annualFee: 120, rates: { dining: 0.05, grocery: 0.03, gas: 0.03, travel: 0.01, other: 0.01 }, badge: "💵 5% Dining", color: "#0079C1", description: "5% cashback on dining. Strong everyday cashback earner.", img: "/cards/bmo-cashback-world-elite.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/bmo-cashback-world-elite-mastercard/", perks: ["5% cashback on dining", "3% on groceries & gas", "1% on all other purchases", "World Elite Mastercard benefits", "$120/yr annual fee"] },
  { id: "bmo-cashback", name: "BMO CashBack Mastercard", issuer: "BMO", annualFee: 0, rates: { dining: 0.03, grocery: 0.01, gas: 0.01, travel: 0.005, other: 0.005 }, badge: "💸 No-Fee Cashback", color: "#0079C1", description: "3% cashback on dining, 1% on groceries. No annual fee.", img: "/cards/bmo-cashback.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/bmo-cashback-mastercard/", perks: ["3% cashback on dining", "1% on groceries", "0.5% on everything else", "No annual fee", "Unlimited cashback"] },
  { id: "bmo-rewards", name: "BMO Rewards Mastercard", issuer: "BMO", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "🆓 BMO Points", color: "#0079C1", description: "Earn BMO Rewards points with no annual fee.", img: "/cards/bmo-ascend.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/", perks: ["BMO Rewards points on purchases", "No annual fee", "Flexible redemption", "Online account management", "No minimum redemption"] },
  { id: "bmo-airmiles-world-elite", name: "BMO AIR MILES World Elite Mastercard", issuer: "BMO", annualFee: 120, rates: { dining: 0.02, grocery: 0.02, gas: 0.03, travel: 0.02, other: 0.01 }, badge: "✈️ AIR MILES Elite", color: "#0079C1", description: "Top AIR MILES earning card. 3x on gas, 2x on groceries.", img: "/cards/bmo-ascend.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/bmo-air-miles-world-elite-mastercard/", perks: ["3x AIR MILES on gas", "2x on groceries, dining & travel", "AIR MILES Dream rewards", "World Elite benefits", "$120/yr annual fee"] },
  { id: "bmo-airmiles", name: "BMO AIR MILES Mastercard", issuer: "BMO", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.015, travel: 0.01, other: 0.005 }, badge: "✈️ AIR MILES Starter", color: "#0079C1", description: "Entry AIR MILES card. No annual fee.", img: "/cards/bmo-ascend.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/bmo-air-miles-mastercard/", perks: ["AIR MILES on all purchases", "No annual fee", "Redeem for flights & more", "AIR MILES Cash option", "Good AIR MILES starter"] },
  { id: "bmo-preferred-rate", name: "BMO Preferred Rate Mastercard", issuer: "BMO", annualFee: 20, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "📉 Low Interest", color: "#0079C1", description: "Low 12.99% purchase interest rate. Best for occasional balance carriers.", img: "/cards/bmo-preferred-rate.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/bmo-preferred-rate-mastercard/", perks: ["12.99% purchase interest rate", "Low balance transfer rate", "Purchase security", "Extended warranty", "$20/yr annual fee"] },
  { id: "bmo-student", name: "BMO Student Mastercard", issuer: "BMO", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🎓 Student Card", color: "#0079C1", description: "No fee student card. Build credit while earning rewards.", img: "/cards/bmo-student-cashback-mastercard.webp", bankUrl: "https://www.bmo.com/main/personal/credit-cards/", perks: ["No annual fee", "No minimum income required", "BMO Rewards or cashback option", "Credit building tool", "Student-friendly approval"] },

  // ── CIBC ──────────────────────────────────────────────────
  { id: "cibc-aventura-infinite", name: "CIBC Aventura Visa Infinite", issuer: "CIBC", annualFee: 139, rates: { dining: 0.02, grocery: 0.015, gas: 0.015, travel: 0.03, other: 0.01 }, badge: "✈️ Aventura Points", color: "#C41230", description: "3x Aventura on travel. Flexible travel redemption across all airlines.", img: "/cards/cibc-aventura-infinite.webp", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/aventura-visa-infinite.html", perks: ["3x Aventura on travel", "2x on dining", "1.5x on grocery & gas", "Flexible airline redemptions", "$139/yr annual fee"] },
  { id: "cibc-aventura-privilege", name: "CIBC Aventura Visa Infinite Privilege", issuer: "CIBC", annualFee: 499, rates: { dining: 0.03, grocery: 0.02, gas: 0.02, travel: 0.03, other: 0.015 }, badge: "💎 Aventura Elite", color: "#C41230", description: "Premium Aventura card with airport lounge and elite travel benefits.", img: "/cards/cibc_aventura_cibc.avif", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/aventura-visa-infinite-privilege.html", perks: ["3x Aventura on travel & dining", "2x on grocery & gas", "Airport lounge access", "Elite travel insurance", "$499/yr annual fee"] },
  { id: "cibc-dividend-infinite", name: "CIBC Dividend Visa Infinite", issuer: "CIBC", annualFee: 99, rates: { dining: 0.04, grocery: 0.04, gas: 0.04, travel: 0.01, other: 0.01 }, badge: "💵 4% Cashback", color: "#C41230", description: "4% cashback on groceries, dining, and gas. Top cashback card.", img: "/cards/cibc-dividend-infinite.webp", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/dividend-visa-infinite.html", perks: ["4% cashback on groceries, dining & gas", "2% on Tim Hortons & Costco", "1% on everything else", "Monthly cashback payout option", "$99/yr annual fee"] },
  { id: "cibc-dividend-visa", name: "CIBC Dividend Visa", issuer: "CIBC", annualFee: 0, rates: { dining: 0.02, grocery: 0.02, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "💸 No-Fee Cashback", color: "#C41230", description: "2% on groceries and dining. No annual fee cashback card.", img: "/cards/cibc-dividend-visa.webp", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/dividend-visa.html", perks: ["2% cashback on groceries", "2% on dining", "1% on gas", "No annual fee", "Monthly cashback"] },
  { id: "cibc-aeroplan-infinite", name: "CIBC Aeroplan Visa Infinite", issuer: "CIBC", annualFee: 139, rates: { dining: 0.03, grocery: 0.015, gas: 0.015, travel: 0.03, other: 0.01 }, badge: "✈️ Aeroplan Miles", color: "#C41230", description: "3x Aeroplan on Air Canada and travel. Great for frequent flyers.", img: "/cards/cibc-aeroplan-infinite.webp", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/aeroplan-visa-infinite.html", perks: ["3x Aeroplan on Air Canada", "3x on groceries & dining", "1.5x on gas", "Aeroplan bonus perks", "$139/yr annual fee"] },
  { id: "cibc-aeroplan-privilege", name: "CIBC Aeroplan Visa Infinite Privilege", issuer: "CIBC", annualFee: 599, rates: { dining: 0.03, grocery: 0.02, gas: 0.02, travel: 0.03, other: 0.015 }, badge: "✈️ Aeroplan Elite", color: "#C41230", description: "Elite Aeroplan card with priority benefits and top insurance.", img: "/cards/cibc_aeroplane_ifinite_privilge.avif", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/aeroplan-visa-infinite-privilege.html", perks: ["3x Aeroplan on Air Canada & travel", "Priority boarding", "Maple Leaf Lounge access", "Elite travel insurance package", "$599/yr annual fee"] },
  { id: "cibc-aeroplan-platinum", name: "CIBC Aerogold Visa Platinum", issuer: "CIBC", annualFee: 89, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.015, other: 0.0067 }, badge: "✈️ Aeroplan Starter", color: "#C41230", description: "Entry-level Aeroplan card at a lower annual fee.", img: "/cards/cibc-aventura-infinite.webp", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/aeroplan.html", perks: ["1.5x Aeroplan on Air Canada", "1x on everyday purchases", "Travel insurance", "Aeroplan program access", "$89/yr annual fee"] },
  { id: "cibc-aeroplan-no-fee", name: "CIBC Aeroplan Visa", issuer: "CIBC", annualFee: 0, rates: { dining: 0.01, grocery: 0.005, gas: 0.005, travel: 0.01, other: 0.005 }, badge: "✈️ No-Fee Aeroplan", color: "#C41230", description: "Earn Aeroplan points with no annual fee.", img: "/cards/cibc_areoplane_visa.avif", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/aeroplan.html", perks: ["Aeroplan points on purchases", "No annual fee", "Aeroplan program access", "Basic travel insurance", "Credit building"] },
  { id: "cibc-select", name: "CIBC Select Visa", issuer: "CIBC", annualFee: 29, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "📉 Low Rate", color: "#C41230", description: "Low 13.99% interest rate Visa. Good for balance carriers.", img: "/cards/cibc_select_visa.avif", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/select-visa.html", perks: ["13.99% purchase interest rate", "Low balance transfer rate", "Purchase security", "Extended warranty", "$29/yr annual fee"] },
  { id: "cibc-classic", name: "CIBC Classic Visa", issuer: "CIBC", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🌱 Starter Card", color: "#C41230", description: "Basic no-fee CIBC Visa. Entry-level card.", img: "/cards/cibc_classic_visa.avif", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards.html", perks: ["No annual fee", "Visa benefits", "Fraud protection", "Online banking", "Good for credit building"] },

  // ── NATIONAL BANK ─────────────────────────────────────────
  { id: "nbc-world-elite", name: "National Bank World Elite Mastercard", issuer: "National Bank", annualFee: 150, rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.015 }, badge: "💳 All-Around Points", color: "#ED1C24", description: "2x À la carte rewards on everything. Generous insurance package.", img: "/cards/nbc-world-elite.png", bankUrl: "https://www.nbc.ca/personal/credit-cards/world-elite-mastercard.html", perks: ["2x rewards on all purchases", "Airport lounge access", "Comprehensive travel insurance", "No foreign transaction fees", "$150/yr annual fee"] },
  { id: "nbc-world", name: "National Bank World Mastercard", issuer: "National Bank", annualFee: 65, rates: { dining: 0.02, grocery: 0.015, gas: 0.015, travel: 0.015, other: 0.01 }, badge: "💳 World Points", color: "#ED1C24", description: "Good rewards on dining and everyday spending at a moderate fee.", img: "/cards/nbc-world.png", bankUrl: "https://www.nbc.ca/personal/credit-cards.html", perks: ["2x on dining", "1.5x on grocery & gas", "Travel insurance included", "À la carte rewards", "$65/yr annual fee"] },
  { id: "nbc-mycredit", name: "National Bank My Credit Mastercard", issuer: "National Bank", annualFee: 0, rates: { dining: 0.02, grocery: 0.015, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "💸 No-Fee Earn", color: "#ED1C24", description: "Earn rewards on dining and groceries with no annual fee.", img: "/cards/nbc-mycredit.png", bankUrl: "https://www.nbc.ca/personal/credit-cards.html", perks: ["2% on dining", "1.5% on groceries", "No annual fee", "Flexible redemption", "Easy approval"] },
  { id: "nbc-echo", name: "National Bank Echo Cashback Mastercard", issuer: "National Bank", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 }, badge: "💸 Flat Cashback", color: "#ED1C24", description: "1% cashback on all purchases. Simple no-fee card.", img: "/cards/nbc-echo.png", bankUrl: "https://www.nbc.ca/personal/credit-cards.html", perks: ["1% cashback on all purchases", "No annual fee", "Simple redemption", "Purchase security", "Easy to use"] },
  { id: "nbc-syncro", name: "National Bank Syncro Mastercard", issuer: "National Bank", annualFee: 35, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "📉 Low Rate", color: "#ED1C24", description: "Low interest Syncro card. Flexible rate based on prime.", img: "/cards/nbc-syncro.png", bankUrl: "https://www.nbc.ca/personal/credit-cards.html", perks: ["Variable low interest rate", "Based on prime rate", "Simple payments", "$35/yr annual fee", "Balance transfer option"] },
  { id: "nbc-mastercard", name: "National Bank Mastercard", issuer: "National Bank", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🌱 Basic Card", color: "#ED1C24", description: "Basic no-fee National Bank Mastercard.", img: "/cards/nbc-mastercard.png", bankUrl: "https://www.nbc.ca/personal/credit-cards.html", perks: ["No annual fee", "Mastercard benefits", "Fraud protection", "Online banking", "Credit building"] },

  // ── DESJARDINS ────────────────────────────────────────────
  { id: "desjardins-odyssey-world", name: "Desjardins Odyssey World Elite Mastercard", issuer: "Desjardins", annualFee: 130, rates: { dining: 0.03, grocery: 0.03, gas: 0.02, travel: 0.02, other: 0.015 }, badge: "🌍 Quebec Top Card", color: "#009A44", description: "Top Desjardins card. 3x on dining and groceries, strong insurance.", img: "", bankUrl: "https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html", perks: ["3x BONUSDOLLARS on dining & grocery", "2x on gas & travel", "Lounge access", "Comprehensive travel insurance", "$130/yr annual fee"] },
  { id: "desjardins-odyssey", name: "Desjardins Odyssey Visa Infinite", issuer: "Desjardins", annualFee: 100, rates: { dining: 0.02, grocery: 0.02, gas: 0.015, travel: 0.015, other: 0.01 }, badge: "✈️ Odyssey Points", color: "#009A44", description: "Earn Odyssey points on everyday spending. Good travel card.", img: "", bankUrl: "https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html", perks: ["2x on dining & groceries", "1.5x on gas & travel", "Travel insurance", "BONUSDOLLARS rewards", "$100/yr annual fee"] },
  { id: "desjardins-cash-world", name: "Desjardins Cash Back World Elite Mastercard", issuer: "Desjardins", annualFee: 100, rates: { dining: 0.04, grocery: 0.03, gas: 0.02, travel: 0.01, other: 0.01 }, badge: "💵 Cash Back", color: "#009A44", description: "4% cashback on dining, 3% on groceries. Solid cashback choice.", img: "", bankUrl: "https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html", perks: ["4% cashback on dining", "3% on groceries", "2% on gas", "1% on everything else", "$100/yr annual fee"] },
  { id: "desjardins-visa-infinite", name: "Desjardins Visa Infinite Privilege", issuer: "Desjardins", annualFee: 95, rates: { dining: 0.02, grocery: 0.02, gas: 0.015, travel: 0.02, other: 0.01 }, badge: "💳 Visa Infinite", color: "#009A44", description: "Earn BONUSDOLLARS on all spending. Travel insurance included.", img: "", bankUrl: "https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html", perks: ["2x BONUSDOLLARS on dining & travel", "1.5x on gas", "Travel insurance", "Purchase protection", "$95/yr annual fee"] },
  { id: "desjardins-visa", name: "Desjardins Visa", issuer: "Desjardins", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🆓 No-Fee Visa", color: "#009A44", description: "No annual fee Desjardins Visa with basic rewards.", img: "", bankUrl: "https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html", perks: ["BONUSDOLLARS on purchases", "No annual fee", "Basic insurance", "Online banking", "Caisse member benefits"] },
  { id: "caisse-visa", name: "Desjardins Classic Visa", issuer: "Desjardins", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🌱 Basic Visa", color: "#009A44", description: "Basic no-fee Visa from Desjardins. Credit building.", img: "", bankUrl: "https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html", perks: ["No annual fee", "Visa benefits", "Fraud protection", "Online banking", "Caisse network"] },

  // ── MBNA ──────────────────────────────────────────────────
  { id: "mbna-rewards-world-elite", name: "MBNA Rewards World Elite Mastercard", issuer: "MBNA", annualFee: 120, rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.02 }, badge: "💳 2x Everything", color: "#003087", description: "Earn 2x points on all purchases. Simple, consistent earn rate.", img: "/cards/mbna-creditcard-rewards-world-elite.png", bankUrl: "https://www.mbna.ca/en/credit-cards.html", perks: ["2x MBNA Rewards on all purchases", "World Elite Mastercard benefits", "Flexible redemption", "Travel insurance", "$120/yr annual fee"] },
  { id: "mbna-rewards-platinum", name: "MBNA Rewards Platinum Plus Mastercard", issuer: "MBNA", annualFee: 0, rates: { dining: 0.02, grocery: 0.02, gas: 0.01, travel: 0.01, other: 0.01 }, badge: "🆓 No-Fee Points", color: "#003087", description: "2x on dining and groceries with no annual fee. Solid no-fee earner.", img: "/cards/MBNA-credit-card-mbna-rewards.png", bankUrl: "https://www.mbna.ca/en/credit-cards.html", perks: ["2x on dining & groceries", "1x on all other purchases", "No annual fee", "MBNA Rewards program", "Flexible redemption"] },
  { id: "mbna-true-line", name: "MBNA True Line Mastercard", issuer: "MBNA", annualFee: 0, rates: { dining: 0.005, grocery: 0.005, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "📉 Low Interest", color: "#003087", description: "Low 12.99% interest rate. No annual fee. Best for balance carrying.", img: "/cards/MBNA-true-line.png", bankUrl: "https://www.mbna.ca/en/credit-cards.html", perks: ["12.99% purchase interest rate", "No annual fee", "No rewards - low rate focus", "Balance transfer option", "Simple interest-focused card"] },
  { id: "mbna-amazon", name: "Amazon.ca Rewards Mastercard", issuer: "MBNA", annualFee: 0, rates: { dining: 0.015, grocery: 0.015, gas: 0.015, travel: 0.01, other: 0.015 }, badge: "🛒 Amazon Cashback", color: "#FF9900", description: "1.5% back on all Amazon.ca purchases and everywhere else. No fee.", img: "/cards/amazon-mastercard.jpeg", bankUrl: "https://www.amazon.ca/credit-card", perks: ["2.5% on Amazon.ca (Prime members)", "1.5% on all other purchases", "No annual fee", "No foreign transaction fees", "Instant cashback at checkout"] },
  { id: "mbna-rewards", name: "MBNA Rewards Mastercard", issuer: "MBNA", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.005 }, badge: "🆓 Basic Points", color: "#003087", description: "Basic MBNA Rewards card with no annual fee.", img: "/cards/MBNA-credit-card-mbna-rewards.png", bankUrl: "https://www.mbna.ca/en/credit-cards.html", perks: ["MBNA Rewards points on purchases", "No annual fee", "Flexible redemption", "Purchase protection", "Basic travel insurance"] },

  // ── PC FINANCIAL ──────────────────────────────────────────
  { id: "pc-world-elite", name: "PC World Elite Mastercard", issuer: "PC Financial", annualFee: 0, rates: { dining: 0.015, grocery: 0.03, gas: 0.015, travel: 0.01, other: 0.01 }, badge: "🛒 PC Optimum", color: "#CC0000", description: "3x PC Optimum at Loblaw stores. Best no-fee grocery card if you shop Loblaws.", img: "/cards/pc-world-elite.webp", bankUrl: "https://www.pcfinancial.ca/en/credit-cards/", perks: ["45 PC Optimum/$ at Shoppers Drug Mart", "30 PC Optimum/$ at Loblaws stores", "World Elite Mastercard benefits", "No annual fee", "PC Optimum ecosystem"] },
  { id: "pc-world", name: "PC World Mastercard", issuer: "PC Financial", annualFee: 0, rates: { dining: 0.01, grocery: 0.02, gas: 0.01, travel: 0.005, other: 0.005 }, badge: "🛒 PC Points", color: "#CC0000", description: "Earn PC Optimum at Loblaws grocery stores. No annual fee.", img: "/cards/pc-world.webp", bankUrl: "https://www.pcfinancial.ca/en/credit-cards/", perks: ["25 PC Optimum/$ at Loblaws", "20 PC Optimum/$ at Shoppers", "No annual fee", "PC Optimum program", "Grocery-focused earner"] },
  { id: "pc-mastercard", name: "PC Mastercard", issuer: "PC Financial", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.005, travel: 0.005, other: 0.005 }, badge: "🛒 Entry PC Card", color: "#CC0000", description: "Basic PC Optimum earning card. Good starter for the PC ecosystem.", img: "/cards/pc-mastercard.webp", bankUrl: "https://www.pcfinancial.ca/en/credit-cards/", perks: ["PC Optimum points on purchases", "No annual fee", "PC Optimum program", "Loblaw partner benefits", "Credit building option"] },

  // ── BRIM FINANCIAL ────────────────────────────────────────
  { id: "brim-world-elite", name: "Brim World Elite Mastercard", issuer: "Brim Financial", annualFee: 199, rates: { dining: 0.02, grocery: 0.015, gas: 0.015, travel: 0.02, other: 0.02 }, badge: "💳 Brim Rewards", color: "#1A1A2E", description: "Earn Brim Rewards everywhere. No foreign transaction fees with great earn rates.", img: "/cards/brim.png", bankUrl: "https://www.brimfinancial.com/", perks: ["2x Brim Rewards on all purchases", "No foreign transaction fees", "World Elite benefits", "Instalment plans", "$199/yr annual fee"] },
  { id: "brim-world", name: "Brim World Mastercard", issuer: "Brim Financial", annualFee: 99, rates: { dining: 0.015, grocery: 0.01, gas: 0.01, travel: 0.015, other: 0.015 }, badge: "💳 Brim Mid-Tier", color: "#1A1A2E", description: "Mid-tier Brim card. Earn 1.5% back with no FX fees.", img: "/cards/brim.png", bankUrl: "https://www.brimfinancial.com/", perks: ["1.5% Brim Rewards on all purchases", "No foreign transaction fees", "World Mastercard benefits", "Instalment plans", "$99/yr annual fee"] },
  { id: "brim", name: "Brim Mastercard", issuer: "Brim Financial", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 }, badge: "🆓 No-Fee Brim", color: "#1A1A2E", description: "1% Brim Rewards with no annual fee. No FX fees.", img: "/cards/brim.png", bankUrl: "https://www.brimfinancial.com/", perks: ["1% Brim Rewards on all purchases", "No annual fee", "No foreign transaction fees", "Easy instalment plans", "Modern app experience"] },

  // ── ROGERS / FIDO ─────────────────────────────────────────
  { id: "rogers-world-elite", name: "Rogers World Elite Mastercard", issuer: "Rogers Bank", annualFee: 0, rates: { dining: 0.015, grocery: 0.015, gas: 0.015, travel: 0.03, other: 0.015 }, badge: "📱 Rogers Cashback", color: "#DA291C", description: "1.5% cashback everywhere, 3% on foreign purchases. Best no-fee travel card.", img: "/cards/rogers-world-elite.png", bankUrl: "https://www.rogersbank.com/en/rogers_world_elite_mastercard", perks: ["3% cashback on foreign currency", "1.5% on all CAD purchases", "No annual fee", "No foreign transaction fees", "World Elite Mastercard benefits"] },
  { id: "rogers-platinum", name: "Rogers Platinum Mastercard", issuer: "Rogers Bank", annualFee: 29, rates: { dining: 0.015, grocery: 0.015, gas: 0.015, travel: 0.015, other: 0.015 }, badge: "📱 Rogers Points", color: "#DA291C", description: "Earn Rogers Dollars on all purchases. Good for Rogers customers.", img: "/cards/rogers-platinum.png", bankUrl: "https://www.rogersbank.com/en/rogers_platinum_mastercard", perks: ["1.5% Rogers Dollars on all purchases", "Apply against Rogers bills", "$29/yr annual fee", "Purchase insurance", "Rogers ecosystem rewards"] },
  { id: "rogers-red", name: "Rogers Red Mastercard", issuer: "Rogers Bank", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 }, badge: "📱 Rogers Starter", color: "#DA291C", description: "1% Rogers Dollars on all purchases. No annual fee entry card.", img: "/cards/rogers-red.png", bankUrl: "https://www.rogersbank.com/en/rogers_red_mastercard", perks: ["1% Rogers Dollars on purchases", "No annual fee", "Apply against Rogers bills", "Purchase security", "Rogers customer benefits"] },

  // ── CANADIAN TIRE ─────────────────────────────────────────
  { id: "triangle-world-elite", name: "Triangle World Elite Mastercard", issuer: "Canadian Tire", annualFee: 0, rates: { dining: 0.04, grocery: 0.04, gas: 0.05, travel: 0.01, other: 0.01 }, badge: "⛽ Triangle Points", color: "#E3141B", description: "5% on gas, 4% on groceries and dining. Best no-fee card for gas.", img: "/cards/canadian_tire_world_elite_mastercard.webp", bankUrl: "https://www.canadiantire.ca/en/credit-services/triangle-world-elite-mastercard.html", perks: ["5% CT Money on gas", "4% on groceries & dining", "1% on all other purchases", "No annual fee", "Canadian Tire ecosystem"] },
  { id: "triangle", name: "Triangle Mastercard", issuer: "Canadian Tire", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.015, travel: 0.005, other: 0.005 }, badge: "🍁 CT Money", color: "#E3141B", description: "Earn CT Money at Canadian Tire and partners. No annual fee.", img: "/cards/canadian_tire_spot-triangle-mastercard.webp", bankUrl: "https://www.canadiantire.ca/en/credit-services/triangle-mastercard.html", perks: ["1.5% CT Money on gas", "1% on groceries", "CT Money at Canadian Tire stores", "No annual fee", "Triangle Rewards program"] },

  // ── TANGERINE ─────────────────────────────────────────────
  { id: "tangerine-money-back", name: "Tangerine Money-Back Credit Card", issuer: "Tangerine", annualFee: 0, rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.005, other: 0.005 }, badge: "💸 Choose Your 2%", color: "#FF6600", description: "2% cashback on 2 categories you choose. No annual fee. Highly flexible.", img: "/cards/tangerine-money-back.jpg", bankUrl: "https://www.tangerine.ca/en/products/spending/creditcard", perks: ["2% cashback on 2 categories you pick", "0.5% on everything else", "No annual fee", "No limit on cashback", "Add 3rd category with savings account"] },

  // ── SIMPLII FINANCIAL ─────────────────────────────────────
  { id: "simplii-cashback", name: "Simplii Financial Cash Back Visa", issuer: "Simplii Financial", annualFee: 0, rates: { dining: 0.04, grocery: 0.015, gas: 0.015, travel: 0.015, other: 0.005 }, badge: "🍽️ 4% Dining", color: "#CC0000", description: "4% cashback on dining and bars. No annual fee. Best no-fee dining card.", img: "/cards/simplii.webp", bankUrl: "https://www.simplii.com/en/credit-cards.html", perks: ["4% cashback on dining & bars", "1.5% on grocery & gas", "0.5% on all other purchases", "No annual fee", "Monthly cashback deposit"] },



  // ── ATB FINANCIAL ─────────────────────────────────────────
  { id: "atb-world-elite", name: "ATB World Elite Mastercard", issuer: "ATB Financial", annualFee: 120, rates: { dining: 0.015, grocery: 0.015, gas: 0.015, travel: 0.015, other: 0.015 }, badge: "🌾 Alberta Card", color: "#004B8D", description: "1.5% cashback everywhere. Great for Albertans who bank with ATB.", img: "", bankUrl: "https://www.atb.com/personal/bank/credit-cards/", perks: ["1.5% cashback on all purchases", "World Elite Mastercard benefits", "Travel insurance", "Alberta-focused banking", "$120/yr annual fee"] },
  { id: "atb-mastercard", name: "ATB Mastercard", issuer: "ATB Financial", annualFee: 0, rates: { dining: 0.01, grocery: 0.01, gas: 0.01, travel: 0.005, other: 0.005 }, badge: "🌾 ATB Starter", color: "#004B8D", description: "No fee ATB Mastercard. Good for ATB banking customers.", img: "/cards/atb_gold_mastercard.png", bankUrl: "https://www.atb.com/personal/bank/credit-cards/", perks: ["ATB Rewards on purchases", "No annual fee", "ATB banking integration", "Fraud protection", "Alberta banking community"] },

  // ── NEO FINANCIAL ─────────────────────────────────────────
  { id: "neo-world-elite", name: "Neo World Elite Mastercard", issuer: "Neo Financial", annualFee: 99, rates: { dining: 0.05, grocery: 0.04, gas: 0.03, travel: 0.02, other: 0.02 }, badge: "🚀 Fintech Rewards", color: "#7B2D8B", description: "High earn rates at Neo partners. Fintech-first approach with dynamic cashback.", img: "/cards/neo_world_elite_mastercard.avif", bankUrl: "https://www.neofinancial.com/credit-card", perks: ["5%+ at Neo partner stores", "4% on groceries", "3% on gas", "Dynamic cashback rates", "$99/yr annual fee"] },
  { id: "neo-mastercard", name: "Neo Mastercard", issuer: "Neo Financial", annualFee: 0, rates: { dining: 0.05, grocery: 0.03, gas: 0.02, travel: 0.01, other: 0.01 }, badge: "🚀 No-Fee Fintech", color: "#7B2D8B", description: "No fee card with high cashback at Neo partner merchants.", img: "/cards/noe_world_mastercard.avif", bankUrl: "https://www.neofinancial.com/credit-card", perks: ["5%+ at Neo partner stores", "3% on groceries", "No annual fee", "Instant cashback", "Modern banking app"] },

  // ── CAPITAL ONE ───────────────────────────────────────────
  { id: "capital-one-costco", name: "Capital One Costco Mastercard", issuer: "Capital One", annualFee: 0, rates: { dining: 0.03, grocery: 0.02, gas: 0.03, travel: 0.01, other: 0.01 }, badge: "🏪 Costco Card", color: "#CC0000", description: "3% on dining and gas, 2% at Costco. Requires Costco membership.", img: "/cards/CAPITAL_ONE_SMART_REWARDS_MASTERCARD.png", bankUrl: "https://www.costco.ca/mastercard.html", perks: ["3% cashback on dining & gas", "2% at Costco", "1% on all other purchases", "No annual fee (Costco membership required)", "Annual cashback voucher"] },
  { id: "capital-one-walmart", name: "Capital One Walmart Rewards Mastercard", issuer: "Capital One", annualFee: 0, rates: { dining: 0.0125, grocery: 0.015, gas: 0.0125, travel: 0.01, other: 0.0125 }, badge: "🛒 Walmart Points", color: "#0071DC", description: "1.25% Walmart Rewards on all purchases, 3% on Walmart.ca.", img: "/cards/CAPITAL_ONE_SMART_REWARDS_MASTERCARD.png", bankUrl: "https://www.walmart.ca/en/credit-card", perks: ["3% on Walmart.ca", "1.5% at Walmart stores & gas stations", "1.25% everywhere else", "No annual fee", "Walmart Rewards program"] },
  { id: "capital-one-aspire", name: "Capital One Aspire Cash World Elite", issuer: "Capital One", annualFee: 120, rates: { dining: 0.02, grocery: 0.02, gas: 0.02, travel: 0.02, other: 0.02 }, badge: "💵 2% Flat Rate", color: "#004A97", description: "2% cashback on everything. Simple flat-rate premium card.", img: "/cards/Capital_one_aspire-travel-card-art.png", bankUrl: "https://www.capitalone.ca/", perks: ["2% cashback on all purchases", "World Elite Mastercard benefits", "Travel insurance", "Purchase protection", "$120/yr annual fee"] },



  // ── ADDITIONAL ────────────────────────────────────────────
  { id: "scotiabank-student", name: "Scotiabank Scene+ Student Visa", issuer: "Scotiabank", annualFee: 0, rates: { dining: 0.02, grocery: 0.01, gas: 0.01, travel: 0.01, other: 0.01 }, badge: "🎓 Student Scene+", color: "#CC0000", description: "Scene+ points with no annual fee for students. Great movie rewards.", img: "/cards/scotia_no_fee_visa.webp", bankUrl: "https://www.scotiabank.com/ca/en/personal/credit-cards/student.html", perks: ["2x Scene+ on dining", "1x on all purchases", "No annual fee", "No minimum income", "Free movies with Scene+"] },
  { id: "cibc-student", name: "CIBC Dividend Visa for Students", issuer: "CIBC", annualFee: 0, rates: { dining: 0.02, grocery: 0.01, gas: 0.01, travel: 0.005, other: 0.005 }, badge: "🎓 Student Cashback", color: "#C41230", description: "Cashback for students with no annual fee and no income requirement.", img: "/cards/cibc_dividend_for_students.avif", bankUrl: "https://www.cibc.com/en/personal-banking/credit-cards/student.html", perks: ["2% cashback on dining", "1% on groceries", "No annual fee", "No minimum income", "Build credit as a student"] },
  { id: "rbc-student", name: "RBC Cash Back Mastercard for Students", issuer: "RBC", annualFee: 0, rates: { dining: 0.01, grocery: 0.02, gas: 0.01, travel: 0.005, other: 0.005 }, badge: "🎓 Student RBC", color: "#005DAA", description: "2% on groceries for students. No annual fee, no income requirement.", img: "/cards/rbc-cash-back-mastercard_students.webp", bankUrl: "https://www.rbcroyalbank.com/credit-cards/student.html", perks: ["2% cashback on groceries", "1% on all other purchases", "No annual fee", "No minimum income", "Build credit history"] },
];


export const STEPS: Step[] = [
  {
    key: "dining",
    icon: "🍽️",
    label: "Dining & Restaurants",
    question: "How much do you spend eating out each month?",
    hint: "Restaurants, cafes, takeout, food delivery",
    max: 2000,
    defaultVal: 400,
    presets: [
      { label: "Light ($200)", value: 200 },
      { label: "Average ($400)", value: 400 },
      { label: "Frequent ($800)", value: 800 },
      { label: "Daily ($1,500)", value: 1500 },
    ],
  },
  {
    key: "grocery",
    icon: "🛒",
    label: "Groceries",
    question: "What's your monthly grocery budget?",
    hint: "Supermarkets, Costco, farm boxes",
    max: 3000,
    defaultVal: 600,
    presets: [
      { label: "Solo ($300)", value: 300 },
      { label: "Couple ($600)", value: 600 },
      { label: "Family ($1,000)", value: 1000 },
      { label: "Large family ($1,800)", value: 1800 },
    ],
  },
  {
    key: "gas",
    icon: "⛽",
    label: "Gas & Fuel",
    question: "How much do you spend on gas monthly?",
    hint: "Petrol, diesel, EV charging",
    max: 1500,
    defaultVal: 150,
    presets: [
      { label: "Minimal ($50)", value: 50 },
      { label: "Commuter ($150)", value: 150 },
      { label: "Heavy driver ($300)", value: 300 },
      { label: "Fleet ($600)", value: 600 },
    ],
  },
  {
    key: "travel",
    icon: "✈️",
    label: "Travel",
    question: "What do you spend monthly on travel?",
    hint: "Flights, hotels, car rentals (annual total ÷ 12)",
    max: 5000,
    defaultVal: 300,
    presets: [
      { label: "Occasional ($100)", value: 100 },
      { label: "A few trips ($300)", value: 300 },
      { label: "Frequent ($700)", value: 700 },
      { label: "Road warrior ($2,000)", value: 2000 },
    ],
  },
  {
    key: "other",
    icon: "🛍️",
    label: "Shopping & Other",
    question: "Everything else — what's left?",
    hint: "Shopping, utilities, subscriptions, services",
    max: 5000,
    defaultVal: 500,
    presets: [
      { label: "Minimal ($200)", value: 200 },
      { label: "Average ($500)", value: 500 },
      { label: "Active ($1,000)", value: 1000 },
      { label: "Heavy ($2,500)", value: 2500 },
    ],
  },
];

export function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

export function fmtRate(r: number): string {
  return parseFloat((r * 100).toFixed(2)) + "%";
}

export function getBreakdown(card: CardDef, spend: Record<SpendKey, number>) {
  const rows = STEPS.map((s) => ({
    key: s.key,
    label: CAT_LABELS[s.key],
    rate: card.rates[s.key],
    annual: spend[s.key] * 12 * card.rates[s.key],
  }));
  const gross = rows.reduce((sum, r) => sum + r.annual, 0);
  return { rows, gross };
}

export function scoreCard(card: CardDef, spend: Record<SpendKey, number>): number {
  const annualEarn = Object.entries(spend).reduce(
    (sum, [k, v]) => sum + v * 12 * card.rates[k as SpendKey],
    0
  );
  return annualEarn - card.annualFee;
}

export function getTopCards(spend: Record<SpendKey, number>, n = 3) {
  return [...CARDS]
    .map((c) => ({ ...c, netValue: scoreCard(c, spend) }))
    .sort((a, b) => b.netValue - a.netValue)
    .slice(0, n);
}

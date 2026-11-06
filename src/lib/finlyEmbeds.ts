/**
 * FinlyWealth embeds — live on clearfin.ca from 2026-11-06.
 *
 * Everything for the embeds lives in five places, so they can be removed cleanly:
 *   1. this file
 *   2. src/components/FinlyEmbed.tsx (+ FinlyEmbed.module.css)
 *   3. the `p` renderer in src/components/BlogPostArticle.tsx that swaps a
 *      `[[finly-embed:<key>]]` line for the tool, plus those marker lines in posts.
 *   4. the "FinlyWealth tools on ClearFin" section in src/app/privacy/page.tsx.
 *   5. the one FinlyEmbed line in the Redemption options section of
 *      src/app/credit-cards/[id]/page.tsx (uses FINLY_EMBED_BY_CARD below).
 *
 * Code rules (FinlyWealth embed guide + Agreement §7(a), §17(a)):
 * - Render the tool exactly as FinlyWealth sends it: no restyling, no hiding the
 *   "Powered by FinlyWealth" credit or its disclosure line.
 * - Only set documented data- attributes. NEVER pre-fill an exact interest rate
 *   (data-apr, data-balances), because that would put an exact rate on our page.
 */

export const FINLY_AFFILIATE_ID = "STolD-r3";
export const FINLY_EMBED_SCRIPT = "https://www.finlywealth.com/embed.js";

export interface FinlyEmbedConfig {
  /** FinlyWealth tool name for data-finly-tool. */
  tool: string;
  /**
   * The embed's id from the Affiliate Hub (Embeds → New embed), for per-embed
   * stats and hub-managed settings. Empty = the tool's standard settings; clicks
   * still credit the affiliate id (shown under "Other embeds" in the hub).
   */
  embedId: string;
  /** One or two sentences above the tool saying what it's for (the guide recommends this). */
  intro: string;
}

export const FINLY_EMBEDS: Record<string, FinlyEmbedConfig> = {
  "interest-calculator": {
    tool: "credit-card-interest-calculator",
    embedId: "",
    intro:
      "Try it with your own numbers: enter your balance, your card's interest rate and what you pay each month to see how long the balance takes to clear and what it costs.",
  },
  "balance-transfer-calculator": {
    tool: "balance-transfer-calculator",
    embedId: "",
    intro:
      "If you're weighing a balance transfer, this calculator compares what moving your balance could save with each card after the transfer fee.",
  },
  // Program (American Express Membership Rewards) and starting balance are set in the hub.
  "points-amex-membership-rewards": {
    tool: "points-calculator",
    embedId: "IutlAUpqStk",
    intro:
      "See what American Express Membership Rewards points could be worth, depending on how you redeem them.",
  },
  // Program (Aeroplan) and starting balance are set in the hub.
  "points-aeroplan": {
    tool: "points-calculator",
    embedId: "-Qoq24j30zs",
    intro: "See what Aeroplan points could be worth, depending on how you redeem them.",
  },
  // Program (ATB Rewards) and starting balance are set in the hub.
  "points-atb": {
    tool: "points-calculator",
    embedId: "zfiB38C3edE",
    intro: "See what ATB Rewards points could be worth, depending on how you redeem them.",
  },
  // Program (British Airways Avios) and starting balance are set in the hub.
  "points-avios": {
    tool: "points-calculator",
    embedId: "7umOqlOfYxs",
    intro: "See what British Airways Avios could be worth, depending on how you redeem them.",
  },
  // Program (BMO Blue Rewards) and starting balance are set in the hub.
  "points-bmo-blue": {
    tool: "points-calculator",
    embedId: "mRt6bCZ_GCQ",
    intro: "See what BMO Blue Rewards points could be worth, depending on how you redeem them.",
  },
  // Program (BMO Rewards) and starting balance are set in the hub.
  "points-bmo-rewards": {
    tool: "points-calculator",
    embedId: "6H1wto3OnnY",
    intro: "See what BMO Rewards points could be worth, depending on how you redeem them.",
  },
  // Program (Canadian Tire Dollars / CT Money) and starting balance are set in the hub.
  "points-ct-money": {
    tool: "points-calculator",
    embedId: "IPRlD7gi3Ug",
    intro: "See what your Canadian Tire Money (CT Money) is worth when you redeem it.",
  },
  // Program (Capital One Smart Rewards) and starting balance are set in the hub.
  "points-capital-one-smart-rewards": {
    tool: "points-calculator",
    embedId: "YJkOubBmz9c",
    intro: "See what Capital One Smart Rewards points could be worth when you redeem them.",
  },
  // Program (CIBC Aventura) and starting balance are set in the hub.
  "points-cibc-aventura": {
    tool: "points-calculator",
    embedId: "vr07XPPdfX8",
    intro: "See what CIBC Aventura points could be worth, depending on how you redeem them.",
  },
  // Program (Desjardins BONUSDOLLARS) and starting balance are set in the hub.
  "points-desjardins-bonusdollars": {
    tool: "points-calculator",
    embedId: "ztUp5E1VkBw",
    intro: "See what Desjardins BONUSDOLLARS could be worth, depending on how you redeem them.",
  },
  // Program (Hilton Honors) and starting balance are set in the hub.
  "points-hilton-honors": {
    tool: "points-calculator",
    embedId: "Xz-epmGTNC8",
    intro: "See what Hilton Honors points could be worth, depending on how you redeem them.",
  },
  // Program (Marriott Bonvoy) and starting balance are set in the hub.
  "points-marriott-bonvoy": {
    tool: "points-calculator",
    embedId: "gzUyxyOU9zY",
    intro: "See what Marriott Bonvoy points could be worth, depending on how you redeem them.",
  },
  // Program (MBNA Rewards) and starting balance are set in the hub.
  "points-mbna-rewards": {
    tool: "points-calculator",
    embedId: "hb1YsLjWbk0",
    intro: "See what MBNA Rewards points could be worth, depending on how you redeem them.",
  },
  // Saved for later — no ClearFin card earns these programs yet, so no page uses them.
  // Place one in a blog post with [[finly-embed:<key>]] or map card ids below.
  "points-flying-blue": {
    tool: "points-calculator",
    embedId: "n2IaH5gPg9g",
    intro: "See what Flying Blue (Air France-KLM) miles could be worth, depending on how you redeem them.",
  },
  "points-air-miles": {
    tool: "points-calculator",
    embedId: "FBM5H0fHd_0",
    intro: "See what AIR MILES could be worth, depending on how you redeem them.",
  },
  "points-accor": {
    tool: "points-calculator",
    embedId: "lS7jBPESmfg",
    intro: "See what ALL - Accor Live Limitless points could be worth, depending on how you redeem them.",
  },
  // RBC Avion points transfer to Asia Miles (rbc-avion, -platinum, -privilege), but
  // those cards earn Avion — an Avion calculator suits their pages better.
  "points-asia-miles": {
    tool: "points-calculator",
    embedId: "p2igqnSDekE",
    intro: "See what Cathay Pacific Asia Miles could be worth, depending on how you redeem them.",
  },
};

/** Card pages that show a points calculator, keyed by the id used in /credit-cards/<id>. */
export const FINLY_EMBED_BY_CARD: Record<string, string> = {
  cobalt: "points-amex-membership-rewards",
  "Amex-cobalt": "points-amex-membership-rewards",
  "amex-gold": "points-amex-membership-rewards",
  "amex-platinum": "points-amex-membership-rewards",
  "amex-green": "points-amex-membership-rewards",
  "amex-aeroplan": "points-aeroplan",
  "amex-aeroplan-card": "points-aeroplan",
  "cibc-aeroplan-infinite": "points-aeroplan",
  "cibc-aeroplan-no-fee": "points-aeroplan",
  "cibc-aeroplan-privilege": "points-aeroplan",
  "cibc-aeroplan-student": "points-aeroplan",
  "td-aeroplan": "points-aeroplan",
  "td-aeroplan-platinum": "points-aeroplan",
  "td-aeroplan-privilege": "points-aeroplan",
  // ATB held back: the hub embed still opens on "ATB Gold Rewards" (0.083¢) while ClearFin
  // values these cards at FinlyWealth's "ATB Rewards" 0.5¢. Re-enable once the program is
  // confirmed (fallback: data-program="atb-rewards" override, documented by FinlyWealth).
  // "atb-mastercard": "points-atb",
  // "atb-world-elite": "points-atb",
  "rbc-british-airways": "points-avios",
  "bmo-blue": "points-bmo-blue",
  "bmo-blue-world-elite": "points-bmo-blue",
  "bmo-eclipse": "points-bmo-rewards",
  "bmo-eclipse-privilege": "points-bmo-rewards",
  "bmo-eclipse-rise": "points-bmo-rewards",
  "bmo-ascend-world-elite": "points-bmo-rewards",
  triangle: "points-ct-money",
  "triangle-world-elite": "points-ct-money",
  "capital-one-smart-rewards": "points-capital-one-smart-rewards",
  "cibc-aventura-gold": "points-cibc-aventura",
  "cibc-aventura-infinite": "points-cibc-aventura",
  "cibc-aventura-privilege": "points-cibc-aventura",
  "cibc-aventura-student": "points-cibc-aventura",
  "cibc-aventura-visa": "points-cibc-aventura",
  "desjardins-bonus-visa": "points-desjardins-bonusdollars",
  "desjardins-odyssey": "points-desjardins-bonusdollars",
  "desjardins-odyssey-world": "points-desjardins-bonusdollars",
  "desjardins-visa-infinite": "points-desjardins-bonusdollars",
  "amex-hilton": "points-hilton-honors",
  "amex-marriott": "points-marriott-bonvoy",
  "mbna-rewards-platinum": "points-mbna-rewards",
  "mbna-rewards-world-elite": "points-mbna-rewards",
};

const MARKER = /^\[\[finly-embed:([a-z0-9-]+)\]\]$/;

/** Returns the embed key when a Markdown paragraph is exactly a `[[finly-embed:<key>]]` marker. */
export function finlyEmbedKeyFromText(text: string): string | null {
  const match = MARKER.exec(text.trim());
  return match && FINLY_EMBEDS[match[1]] ? match[1] : null;
}

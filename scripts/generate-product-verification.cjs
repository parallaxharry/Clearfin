/* eslint-disable @typescript-eslint/no-require-imports, @next/next/no-assign-module-variable */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "docs/product-verification-queue-2026-09-07.json");
const asOf = "2026-09-07";
const maxAgeDays = 45;

function load(relativePath, overrides = {}) {
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, relativePath), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require: name => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
  });
  return module.exports;
}

function appFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? appFiles(absolute) : entry.name.endsWith(".tsx") ? [absolute] : [];
  });
}

function routeFor(file) {
  const relative = path.relative(path.join(root, "src/app"), file).replaceAll(path.sep, "/");
  return `/${relative.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "")}`.replace(/\/$/, "/");
}

function daysOld(date) {
  return Math.floor((Date.parse(`${asOf}T23:59:59Z`) - Date.parse(`${date}T23:59:59Z`)) / 86400000);
}

const cards = load("src/lib/cards.ts", { "./money": load("src/lib/money.ts") });
const reviews = load("src/lib/cardReviewData.ts", { "@/lib/cards": cards }).CARD_REVIEW_ENRICHMENT;
const pages = appFiles(path.join(root, "src/app")).map(file => ({
  file,
  route: routeFor(file),
  source: fs.readFileSync(file, "utf8").toLowerCase(),
}));

const uniqueCards = [...new Map(cards.CARDS.map(card => [card.id, card])).values()];
const records = uniqueCards.map(card => {
  const review = reviews[card.id];
  const ageDays = review?.reviewedAt ? daysOld(review.reviewedAt) : null;
  const mentions = pages
    .filter(page => page.source.includes(card.id.toLowerCase()) || page.source.includes(card.name.toLowerCase()))
    .map(page => page.route);
  return {
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    sourceUrl: review?.sourceUrl ?? null,
    reviewedAt: review?.reviewedAt ?? null,
    researchLevel: review?.researchLevel ?? null,
    reviewAgeDays: ageDays,
    current: ageDays !== null && ageDays >= 0 && ageDays <= maxAgeDays,
    trackedWelcomeOffer: Boolean(review?.welcomeBonus),
    calculatorConditionsModelled: Boolean(card.rewardRules),
    affectedRoutes: [...new Set([
      `/credit-cards/${card.id}`,
      "/credit-cards",
      "/credit-card-calculator-canada",
      "/compare-credit-cards-canada",
      ...mentions,
    ])].sort(),
  };
});

const report = {
  asOf,
  maxReviewAgeDays: maxAgeDays,
  policy: "Welcome offers fail closed after the review window or when their official source is missing. Product changes must be checked against every affected route listed for that product.",
  summary: {
    products: records.length,
    traceable: records.filter(record => record.sourceUrl && record.reviewedAt).length,
    current: records.filter(record => record.current).length,
    welcomeOffersTracked: records.filter(record => record.trackedWelcomeOffer).length,
    conditionalCalculatorModels: records.filter(record => record.calculatorConditionsModelled).length,
  },
  records,
};
const rendered = `${JSON.stringify(report, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== rendered) {
    console.error("Product verification queue is out of date. Run npm run generate:product-verification.");
    process.exit(1);
  }
} else {
  fs.writeFileSync(outputPath, rendered);
  console.log(`Wrote ${path.relative(root, outputPath)} with ${records.length} products.`);
}

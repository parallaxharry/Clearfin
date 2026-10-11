const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function loader(globals = {}, overrides = {}) {
  const cache = new Map();
  function load(file) {
    let full = path.resolve(__dirname, "..", file);
    if (!fs.existsSync(full) && full.endsWith(".ts")) full += "x";
    if (cache.has(full)) return cache.get(full);
    const source = ts.transpileModule(fs.readFileSync(full, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const module = { exports: {} };
    cache.set(full, module.exports);
    vm.runInNewContext(source, {
      module, exports: module.exports, console, ...globals,
      require(name) {
        if (Object.hasOwn(overrides, name)) return overrides[name];
        if (name.startsWith(".")) return load(path.relative(path.resolve(__dirname, ".."), path.resolve(path.dirname(full), name + ".ts")));
        if (name.startsWith("@/")) return load("src/" + name.slice(2) + ".ts");
        return require(name);
      },
    }, { filename: file });
    return module.exports;
  }
  return load;
}
const load = loader();
const cards = load("src/lib/cards.ts");
const model = load("src/lib/rewardModel.ts");
const zero = { dining: 0, grocery: 0, gas: 0, travel: 0, other: 0 };
const base = (id) => cards.CARDS.find(c => c.id === id);
function info(overrides = {}) {
  return {
    name: null, issuer: null, img: null, badge: null, bankUrl: null, rewards: [],
    minIncome: null, minHouseholdIncome: null, creditMin: null,
    ...overrides,
  };
}
const calculation = (overrides = {}) => ({
  annualFee: 120,
  rates: { dining: 0.005, grocery: 0.02, gas: 0.01, travel: 0.005, other: 0.005 },
  reviewedAt: "2026-10-11T15:00:00Z", researchLevel: "issuer-page",
  ...overrides,
});

// Independent arithmetic: $12k groceries earns $240 less a $120 annual fee.
test("RBC correction gives $120 net in ranking, Compare scoring and category breakdown", () => {
  for (const map of [{}, { "rbc-cashback-world-elite": info({ calculation: calculation() }) }]) {
    const spend = { ...zero, grocery: 1000 };
    const ranked = model.rankCards(spend, map).find(c => c.id === "rbc-cashback-world-elite");
    const resolved = model.withCatalog(base(ranked.id), map);
    assert.equal(ranked.netValue, 120);
    assert.equal(cards.scoreCard(resolved, spend), 120);
    assert.equal(cards.getBreakdown(resolved, spend).gross, 240);
    assert.equal(resolved.annualFee, 120);
  }
});

test("reviewed database fee/rates propagate before scoring, without multiplying CPP again", () => {
  const map = { "rbc-avion": info({ calculation: calculation({ annualFee: 150, rates: { ...zero, travel: 0.0125 } }) }) };
  const spend = { ...zero, travel: 1000 };
  const ranked = model.rankCards(spend, map).find(c => c.id === "rbc-avion");
  assert.equal(ranked.netValue, 0); // $150 rewards - $150 fee
  assert.equal(cards.getBreakdown(ranked, spend).gross, 150);
});

test("unreviewed or invalid database math cannot overwrite known corrections; zero is valid", () => {
  for (const overrides of [{ reviewedAt: null }, { reviewedAt: "invalid" }, { researchLevel: null }]) {
    const resolved = model.withCatalog(base("rbc-avion"), { "rbc-avion": info({ calculation: calculation({ ...overrides, annualFee: 900 }) }) });
    assert.equal(resolved.annualFee, 120);
    assert.equal(resolved.rates.travel, 0.0125);
  }
  const resolved = model.withCatalog(base("rbc-avion"), { "rbc-avion": info({ calculation: calculation({ annualFee: -1, rates: { dining: NaN, grocery: -1, gas: Infinity, travel: 5, other: 0 } }) }) });
  assert.equal(resolved.annualFee, 120);
  assert.equal(resolved.rates.travel, 0.0125);
  assert.equal(resolved.rates.dining, 0.01);
  assert.equal(resolved.rates.other, 0);
});

test("direct-airline bonuses do not inflate the broad travel bucket", () => {
  for (const id of ["td-aeroplan", "cibc-aeroplan-infinite"]) {
    const card = model.withCatalog(base(id), {});
    assert.equal(cards.getBreakdown(card, { ...zero, travel: 1000 }).gross, 120);
  }
});

test("inactive cards and TD Emerald cannot enter rankings or Compare options", () => {
  const map = { cobalt: info({ isActive: false }) };
  for (const list of [model.getModelCards(map), model.rankCards(zero, map)]) {
    assert(!list.some(c => c.id === "cobalt" || c.id === "td-emerald"));
  }
});

test("personal or household thresholds qualify independently; estimated credit score is not a filter", () => {
  const eligibility = info({ minIncome: 60000, minHouseholdIncome: 100000, creditMin: 900 });
  assert(model.qualifiesByIncome(eligibility, 60000, 60000));
  assert(model.qualifiesByIncome(eligibility, 35000, 100000));
  assert(!model.qualifiesByIncome(eligibility, 59999, 99999));
  assert(model.qualifiesByIncome(info(), 0, 0));
});

test("saved old-model rankings are suppressed while all seven answers survive", () => {
  const values = new Map();
  const storage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v), removeItem: k => values.delete(k) };
  const localLoad = loader({ window: { localStorage: storage } });
  const saved = localLoad("src/lib/savedCardProfile.ts");
  const profile = { version: 1, spend: { ...zero, grocery: 1000 }, personalIncome: 60000, householdIncome: 100000, results: [{ id: "cobalt", netValue: 999 }], savedAt: new Date().toISOString() };
  saved.saveCardProfile(profile);
  assert.equal(saved.loadCardProfile().results.length, 0);
  assert.equal(saved.loadCardProfile().spend.grocery, 1000);
  assert.equal(saved.loadCardProfile().householdIncome, 100000);
  saved.saveCardProfile({ ...profile, rewardModelVersion: model.REWARD_MODEL_VERSION });
  assert.equal(saved.loadCardProfile().results[0].netValue, 999);
});

test("chat rankings use reviewed catalogue math and exclude unavailable cards", async () => {
  const map = { "rbc-cashback-world-elite": info({ calculation: calculation({ annualFee: 0, rates: { ...zero, grocery: 0.9 } }) }) };
  const chatLoad = loader({}, {
    "@/lib/cardDetail": { getCatalogDisplayMap: async () => map },
    "@/lib/chatContext": {},
  });
  const result = await chatLoad("src/lib/chatTools.ts").runChatTool("rank_cards", JSON.stringify({ grocery: 1000, limit: 1 }));
  assert.equal(result.results[0].id, "rbc-cashback-world-elite");
  assert.equal(result.results[0].net_annual_value, 10800);
});


test("Compare renders the corrected fee, rates and net value from shared inputs", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const map = Object.fromEntries(cards.CARDS.map(c => [c.id, info({ isActive: false })]));
  map["rbc-cashback-world-elite"] = info({ isActive: true, calculation: calculation() });
  map["td-aeroplan"] = info({ isActive: true });
  const renderLoad = loader({}, {
    "@/context/SpendContext": { useSpend: () => ({ spend: { ...zero, grocery: 1000 } }) },
    "@/context/CatalogContext": { useCatalog: () => map },
    "@/lib/metaPixel": { trackMetaAction() {} },
    "next/image": { __esModule: true, default: () => null },
    "next/link": { __esModule: true, default: ({ children, href }) => React.createElement("a", { href }, children) },
  });
  const Component = renderLoad("src/components/CompareSection.tsx").default;
  const html = renderToStaticMarkup(React.createElement(Component));
  const grid = html.slice(html.indexOf('class="cmp-grid"'));
  const rbcColumn = grid.slice(grid.indexOf("RBC Cash Back Preferred"), grid.indexOf("TD Aeroplan"));
  assert.match(rbcColumn, /Gross \$240/);
  assert.match(rbcColumn, /fee \$120/);
  assert.match(rbcColumn, /<strong>\$120<\/strong>/);
  assert.match(rbcColumn, /2%/);
});

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
function load(relativePath, overrides = {}) {
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, relativePath), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports, Date, Intl,
    require: (name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
  });
  return module.exports;
}
const money = load("src/lib/money.ts");
const cards = load("src/lib/cards.ts", { "./money": money });
const { createDefaultProfile, spendProfileReducer: reduce } = load("src/lib/spendProfile.ts", { "./cards": cards });
const { isOfferExpired } = load("src/lib/offerExpiry.ts");
const { resolveComparison, comparisonQuery, comparisonWinner } = load("src/lib/comparison.ts");

test("shared comparisons preserve slots and reject duplicate or unknown cards", () => {
  const ids = new Set(["a", "b", "c"]);
  const defaults = ["a", "b"];
  const cases = [[null, defaults], ["c,a", ["c", "a"]], ["a,a", ["a", null]],
    ["missing,b", [null, "b"]], [",b", [null, "b"]], ["a,", ["a", null]],
    ["", [null, null]], ["a,b,c", ["a", "b"]], [" a , b ", ["a", "b"]]];
  for (const [raw, expected] of cases) {
    const pair = resolveComparison(raw, defaults, ids);
    assert.equal(JSON.stringify(pair), JSON.stringify(expected));
    assert.equal(JSON.stringify(resolveComparison(comparisonQuery(pair), defaults, ids)), JSON.stringify(pair));
  }
});

test("comparison winner follows displayed estimates, slot swaps and ties", () => {
  assert.equal(comparisonWinner([540.12, 618]), 1);
  assert.equal(comparisonWinner([618, 540.12]), 0);
  assert.equal(comparisonWinner([468, 468]), "tie");
  assert.equal(comparisonWinner([100.1, 100.2]), "tie");
  assert.equal(comparisonWinner([-100, -20]), 1);
  assert.equal(comparisonWinner([null, 618]), null);
});

test("fees keep cents while estimates retain the established whole-dollar rounding", () => {
  for (const [value, exact, estimate] of [[119.88, "$119.88", "$120"], [191.88, "$191.88", "$192"],
    [12.5, "$12.50", "$13"], [120, "$120", "$120"], [0, "$0", "$0"]]) {
    assert.equal(money.formatCost(value), exact);
    assert.equal(money.formatEstimate(value), estimate);
  }
});

test("profile edits retain the other answers without mutating defaults", () => {
  const original = createDefaultProfile();
  let profile = reduce(original, { type: "spend", value: { ...original.spend, grocery: 1000 } });
  profile = reduce(profile, { type: "income", value: 150000 });
  profile = reduce(profile, { type: "credit", value: 820 });
  assert.equal(profile.spend.grocery, 1000);
  assert.equal(profile.income, 150000);
  assert.equal(profile.credit, 820);
  assert.equal(original.spend.grocery, 600);
  assert.equal(cards.DEFAULT_SPEND.grocery, 600);
});

test("Restart resets every field and every new session gets independent defaults", () => {
  const fresh = createDefaultProfile();
  const edited = { spend: { dining: 900, grocery: 1000, gas: 300, travel: 800, other: 2000 }, income: 150000, credit: 820 };
  const reset = reduce(edited, { type: "reset" });
  assert.equal(JSON.stringify(reset), JSON.stringify(fresh));
  assert.notEqual(reset.spend, fresh.spend);
  assert.notEqual(reset.spend, cards.DEFAULT_SPEND);
});

test("one shared profile provider lives in the persistent layout, not individual routes", () => {
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  assert.equal((read("src/app/layout.tsx").match(/<SpendProvider>/g) || []).length, 1);
  for (const file of ["src/app/page.tsx", "src/app/credit-card-calculator-canada/page.tsx", "src/app/compare-credit-cards-canada/page.tsx"]) {
    assert.doesNotMatch(read(file), /SpendProvider/);
  }
});

test("yesterday expires; today and tomorrow remain available", () => {
  const now = new Date("2026-09-06T16:00:00Z");
  assert.equal(isOfferExpired("2026-09-05", now), true);
  assert.equal(isOfferExpired("2026-09-06", now), false);
  assert.equal(isOfferExpired("2026-09-07", now), false);
  assert.equal(isOfferExpired("September 5, 2026", now), true);
  assert.equal(isOfferExpired("September 6, 2026", now), false);
});

test("date-only deadlines switch at Eastern midnight, in summer and winter", () => {
  assert.equal(isOfferExpired("2026-09-06", new Date("2026-09-07T03:59:59.999Z")), false);
  assert.equal(isOfferExpired("2026-09-06", new Date("2026-09-07T04:00:00Z")), true);
  assert.equal(isOfferExpired("2026-12-06", new Date("2026-12-07T04:59:59.999Z")), false);
  assert.equal(isOfferExpired("2026-12-06", new Date("2026-12-07T05:00:00Z")), true);
});

test("explicit timestamp deadlines preserve their exact timezone and instant", () => {
  const end = "2026-09-06T17:00:00-06:00";
  assert.equal(isOfferExpired(end, new Date("2026-09-06T22:59:59Z")), false);
  assert.equal(isOfferExpired(end, new Date("2026-09-06T23:00:00Z")), true);
  assert.equal(isOfferExpired("2026-09-06T23:00:00Z", new Date("2026-09-06T23:00:00Z")), true);
});

test("absent, invalid and ambiguous dates are not guessed", () => {
  const now = new Date("2026-09-06T16:00:00Z");
  for (const end of [null, undefined, "", "not a date", "2026-02-30", "03/04/2026", "2026-09-05T12:00:00"]) {
    assert.equal(isOfferExpired(end, now), false, String(end));
  }
});

test("default expiry uses the clock, not the former fixed audit date", () => {
  const yesterday = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  assert.equal(isOfferExpired(yesterday), true);
  assert.equal(isOfferExpired(tomorrow), false);
  const page = fs.readFileSync(path.join(root, "src/app/credit-cards/[id]/page.tsx"), "utf8");
  assert.doesNotMatch(page, /OFFER_AUDIT_TIMESTAMP/);
  assert.match(page, /isOfferExpired\(wb\?\.offer_end_date\)/);
  assert.match(page, /export const revalidate = 300/);
});

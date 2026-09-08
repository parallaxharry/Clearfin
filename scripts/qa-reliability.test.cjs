/* eslint-disable @typescript-eslint/no-require-imports, @next/next/no-assign-module-variable */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
function load(relativePath, overrides = {}, globals = {}) {
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, relativePath), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports, Date, Intl, ...globals,
    require: (name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
  });
  return module.exports;
}
const money = load("src/lib/money.ts");
const cards = load("src/lib/cards.ts", { "./money": money });
const reviews = load("src/lib/cardReviewData.ts", { "@/lib/cards": cards });
const { createDefaultProfile, spendProfileReducer: reduce } = load("src/lib/spendProfile.ts", { "./cards": cards });
const { isOfferExpired } = load("src/lib/offerExpiry.ts");
const { resolveComparison, comparisonQuery, comparisonWinner } = load("src/lib/comparison.ts");
const { classifyReward, filterCatalogue, DEFAULT_CATALOGUE_FILTERS } = load("src/lib/catalogueFilters.ts");
const { checkIncome, creditGuidance, nonNegativeNumber } = load("src/lib/eligibility.ts");

test("catalogue supplies household alternatives and aliases, with safe unavailable-data fallback", async () => {
  for(const mode of ["ok", "unconfigured", "error", "throws"]){
    let query="";
    const data=[{id:"Amex-cobalt",rewards:[],min_income_personal:60000,min_income_household:100000,credit_score:{estimated_credit_score_range:{min:700}}}];
    const module=load("src/lib/cardDetail.ts", {
      react:{cache:fn=>fn}, "@supabase/supabase-js":{createClient:()=>({from:()=>({select:async s=>{query=s;if(mode==="throws")throw Error("fixture");return mode==="error"?{data:null,error:{message:"fixture"}}:{data,error:null};}})})},
      "@/lib/cards":cards,"@/lib/cardReviewData":{CARD_REVIEW_ENRICHMENT:{}},"@/lib/catalogueFilters":{classifyReward},"@/lib/eligibility":{nonNegativeNumber},
    },{process:{env:mode==="unconfigured"?{}:{NEXT_PUBLIC_SUPABASE_URL:"https://example.invalid",NEXT_PUBLIC_SUPABASE_ANON_KEY:"fixture"}},console:{error(){}}});
    const map=await module.getCatalogDisplayMap();
    if(mode==="ok"){
      assert.equal(query,"*");assert.equal(map.cobalt.minIncomeHousehold,100000);
      assert.equal(map.cobalt,map["Amex-cobalt"]);assert.equal(checkIncome(map.cobalt,35000,100000).state,"matched");
    }else {
      assert(Object.keys(map).length>=cards.CARDS.length);
      assert.equal(map.cobalt.annualFee,191.88);
      assert.equal(map.cobalt.rates.grocery,0.05);
    }
  }
});

test("reward estimates apply shared caps, after-cap rates and conservative merchant assumptions", () => {
  const empty = { dining:0, grocery:0, gas:0, travel:0, other:0 };
  const card = id => cards.CARDS.find(item => item.id === id);

  const cobaltAt = cards.getBreakdown(card("cobalt"), {...empty,dining:1000,grocery:1500});
  const cobaltOver = cards.getBreakdown(card("cobalt"), {...empty,dining:1500,grocery:1500});
  assert.equal(cobaltAt.gross,1500);
  assert.equal(cobaltOver.gross,1560);
  assert(cobaltOver.assumptions.some(note=>note.includes("$2,500")));

  const preferredAt = cards.getBreakdown(card("amex-simply-cash-preferred"), {...empty,grocery:2000,gas:500});
  const preferredOver = cards.getBreakdown(card("amex-simply-cash-preferred"), {...empty,grocery:2500,gas:500});
  assert.equal(preferredAt.gross,1200);
  assert.equal(preferredOver.gross,1320);

  const bmoUnder = cards.getBreakdown(card("bmo-cashback"), {...empty,grocery:400});
  const bmoOver = cards.getBreakdown(card("bmo-cashback"), {...empty,grocery:600});
  assert.equal(bmoUnder.gross,144);
  assert.equal(bmoOver.gross,186);

  const mbna = cards.getBreakdown(card("mbna-smart-cash"), {...empty,grocery:400,gas:300});
  assert.equal(mbna.gross,132);

  const scotiaGeneric = cards.getBreakdown(card("scotia-gold"), {...empty,grocery:1000});
  const sceneGeneric = cards.getBreakdown(card("scene-plus-visa"), {...empty,grocery:1000});
  assert.equal(scotiaGeneric.gross,600);
  assert.equal(sceneGeneric.gross,120);
  assert(scotiaGeneric.assumptions.some(note=>note.includes("6x rate is limited")));
});

test("every local product has a recent traceable issuer review and stale offers fail closed", async () => {
  const now = new Date("2026-09-07T12:00:00Z");
  assert.equal(Object.keys(reviews.CARD_REVIEW_ENRICHMENT).length, cards.CARDS.length);
  for (const card of cards.CARDS) {
    const review = reviews.CARD_REVIEW_ENRICHMENT[card.id];
    assert(review, card.id);
    assert.match(review.sourceUrl, /^https:\/\//, card.id);
    assert.match(review.reviewedAt, /^2026-08-\d{2}$|^2026-09-07$/, card.id);
  }

  const module = load("src/lib/cardDetail.ts", {
    react:{cache:fn=>fn}, "@supabase/supabase-js":{createClient(){throw Error("unconfigured");}},
    "@/lib/cards":cards,"@/lib/cardReviewData":reviews,"@/lib/catalogueFilters":{classifyReward},"@/lib/eligibility":{nonNegativeNumber},
  },{process:{env:{}},console:{error(){}}});
  assert.equal(module.isProductReviewFresh("2026-08-06", now),true);
  assert.equal(module.isProductReviewFresh("2026-07-01", now),false);
  assert.equal(module.isProductReviewFresh("invalid", now),false);

  const map = await module.getCatalogDisplayMap();
  const list = await module.getCatalogOrderedCards();
  const listById = new Map(list.map(card => [card.id, card]));
  for (const card of cards.CARDS) {
    const detail = await module.getCard(card.id);
    assert.equal(map[card.id].annualFee, detail.annualFee, `${card.id} fee`);
    assert.deepEqual(map[card.id].rates, detail.rates, `${card.id} rates`);
    assert.equal(listById.get(card.id).annualFee, detail.annualFee, `${card.id} catalogue fee`);
    if (detail.welcomeBonus) {
      assert.match(detail.sourceUrl, /^https:\/\//, card.id);
      assert(module.isProductReviewFresh(detail.reviewedAt, now), card.id);
    }
  }
});

test("income checks distinguish unknown, explicit zero and personal/household alternatives", () => {
  const requirements = { minIncome: 60000, minIncomeHousehold: 100000, creditMin: 700 };
  assert.equal(checkIncome(requirements, 60000, null).state, "matched");
  assert.equal(checkIncome(requirements, 35000, 100000).state, "matched");
  assert.match(checkIncome(requirements, 35000, 100000).label, /household/);
  assert.equal(checkIncome(requirements, 35000, 99999).state, "below");
  assert.equal(checkIncome(requirements, 35000, null).state, "unknown");
  assert.equal(checkIncome(undefined, 200000, 250000).state, "unknown");
  assert.equal(checkIncome({minIncome:0,minIncomeHousehold:null}, 0, null).state, "matched");
  assert.equal(checkIncome({minIncome:null,minIncomeHousehold:100000}, 35000, 90000).state, "unknown");
  assert.equal(checkIncome({minIncome:60000,minIncomeHousehold:null}, 35000, 100000).state, "unknown");
  assert.equal(checkIncome(requirements, 35000, 20000).state, "unknown");
});
test("invalid requirement data is unknown and estimated scores remain guidance", () => {
  for (const value of [null, undefined, "60000", -1, NaN, Infinity]) assert.equal(nonNegativeNumber(value), null);
  assert.equal(checkIncome({minIncome:NaN,minIncomeHousehold:Infinity}, 0, null).state,"unknown");
  assert.match(creditGuidance({creditMin:800}, 720), /Below the estimated/);
  assert.match(creditGuidance({creditMin:700}, 720), /not an approval guarantee/);
  for(const minimum of [null, -1, 0, 299, 901, NaN, Infinity]) assert.equal(creditGuidance({creditMin:minimum},720), "Credit-score guidance unavailable");
});
test("optional household income persists across edits and clears on reset/new profile", () => {
  const original=createDefaultProfile();assert.equal(original.householdIncome,null);
  let p=reduce(original,{type:"householdIncome",value:125000});
  p=reduce(p,{type:"income",value:65000});p=reduce(p,{type:"credit",value:760});
  assert.equal(p.householdIncome,125000);assert.equal(original.householdIncome,null);
  assert.equal(reduce(p,{type:"reset"}).householdIncome,null);
  assert.equal(reduce(p,{type:"householdIncome",value:null}).householdIncome,null);
});

test("catalogue filters combine search, issuer, fee and rewards without changing source order", () => {
  const sample = [
    { name: "Zulu Cash Back", issuer: "Bank A", badge: "Everyday", annualFee: 0, rewardKind: "cashback" },
    { name: "Élite Points", issuer: "Bank B", badge: "Travel", annualFee: 119.88, rewardKind: "points" },
    { name: "Alpha", issuer: "Bank A", badge: "Basic", annualFee: null, rewardKind: "unknown" },
    { name: "Beta", issuer: "Bank B", badge: "Travel", annualFee: 12.5, rewardKind: "points" },
  ];
  const query = extra => filterCatalogue(sample, { ...DEFAULT_CATALOGUE_FILTERS, ...extra });
  assert.equal(query({ query: " ELITE travel ", issuer: "Bank B", fee: "paid", reward: "points" })[0].name, "Élite Points");
  assert.equal(query({ fee: "free" }).length, 1);
  assert.equal(query({ fee: "unknown" })[0].name, "Alpha");
  assert.equal(query({ reward: "unknown" })[0].name, "Alpha");
  assert.equal(query({ query: "absent" }).length, 0);
  assert.equal(query({ sort: "fee-asc" }).map(c => c.name).join(","), "Zulu Cash Back,Beta,Élite Points,Alpha");
  assert.equal(query({ sort: "fee-desc" }).map(c => c.name).join(","), "Élite Points,Beta,Zulu Cash Back,Alpha");
  assert.equal(query({ sort: "name" })[0].name, "Alpha");
  assert.equal(query({})[0].name, "Zulu Cash Back");
});

test("reward classifications use explicit programme wording and leave ambiguity unclassified", () => {
  assert.equal(classifyReward("Cash Back"), "cashback");
  assert.equal(classifyReward("Membership Rewards"), "points");
  assert.equal(classifyReward("Aeroplan"), "points");
  assert.equal(classifyReward(null, "5x points on dining"), "points");
  assert.equal(classifyReward(null, "Premium travel benefits"), "unknown");
  assert.equal(classifyReward("Unspecified", "Cash Back card"), "unknown");
});

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

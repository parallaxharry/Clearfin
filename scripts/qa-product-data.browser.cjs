/* eslint-disable @typescript-eslint/no-require-imports */
// Run against a local production build or a verified deployment; this test never submits a form.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.addInitScript(() => {
      localStorage.setItem("clearfin-analytics-consent", "denied");
      localStorage.setItem("clearfin-marketing-consent", "denied");
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    await page.goto(`${base}/compare-credit-cards-canada?compare=pc-world-elite,rogers-world-elite`);
    const columns = page.locator(".cmp-card-col");
    await assert.doesNotReject(() => columns.nth(1).waitFor());
    assert.equal(await columns.count(), 2);

    const pc = columns.filter({ hasText: "PC World Elite Mastercard" });
    const pcGrocery = pc.locator(".modal-bd-row").filter({ hasText: /^Groceries/ });
    assert.equal(await pcGrocery.locator(".modal-bd-rate").textContent(), "1%");
    await assert.doesNotReject(() => pc.getByText(/limited to participating Loblaw-banner stores/).waitFor());

    const rogers = columns.filter({ hasText: "Rogers Red World Elite Mastercard" });
    const rogersRates = await rogers.locator(".modal-bd-rate").allTextContents();
    assert.deepEqual(rogersRates, ["1.5%", "1.5%", "1.5%", "1.5%", "1.5%"]);
    await assert.doesNotReject(() => rogers.getByText(/assumes no qualifying Rogers/).first().waitFor());
    console.log("PASS CF-02: comparison uses conservative PC merchant and Rogers service assumptions.");

    await page.goto(`${base}/credit-cards/bmo-cashback-world-elite`);
    await assert.doesNotReject(() => page.getByText("$139", { exact: true }).first().waitFor());

    await page.goto(`${base}/credit-cards`);
    await page.getByLabel("Search cards").fill("BMO CashBack World Elite");
    const catalogueCard = page.locator(".catalog-card").filter({ hasText: "BMO CashBack World Elite Mastercard" });
    await assert.doesNotReject(() => catalogueCard.getByText("$139", { exact: true }).waitFor());

    await page.goto(`${base}/compare-credit-cards-canada?compare=bmo-cashback-world-elite,pc-world-elite`);
    const bmo = page.locator(".cmp-card-col").filter({ hasText: "BMO CashBack World Elite Mastercard" });
    await assert.doesNotReject(() => bmo.getByText(/fee \$139/).waitFor());
    const bmoGrocery = bmo.locator(".modal-bd-row").filter({ hasText: /^Groceries/ });
    assert.equal(await bmoGrocery.locator(".modal-bd-rate").textContent(), "5% → 1%");
    console.log("PASS CF-03/CF-26: detail, catalogue and comparison agree on the $139 fee; cap-aware rates are visible.");

    assert.deepEqual(pageErrors, []);
    console.log("PASS: product-data UI checks completed without writes or uncaught browser errors.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

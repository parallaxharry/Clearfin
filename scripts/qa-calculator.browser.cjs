// Run against a local production build or a verified deployment, never submit forms.
// PLAYWRIGHT_MODULE can point to a bundled Playwright installation.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    // Isolated test browser: optional tracking is declined, no profile stored here.
    await context.addInitScript(() => {
      localStorage.setItem("clearfin-analytics-consent", "denied");
      localStorage.setItem("clearfin-marketing-consent", "denied");
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    async function waitStep(step) {
      await page.waitForFunction((expected) => {
        const shell = document.querySelector(".step-shell.step-visible");
        return shell?.querySelector(".step-count-current")?.textContent === String(expected);
      }, step);
    }
    async function next(step) {
      await page.locator(".step-next").click();
      await waitStep(step);
    }
    async function start() {
      await page.getByRole("button", { name: "Build my card profile" }).click();
      await waitStep(1);
    }
    async function change(value) {
      await page.locator(".step-slider").fill(String(value));
      assert.equal(await page.locator(".step-slider").inputValue(), String(value));
    }
    async function nav(path) {
      await page.locator(`a[href="${path}"]:visible`).first().click();
      await page.waitForURL(`${base}${path}`);
    }

    await page.goto(`${base}/credit-card-calculator-canada`);
    await start();
    await change(900);
    await next(2);
    await change(1000);
    await page.locator(".step-back").click();
    await waitStep(1);
    assert.equal(await page.locator(".step-slider").inputValue(), "900");
    await next(2);
    assert.equal(await page.locator(".step-slider").inputValue(), "1000");
    console.log("PASS CF-09: Back/forward preserves unsaved-to-Next edits.");

    await nav("/compare-credit-cards-canada");
    const grocery = page.locator(".modal-bd-row").filter({ has: page.locator(".modal-bd-cat", { hasText: /^Groceries$/ }) });
    await grocery.first().waitFor();
    assert.deepEqual(await grocery.locator(".modal-bd-monthly").allTextContents(), ["$1,000", "$1,000"]);
    await nav("/credit-card-calculator-canada");
    await start();
    assert.equal(await page.locator(".step-slider").inputValue(), "900");
    await next(2);
    assert.equal(await page.locator(".step-slider").inputValue(), "1000");
    console.log("PASS CF-01: Calculator to Compare and back uses the same answers.");

    await next(3); await change(300);
    await next(4); await change(800);
    await next(5); await change(2000);
    await next(6); await change(150000);
    await next(7); await change(820);
    await page.locator(".step-next").click();
    await page.locator(".result-shell.result-visible").waitFor();
    await page.getByRole("button", { name: /Recalculate|Start over/ }).click();
    await waitStep(1);
    const defaults = [400, 600, 150, 300, 500, 60000, 720];
    for (let index = 0; index < defaults.length; index++) {
      assert.equal(await page.locator(".step-slider").inputValue(), String(defaults[index]));
      if (index < defaults.length - 1) await next(index + 2);
    }
    console.log("PASS CF-10: Restart resets all seven answers.");

    await page.reload();
    await start();
    await change(900);
    await page.reload();
    await start();
    assert.equal(await page.locator(".step-slider").inputValue(), "400");
    // Same-tick activations test the guard before disabled state has rendered.
    await page.locator(".step-next").evaluate((button) => { button.click(); button.click(); button.click(); });
    await waitStep(2);
    await page.locator(".step-next").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await waitStep(3);
    // Wait beyond the timer via a condition, ensuring no extra callback advanced again.
    await page.waitForTimeout(350);
    assert.equal(await page.locator(".step-count-current").textContent(), "3");

    // Abandon an active transition through client navigation, then revisit.
    await page.evaluate(() => {
      document.querySelector(".step-next").click();
      document.querySelector('a[href="/compare-credit-cards-canada"]').click();
    });
    await page.waitForURL(`${base}/compare-credit-cards-canada`);
    await nav("/credit-card-calculator-canada");
    await start();
    await page.waitForTimeout(350);
    assert.equal(await page.locator(".step-count-current").textContent(), "1");
    console.log("PASS CF-30: repeated activation advances once; abandoned transitions do not affect reentry.");
    assert.deepEqual(errors, []);
    console.log("PASS: defined refresh reset, no uncaught browser errors; no real form/API submissions.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });

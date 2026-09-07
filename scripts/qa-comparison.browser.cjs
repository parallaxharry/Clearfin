// Isolated browser regression checks; all backend write endpoints are mocked.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const route = "/compare-credit-cards-canada";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => {
      localStorage.setItem("clearfin-analytics-consent", "denied");
      localStorage.setItem("clearfin-marketing-consent", "denied");
      // Exercise copy without replacing the user's system clipboard.
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
        writeText: async (text) => { window.qaCopiedLink = text; },
      } });
    });
    await context.route("**/api/{waitlist,chat,track-click}", (r) => r.fulfill({ status: 200, body: "{}" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const pair = () => new URL(page.url()).searchParams.get("compare");
    const choose = async (slot, query) => {
      await page.getByRole("button", { name: new RegExp(`^${slot} card:`) }).click();
      const input = page.getByRole("combobox", { name: `Search ${slot.toLowerCase()} card by card or issuer` });
      await input.fill(query); await input.press("Enter");
    };
    const checkHeading = async () => {
      assert.equal(await page.locator("main").count(), 1);
      assert.equal(await page.locator("main h1").count(), 1);
    };

    for (const url of [route, "/credit-card-calculator-canada", "/blog/how-clearfin-helps"]) {
      const response = await page.goto(base + url);
      const html = await response.text();
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Server heading: ${url}`);
      await checkHeading();
    }
    await page.goto(`${base}${route}?compare=cobalt,nbc-world-elite`);
    await page.getByRole("button", { name: "First card: Amex Cobalt", exact: true }).waitFor();
    assert.match(await page.locator(".cmp-winner .card-modal-name").innerText(), /National Bank/);
    assert.match(await page.locator(".cmp-panel-value").first().innerText(), /fee \$191\.88/);
    await choose("First", "SimplyCash Preferred");
    await page.waitForURL(/compare=amex-simply-cash-preferred/);
    assert.equal(pair(), "amex-simply-cash-preferred,nbc-world-elite");
    assert.match(await page.locator(".cmp-panel-value").first().innerText(), /fee \$119\.88/);
    await page.reload();
    await page.getByRole("button", { name: "First card: Amex SimplyCash Preferred", exact: true }).waitFor();
    await page.goBack();
    await page.getByRole("button", { name: "First card: Amex Cobalt", exact: true }).waitFor();
    await page.goForward();
    await page.getByRole("button", { name: "First card: Amex SimplyCash Preferred", exact: true }).waitFor();
    await page.getByRole("button", { name: "Copy comparison link", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Comparison link copied." }).waitFor();
    const copied = await page.evaluate(() => window.qaCopiedLink);
    assert.deepEqual([...new URL(copied).searchParams.keys()], ["compare"]);
    const shared = await context.newPage();
    await shared.goto(copied);
    await shared.getByRole("button", { name: "First card: Amex SimplyCash Preferred", exact: true }).waitFor();
    await shared.close();
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error("Denied"); }; });
    await page.getByRole("button", { name: "Copy comparison link", exact: true }).click();
    assert.equal(await page.getByRole("textbox", { name: "Comparison link", exact: true }).inputValue(), copied);
    await page.getByRole("button", { name: "Clear first card: Amex SimplyCash Preferred" }).click();
    await page.getByRole("combobox", { name: "Search first card by card or issuer" }).press("Escape");
    await page.reload();
    await page.getByRole("button", { name: "First card: Search cards", exact: true }).waitFor();
    assert.equal(pair(), ",nbc-world-elite");
    assert.equal(await page.locator(".cmp-winner").count(), 0);
    assert.equal(await page.getByRole("button", { name: "Copy comparison link", exact: true }).isDisabled(), true);

    for (const value of ["cobalt,cobalt", "missing,cobalt", ","]) {
      await page.goto(`${base}${route}?compare=${value}`);
      await page.locator(".cmp-empty-col").first().waitFor();
      assert.equal(await page.locator(".cmp-winner").count(), 0);
    }
    await page.goto(`${base}${route}?compare=nbc-world-elite,cobalt`);
    await page.getByRole("button", { name: "First card: National Bank World Elite Mastercard", exact: true }).waitFor();
    assert.match(await page.locator(".cmp-winner .card-modal-name").innerText(), /National Bank/);
    await page.goto(`${base}${route}?compare=rogers-red,rogers-red-world`);
    await page.getByText("Same rounded estimate", { exact: true }).first().waitFor();
    assert.equal(await page.getByText("Same rounded estimate", { exact: true }).count(), 2);
    assert.equal(await page.locator(".cmp-winner").count(), 0);

    // Search must update an already-mounted comparison through the URL.
    await page.getByRole("button", { name: "Search", exact: true }).click();
    const search = page.getByRole("combobox", { name: "Search ClearFin" });
    await search.fill("cobalt");
    await page.getByRole("button", { name: "Add Amex Cobalt to comparison", exact: true }).click();
    await search.fill("SimplyCash Preferred");
    await page.getByRole("button", { name: "Add Amex SimplyCash Preferred to comparison", exact: true }).click();
    await page.getByRole("button", { name: "Compare side by side →", exact: true }).click();
    await page.getByRole("button", { name: "First card: Amex Cobalt", exact: true }).waitFor();
    assert.equal(pair(), "cobalt,amex-simply-cash-preferred");
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (process.env.QA_SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.QA_SCREENSHOT_DIR}/comparison-${width}.png`, animations: "disabled" });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}/credit-card-calculator-canada`);
    await page.getByRole("button", { name: "Build my card profile" }).click();
    await checkHeading();
    for (let step = 2; step <= 7; step++) {
      await page.locator(".step-next").click();
      await page.waitForFunction((n) => document.querySelector(".step-shell.step-visible .step-count-current")?.textContent === String(n), step);
    }
    await page.locator(".step-next").click();
    await page.locator(".result-card").first().waitFor(); await checkHeading();
    await page.goto(`${base}/credit-cards/amex-simply-cash-preferred`);
    assert.match(await page.locator("main").innerText(), /\$119\.88/);
    assert.deepEqual(errors, []);
    console.log("PASS: server/client headings, fee precision, comparison links/reload/history/clear/invalid IDs, clipboard fallback, winner/ties, same-page search and 390px/320px layouts.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });

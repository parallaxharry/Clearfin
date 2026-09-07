// Run against a local production build. All write endpoints are mocked below.
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => {
      localStorage.setItem("clearfin-analytics-consent", "denied");
      localStorage.setItem("clearfin-marketing-consent", "denied");
    });
    let waitlistCount = 0;
    // Mock before any page opens: tests never write production contact/chat data.
    await context.route("**/api/waitlist", (route) => {
      waitlistCount++;
      return route.fulfill({ status: waitlistCount === 1 ? 500 : 200, contentType: "application/json",
        body: JSON.stringify(waitlistCount === 1 ? { error: "Test service unavailable. Try again." } : { created: true }) });
    });
    await context.route("**/api/chat", (route) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Test assistant unavailable." }) }));
    await context.route("**/api/track-click", (route) => route.fulfill({ status: 200, body: "{}" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const focused = (locator) => locator.evaluate((el) => el === document.activeElement);
    async function checkDialog(dialog) {
      await dialog.waitFor();
      assert.equal(await dialog.evaluate((el) => el.matches(":modal")), true);
      assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true);
      const controls = dialog.locator("button:visible:not([disabled]), a[href]:visible, input:visible:not([disabled])");
      await controls.last().focus();
      await page.keyboard.press("Tab");
      assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true, "Tab remains inside modal");
      await controls.first().focus();
      await page.keyboard.press("Shift+Tab");
      assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true, "Shift+Tab remains inside modal");
      // Native modal must also prevent a script from focusing the page behind it.
      await page.locator(".nav-cta").evaluate((el) => el.focus());
      assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true, "Background is inert");
    }
    async function nextStep(expected) {
      await page.locator(".step-next").click();
      await page.waitForFunction((n) => document.querySelector(".step-shell.step-visible .step-count-current")?.textContent === String(n), expected);
    }

    await page.goto(`${base}/compare-credit-cards-canada`);
    const first = page.getByRole("button", { name: /^First card:/ });
    await first.focus(); await first.press("Enter");
    let input = page.getByRole("combobox", { name: "Search first card by card or issuer" });
    await input.waitFor(); assert.equal(await focused(input), true);
    await input.press("ArrowDown");
    let activeId = await input.getAttribute("aria-activedescendant");
    assert.equal(await page.locator(`[id="${activeId}"]`).getAttribute("aria-selected"), "true");
    await input.fill("Cobalt"); await input.press("Enter");
    await page.getByRole("button", { name: "First card: Amex Cobalt", exact: true }).waitFor();
    assert.equal(await focused(first), true);
    await first.press("Space");
    await input.waitFor(); await input.fill("zz-no-card-match"); await input.press("Enter");
    assert.equal(await input.isVisible(), true);
    assert.equal(await input.getAttribute("aria-activedescendant"), null);
    await input.press("Escape");
    assert.equal(await focused(first), true);
    await page.getByRole("button", { name: "Clear first card: Amex Cobalt" }).click();
    await input.waitFor(); assert.equal(await focused(input), true);
    await input.fill("Cobalt"); await input.press("Enter");
    await first.press("Enter"); await input.waitFor(); await input.press("Tab");
    await input.waitFor({ state: "detached" });
    assert.equal(await page.getByRole("button", { name: /^Second card:/ }).evaluate((el) => el === document.activeElement), true);
    console.log("PASS CF-06: keyboard open/search/select/clear/Escape/Tab; zero-result recovery.");

    const comparisonUrl = page.url();
    const searchTrigger = page.getByRole("button", { name: "Search", exact: true });
    await searchTrigger.click();
    let dialog = page.getByRole("dialog", { name: "Search ClearFin", exact: true });
    input = dialog.getByRole("combobox", { name: "Search ClearFin" });
    await input.waitFor(); assert.equal(await focused(input), true);
    await checkDialog(dialog);
    await input.fill("cobalt");
    await dialog.getByRole("button", { name: "Add Amex Cobalt to comparison", exact: true }).press("Enter");
    assert.equal(await dialog.isVisible(), true);
    assert.equal(await page.url(), comparisonUrl);
    assert.equal(await dialog.getByRole("button", { name: "Remove Amex Cobalt from comparison", exact: true }).getAttribute("aria-pressed"), "true");
    await dialog.getByRole("button", { name: "Remove Amex Cobalt", exact: true }).press("Enter");
    assert.equal(await dialog.isVisible(), true);
    await input.fill("card");
    for (let n = 0; n < 8; n++) await input.press("ArrowDown");
    activeId = await input.getAttribute("aria-activedescendant");
    assert.equal(await page.locator(`[id="${activeId}"]`).getAttribute("aria-selected"), "true");
    assert.equal(await page.locator(`[id="${activeId}"]`).evaluate((el) => {
      const row = el.getBoundingClientRect();
      const box = el.closest(".search-results").getBoundingClientRect();
      return row.top >= box.top - 1 && row.bottom <= box.bottom + 1;
    }), true, "Active result scrolls into view");
    await input.fill("zz-no-results"); await input.press("ArrowDown"); await input.press("Enter");
    assert.equal(await dialog.isVisible(), true);
    assert.equal(await input.getAttribute("aria-activedescendant"), null);
    await dialog.getByRole("button", { name: "Close search" }).press("Enter");
    await dialog.waitFor({ state: "detached" }); assert.equal(await focused(searchTrigger), true);
    // Enter in the input still opens the highlighted result.
    await searchTrigger.press("Enter");
    input = page.getByRole("combobox", { name: "Search ClearFin" });
    await input.fill("cobalt"); await input.press("Enter");
    await page.waitForURL(`${base}/credit-cards/cobalt`);
    console.log("PASS CF-15: nested Enter controls do not navigate; active results, scrolling and input Enter work.");

    await page.goto(`${base}/`);
    const pick = page.locator(".pick-card").first();
    await pick.focus(); await pick.press("Enter");
    dialog = page.locator("dialog.cf-modal-root");
    await checkDialog(dialog);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" }); assert.equal(await focused(pick), true);
    // Opening a second native modal must restore focus to the first on Escape.
    await pick.press("Enter");
    await page.keyboard.press("Control+k");
    const nested = page.getByRole("dialog", { name: "Search ClearFin", exact: true });
    await nested.waitFor(); await page.keyboard.press("Escape");
    await nested.waitFor({ state: "detached" });
    assert.equal(await page.locator("dialog.cf-modal-root").count(), 1);
    await page.keyboard.press("Escape");
    await page.locator("dialog.cf-modal-root").waitFor({ state: "detached" });
    assert.equal(await focused(pick), true);

    await page.goto(`${base}/credit-card-calculator-canada`);
    await page.getByRole("button", { name: "Build my card profile" }).click();
    const slider = page.getByRole("slider", { name: "How much do you spend eating out each month?" });
    assert.equal(await slider.getAttribute("aria-valuetext"), "$400 per month");
    for (let step = 2; step <= 7; step++) await nextStep(step);
    await page.locator(".step-next").click();
    const result = page.locator(".result-card").first();
    await result.waitFor(); await result.focus(); await result.press("Enter");
    dialog = page.locator("dialog.cf-modal-root"); await checkDialog(dialog);
    await dialog.getByRole("button", { name: "Close card details" }).click();
    await dialog.waitFor({ state: "detached" }); assert.equal(await focused(result), true);
    console.log("PASS CF-07: Search, Top Picks and calculator dialogs contain/restore focus and close; nested dialogs work.");

    await page.goto(`${base}/early-access`);
    const email = page.getByRole("textbox", { name: "Email address for early access" });
    await email.fill("qa@example.invalid");
    await page.getByRole("button", { name: "Get Early Access →", exact: true }).click();
    await page.getByRole("alert").filter({ hasText: "Test service unavailable" }).waitFor();
    assert.equal(await email.inputValue(), "qa@example.invalid");
    await page.getByRole("button", { name: "Get Early Access →", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "You're on the list" }).waitFor();
    await page.getByRole("button", { name: "Ask about credit cards", exact: true }).click();
    const question = page.getByRole("textbox", { name: "Your credit card question" });
    await question.fill("Test question"); await page.getByRole("button", { name: "Send", exact: true }).click();
    await page.getByRole("alert").filter({ hasText: "Test assistant unavailable" }).waitFor();
    console.log("PASS CF-08: calculator/comparison/chat/email names and form status/error announcements; mocked writes only.");

    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${base}/compare-credit-cards-canada`);
      await page.getByRole("button", { name: /^First card:/ }).click();
      input = page.getByRole("combobox", { name: "Search first card by card or issuer" });
      await input.fill("cobalt"); await input.press("Enter");
      await page.getByRole("button", { name: "Search", exact: true }).click();
      input = page.getByRole("combobox", { name: "Search ClearFin" });
      await input.fill("cobalt");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      const panel = await page.locator(".search-panel").boundingBox();
      assert(panel.x >= 0 && panel.x + panel.width <= width + 1);
      const resultLabel = await page.locator(".search-item-label").first().boundingBox();
      assert(resultLabel.width > 70 && resultLabel.height > 0, "Result name remains readable beside its actions");
      if (process.env.QA_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.QA_SCREENSHOT_DIR, `search-${width}.png`), animations: "disabled" });
      await page.keyboard.press("Escape");
      await page.goto(`${base}/`);
      await page.locator(".pick-card").first().click();
      const cardModal = await page.locator(".card-modal").boundingBox();
      assert(cardModal.x >= 0 && cardModal.x + cardModal.width <= width + 1);
      await page.keyboard.press("Escape");
    }
    assert.deepEqual(errors, []);
    console.log("PASS: 390px/320px layout checks and no uncaught errors. Not a physical-device or formal screen-reader audit.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });

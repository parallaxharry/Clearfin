const assert = require("node:assert/strict");
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
    await context.route("**/api/{waitlist,chat,track-click}", (r) => r.fulfill({ status: 200, body: "{}" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.locator("#hero .btn-primary").click();
    await page.waitForURL(/credit-card-calculator-canada\?start=1/);
    const slider = page.getByRole("slider", { name: "How much do you spend eating out each month?" });
    await slider.waitFor();
    assert.equal(await slider.evaluate((el) => el === document.activeElement), true);
    assert.equal(await page.locator(".step-count-current").innerText(), "1");
    await slider.press("ArrowRight");
    await page.goto(`${base}/credit-card-calculator-canada`);
    await page.getByRole("button", { name: "Build my card profile" }).waitFor();
    console.log("PASS CF-11: one click opens an editable, focused first question; ordinary entry retains introduction.");

    await page.goto(base);
    const deck = page.locator(".hero-card-carousel");
    const title = page.locator(".hero-carousel-copy strong");
    await page.waitForFunction(() => document.querySelector(".hero-card-carousel")?.getAttribute("data-rotating") === "true");
    const initial = await title.innerText();
    await page.waitForFunction((old) => document.querySelector(".hero-carousel-copy strong")?.textContent !== old, initial);
    await page.getByRole("button", { name: "Pause automatic rotation", exact: true }).click();
    await page.mouse.move(0, 0);
    assert.equal(await deck.getAttribute("data-rotating"), "false");
    const paused = await title.innerText();
    await page.waitForTimeout(4500); // Deliberately exceed one real rotation interval.
    assert.equal(await title.innerText(), paused);
    await page.getByRole("button", { name: "Next featured card" }).click();
    assert.notEqual(await title.innerText(), paused);
    await page.getByRole("link", { name: "Calculator", exact: true }).click();
    await page.getByRole("link", { name: "ClearFin home", exact: true }).first().click();
    await page.getByRole("button", { name: "Resume automatic rotation", exact: true }).waitFor();
    await page.getByRole("button", { name: "Resume automatic rotation", exact: true }).click();
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => document.querySelector(".hero-card-carousel")?.getAttribute("data-rotating") === "true");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".hero-card-carousel")?.getAttribute("data-rotating") === "false");
    await deck.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0);
    await page.waitForFunction(() => document.querySelector(".hero-card-carousel")?.getAttribute("data-rotating") === "true");
    // Simulate a visibility event to verify the timer is cancelled in hidden tabs.
    await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
    assert.equal(await deck.getAttribute("data-rotating"), "false");
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Automatic rotation off" }).waitFor();
    assert.equal(await deck.getAttribute("data-rotating"), "false");
    const reduced = await title.innerText();
    await page.getByRole("button", { name: "Next featured card" }).click();
    assert.notEqual(await title.innerText(), reduced);
    assert.equal(await page.locator(".hero-carousel-card.is-active").evaluate((el) => getComputedStyle(el).transitionDuration), "0s");
    if (process.env.QA_SCREENSHOT_DIR) await deck.screenshot({ path: `${process.env.QA_SCREENSHOT_DIR}/carousel-controls.png`, animations: "disabled" });
    console.log("PASS CF-17: actual auto-advance, pause stability, manual controls, navigation persistence, offscreen/hidden-tab/reduced-motion stops.");

    for (const width of [1440, 720, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}/compare-credit-cards-canada?compare=cobalt,nbc-world-elite`);
      await page.getByRole("button", { name: "First card: Amex Cobalt", exact: true }).waitFor();
      const result = await page.locator("#compare").evaluate((el) => {
        const cells = [...el.querySelectorAll(".modal-bd-row span,.modal-bd-head span")].filter((cell) => cell.textContent.trim());
        return {
          sizes: cells.map((cell) => Number.parseFloat(getComputedStyle(cell).fontSize)),
          clipped: cells.some((cell) => cell.scrollWidth > cell.clientWidth + 1 || cell.scrollHeight > cell.clientHeight + 1),
          overflow: document.documentElement.scrollWidth > innerWidth,
          headersFit: [...el.querySelectorAll(".cmp-panel-top")].every((panel) => {
            const bounds = panel.getBoundingClientRect();
            return [...panel.querySelectorAll(".card-modal-name,.card-modal-issuer,.cmp-card-spinner")].every((item) => {
              const rect = item.getBoundingClientRect();
              return rect.right <= bounds.right && rect.bottom <= bounds.bottom && rect.left >= bounds.left && rect.top >= bounds.top;
            });
          }),
        };
      });
      assert(result.sizes.every((size) => size >= 14), `Readable sizes at ${width}px`);
      assert.equal(result.clipped, false, `Cells fit at ${width}px`);
      assert.equal(result.overflow, false, `No horizontal overflow at ${width}px`);
      assert.equal(result.headersFit, true, `Full card names, issuers and artwork fit at ${width}px`);
      if (process.env.QA_SCREENSHOT_DIR && [1440, 320].includes(width)) await page.locator(".cmp-grid").screenshot({ path: `${process.env.QA_SCREENSHOT_DIR}/readable-comparison-${width}.png`, animations: "disabled" });
    }
    // 200% CSS zoom also exercises enlarged text/layout rather than pixel scaling alone.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => { document.documentElement.style.zoom = "2"; });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.evaluate(() => { document.documentElement.style.zoom = ""; });
    console.log("PASS CF-16: 14px+ comparison labels fit at desktop, 720px reflow, 390px/320px and 200% CSS zoom.");

    for (const mode of ["no-js", "observer-failure", "animation-failure", "reduced-motion"]) {
      const safe = await browser.newContext({ javaScriptEnabled: mode !== "no-js", reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference" });
      if (mode === "observer-failure") await safe.addInitScript(() => { window.IntersectionObserver = class { constructor() { throw new Error("Observer unavailable"); } }; });
      if (mode === "animation-failure") await safe.addInitScript(() => { Element.prototype.animate = () => { throw new Error("Animation unavailable"); }; });
      const fallback = await safe.newPage();
      await fallback.goto(base);
      await fallback.locator("h1.reveal").waitFor();
      const visible = await fallback.locator(".reveal").evaluateAll((elements) => elements.every((el) => getComputedStyle(el).opacity === "1" && getComputedStyle(el).visibility !== "hidden"));
      assert.equal(visible, true, `Content readable with ${mode}`);
      await safe.close();
    }
    assert.deepEqual(errors, []);
    console.log("PASS CF-18: reveal content remains visible without JS, with failed observers/animations and with reduced motion.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });

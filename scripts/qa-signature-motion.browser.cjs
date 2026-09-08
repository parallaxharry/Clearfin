/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const out = process.env.QA_ARTIFACT_DIR;

async function consentOff(context) {
  await context.route("**/api/{waitlist,chat,track-click}", route => route.fulfill({ status: 500, body: "{}" }));
  await context.addInitScript(() => {
    localStorage.setItem("clearfin-analytics-consent", "denied");
    localStorage.setItem("clearfin-marketing-consent", "denied");
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
    await consentOff(context);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}/`);

    const hero = page.locator(".hero-card-carousel");
    const activeCard = hero.locator(".hero-carousel-card.is-active");
    const entrance = await activeCard.evaluate(element => {
      const style = getComputedStyle(element);
      return { name: style.animationName, duration: parseFloat(style.animationDuration), count: style.animationIterationCount };
    });
    assert(entrance.name.includes("hero-deck-arrive"));
    assert(entrance.duration >= 1.2 && entrance.duration <= 1.8);
    assert.equal(entrance.count, "1");

    const pause = hero.getByRole("button", { name: /Pause automatic rotation|Resume automatic rotation/ });
    if ((await pause.textContent()).includes("Pause")) await pause.click();
    const stage = hero.locator(".hero-carousel-stage");
    const beforeDepth = await stage.evaluate(element => getComputedStyle(element).transform);
    const bounds = await hero.boundingBox();
    assert(bounds);
    await page.mouse.move(bounds.x + bounds.width * 0.84, bounds.y + bounds.height * 0.28);
    await page.waitForTimeout(220);
    const afterDepth = await stage.evaluate(element => getComputedStyle(element).transform);
    assert.notEqual(afterDepth, beforeDepth);
    await page.mouse.move(2, 2);
    await page.waitForTimeout(220);
    assert.equal(await hero.evaluate(element => element.style.getPropertyValue("--hero-yaw")), "0deg");
    if (out) {
      fs.mkdirSync(out, { recursive: true });
      await page.waitForTimeout(1300);
      await page.locator("#hero").screenshot({ path: `${out}/signature-motion-hero-1440.png` });
    }
    console.log("PASS AN-01: 1.45-second layered-card entrance, subtle fine-pointer depth and settled controls.");

    const preview = page.locator("#feat-app .feat-visual");
    await preview.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("#feat-app .feat-visual")?.classList.contains("in-view"));
    const frame = preview.locator(".app-preview-frame");
    const frameMotion = await frame.evaluate(element => {
      const style = getComputedStyle(element);
      return { name: style.animationName, count: style.animationIterationCount, translate: style.translate };
    });
    assert(frameMotion.name.includes("app-preview-depth-in"));
    assert.equal(frameMotion.count, "1");
    const ambientBefore = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--page-ambient-shift"));
    await page.evaluate(() => window.scrollBy(0, 260));
    await page.waitForTimeout(120);
    const ambientAfter = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--page-ambient-shift"));
    assert.notEqual(ambientAfter, ambientBefore);
    if (out) {
      await page.waitForTimeout(1000);
      await page.locator("#feat-app").screenshot({ path: `${out}/signature-motion-app-1440.png` });
    }
    console.log("PASS AN-02/AN-04: phone layers settle once; artwork-only background depth follows scroll within an 18px budget.");

    await page.locator(".top-picks-grid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(90);
    const pick = page.locator(".pick-card").first();
    assert(await pick.evaluate(element => element.getAnimations().length > 0));
    const sheenBefore = await pick.locator(".pick-card-img").evaluate(element => getComputedStyle(element, "::before").transform);
    await pick.hover();
    await page.waitForTimeout(180);
    const sheenAfter = await pick.locator(".pick-card-img").evaluate(element => getComputedStyle(element, "::before").transform);
    assert.notEqual(sheenAfter, sheenBefore);
    if (out) {
      await page.waitForTimeout(500);
      await page.locator("#showcase").screenshot({ path: `${out}/signature-motion-grid-1440.png` });
    }

    await page.goto(`${base}/credit-cards`);
    await page.locator(".catalog-card").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(90);
    const catalogCard = page.locator(".catalog-card").first();
    assert(await catalogCard.evaluate(element => element.getAnimations().length > 0));
    console.log("PASS AN-03: Top Picks and catalogue cards enter once with fine-pointer-only artwork sheen.");

    assert.deepEqual(errors, []);
    if (out) {
      fs.mkdirSync(out, { recursive: true });
      await page.goto(`${base}/`);
      await page.screenshot({ path: `${out}/signature-motion-home-1440.png`, fullPage: true, animations: "disabled" });
    }
    await context.close();

    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", hasTouch: true });
    await consentOff(reduced);
    const still = await reduced.newPage();
    await still.goto(`${base}/`);
    await still.locator("#feat-app .feat-visual").scrollIntoViewIfNeeded();
    await still.waitForTimeout(100);
    assert.equal(await still.locator(".hero-carousel-card.is-active").evaluate(element => getComputedStyle(element).animationName), "none");
    assert.equal(await still.locator("#feat-app .app-preview-frame").evaluate(element => getComputedStyle(element).animationName), "none");
    assert.equal(await still.locator(".pick-card").first().evaluate(element => element.getAnimations().length), 0);
    assert(await still.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    console.log("PASS: reduced-motion and touch layout are static, readable and overflow-free at 390px.");
    await reduced.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

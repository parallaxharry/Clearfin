const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";

(async () => {
 const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
 try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await context.addInitScript(() => { localStorage.setItem("clearfin-analytics-consent", "denied"); localStorage.setItem("clearfin-marketing-consent", "denied"); });
  await context.route("**/api/{waitlist,chat,track-click}", r => r.fulfill({ status: 500, body: "{}" }));
  const page = await context.newPage();
  const errors = []; page.on("pageerror", e => errors.push(e.message));
  await page.goto(base + "/credit-cards");
  const original = await page.locator(".catalog-card h3").allTextContents();
  assert(original.length > 100);
  const search = page.getByRole("searchbox", { name: "Search cards" });
  await search.fill("cobalt");
  assert.equal(await page.locator(".catalog-card").count(), 1);
  await page.getByLabel("Issuer", { exact: true }).selectOption({ label: "American Express" });
  await page.getByLabel("Annual fee", { exact: true }).selectOption("paid");
  await page.getByLabel("Reward type", { exact: true }).selectOption("points");
  assert.equal(await page.locator(".catalog-card").count(), 1);
  await page.getByLabel("Annual fee", { exact: true }).selectOption("free");
  await page.getByRole("heading", { name: "No matching cards" }).waitFor();
  await page.getByRole("button", { name: "Show all cards" }).press("Enter");
  assert.deepEqual(await page.locator(".catalog-card h3").allTextContents(), original);
  for (const sort of ["fee-asc", "fee-desc"]) {
   await page.getByLabel("Sort by").selectOption(sort);
   const fees = await page.locator(".catalog-card-copy > div strong").allTextContents();
   const numeric = fees.filter(v => v.startsWith("$")).map(v => Number(v.replace(/[$,]/g, "")));
   assert(numeric.every((v,i) => !i || (sort === "fee-asc" ? v >= numeric[i-1] : v <= numeric[i-1])));
  }
  await page.getByRole("button", { name: "Reset filters" }).click();
  await search.fill("zzzz-no-card");
  assert.equal(await page.locator(".catalog-card").count(), 0);
  await page.getByRole("button", { name: "Reset filters" }).click();
  for (const width of [1440,390,320]) {
   await page.setViewportSize({ width, height: 1000 });
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
   await search.fill("cobalt");
   assert.equal(await page.locator(".catalog-card").count(), 1);
   if (process.env.QA_SCREENSHOT_DIR && width === 320) await page.locator(".catalog-list").screenshot({ path: process.env.QA_SCREENSHOT_DIR + "/catalogue-mobile.png" });
   await page.getByRole("button", { name: "Reset filters" }).click();
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage(); await staticPage.goto(base + "/credit-cards");
  assert.equal(await staticPage.locator(".catalog-card").count(), original.length); await noJs.close();
  console.log("PASS CF-12: combined search/filters, exact-fee sorting, counts, keyboard reset/empty recovery, mobile and server-rendered full catalogue.");

  const routes = ["/best-credit-cards-canada", "/best-cashback-credit-cards-canada", "/best-travel-credit-cards-canada", "/best-grocery-credit-cards-canada", "/best-no-fee-credit-cards-canada", "/best-student-credit-cards-canada", "/credit-card-rewards-canada-guide", "/blog/best-credit-card-combination-canada", "/best-credit-card-sign-up-bonuses-and-welcome-offers-in-canada-august-2026", "/best-credit-cards-for-restaurants-and-dining-in-canada-2026", "/blog", "/about", "/contact", "/faq", "/privacy", "/disclosures"];
  routes.push("/blog/how-clearfin-helps", "/blog/how-credit-card-points-work-canada", "/best-credit-card-for-everyday-spending-in-canada-2026-picks");
  const footer = new Set();
  for (const route of routes) {
   const response = await page.goto(base + route); assert.equal(response.status(), 200, route);
   assert.equal(await page.locator("h1").count(), 1, route);
   for (const href of await page.locator("footer a").evaluateAll(es => es.map(e => e.getAttribute("href")))) if (href?.startsWith("/")) footer.add(href);
   const headings = await page.locator(".seo-content > h2").count();
   if (headings >= 2) {
    await page.waitForFunction(n => document.querySelectorAll(".seo-toc a").length === n, headings);
    const links = page.locator(".seo-toc a");
    for (let i = 0; i < await links.count(); i++) {
     const anchor = links.nth(i); const hash = await anchor.getAttribute("href");
     await anchor.press("Enter");
     await page.waitForFunction(hash => decodeURIComponent(location.hash) === hash && document.activeElement?.id === hash.slice(1), hash).catch(async error => { console.error(route, hash, await page.evaluate(() => ({ hash: location.hash, focus: document.activeElement?.id }))); throw error; });
    }
   }
   for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow: ${route} at ${width}`);
   }
   for (const wrap of await page.locator(".seo-table-wrap").all()) {
    assert.equal(await wrap.getAttribute("tabindex"), "0", route);
    await wrap.focus(); await wrap.press("ArrowRight");
    if (await wrap.evaluate(el => el.scrollWidth > el.clientWidth)) await page.waitForFunction(el => el.scrollLeft > 0, await wrap.elementHandle());
   }
  }
  for (const route of footer) assert.equal((await context.request.get(base + route)).status(), 200, `Footer ${route}`);
  await page.goto(base + "/contact");
  assert(await page.locator('a[href="mailto:info@clearfin.ca"]').count());
  await page.goto(base + "/faq");
  assert.equal(await page.locator(".info-section h2").count(), 12);
  assert.equal(await page.locator(".info-section p").count(), 12); // These FAQs are static, not hidden accordion controls.
  await page.goto(base + "/best-credit-cards-canada");
  await page.locator(".seo-toc a").first().waitFor();
  const hash = await page.locator(".seo-toc a").last().getAttribute("href");
  await page.goto(base + "/best-credit-cards-canada" + hash);
  await page.waitForFunction(hash => !!document.getElementById(hash.slice(1)), hash);
  await page.waitForFunction(hash => Math.abs(document.getElementById(hash.slice(1)).getBoundingClientRect().top - 110) < 8, hash);
  await page.locator('footer a[href="/best-student-credit-cards-canada"]').click();
  await page.waitForURL("**/best-student-credit-cards-canada");
  await page.waitForFunction(() => [...document.querySelectorAll(".seo-toc a")].every(a => document.getElementById(a.hash.slice(1))));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.documentElement.style.zoom = "2");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.evaluate(() => document.documentElement.style.zoom = "");
  if (process.env.QA_SCREENSHOT_DIR) await page.locator(".seo-table-wrap").first().screenshot({ path: process.env.QA_SCREENSHOT_DIR + "/article-table.png" });
  assert.deepEqual(errors, []);
  console.log(`PASS CF-32: ${routes.length} editorial/info routes, contents keyboard/deep-link/client navigation, table scrolling, FAQ/mail/footer links and zoom. Editorial accuracy requires separate owner review.`);
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

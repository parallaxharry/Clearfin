const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    // All submission responses below are in-browser fixtures. Never send real leads/questions.
    await context.route("**/api/{waitlist,chat,track-click}", r => r.fulfill({ status: 500, body: "{}" }));
    await context.addInitScript(() => {
      localStorage.setItem("clearfin-analytics-consent", "denied");
      localStorage.setItem("clearfin-marketing-consent", "denied");
      window.__qaMode = "error"; window.__qaRequests = [];
      const original = window.fetch;
      window.fetch = async (url, opts = {}) => {
        if (!["/api/waitlist", "/api/chat"].includes(String(url))) return original(url, opts);
        const mode = window.__qaMode;
        window.__qaRequests.push(JSON.parse(opts.body));
        if (mode === "offline") throw new TypeError("Failed to fetch");
        if (mode === "hang") return new Promise((_, reject) => opts.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError"))));
        if (mode === "stream-hang" || mode === "stream-fail" || mode === "stream-long") {
          let timer;
          const stream = new ReadableStream({ start(controller) {
            const send = text => controller.enqueue(new TextEncoder().encode(text));
            send("Partial answer ");
            if (mode === "stream-long") timer = setInterval(() => send("more "), 5000);
            if (mode === "stream-fail") setTimeout(() => controller.error(new Error("Disconnected")), 100);
            opts.signal.addEventListener("abort", () => { clearInterval(timer); controller.error(new DOMException("Aborted", "AbortError")); });
          } });
          return new Response(stream);
        }
        if (mode === "gate") return Response.json({ error: "Email needed" }, { status: 428 });
        if (mode === "limit") return Response.json({ error: "No questions left", reason: "limit_reached" }, { status: 429 });
        if (mode === "error") return Response.json({ error: "Temporary test failure" }, { status: 503 });
        if (mode === "bad-json") return new Response("Not JSON", { status: 200 });
        if (String(url) === "/api/waitlist") return Response.json({ created: mode !== "duplicate" });
        return new Response(mode === "empty" ? "" : "\x1EThinking\x1EFixture answer complete.");
      };
    });
    const page = await context.newPage();
    await page.clock.install();
    const mode = async value => page.evaluate(value => { window.__qaMode = value; }, value);
    for (const path of ["/", "/early-access"]) {
      await page.goto(base + path);
      const email = page.getByRole("textbox", { name: "Email address for early access" });
      await email.fill("reader@example.invalid");
      await page.getByRole("button", { name: "Get Early Access" }).click();
      await page.getByText("Temporary test failure", { exact: true }).waitFor();
      assert.equal(await email.inputValue(), "reader@example.invalid");
      for (const failure of ["offline", "bad-json"]) {
        await mode(failure); await page.getByRole("button", { name: "Try again" }).click();
        await page.getByRole("button", { name: "Try again" }).waitFor();
        assert.equal(await email.inputValue(), "reader@example.invalid");
      }
      await mode("hang"); await page.getByRole("button", { name: "Try again" }).click();
      await page.clock.fastForward(15001);
      await page.getByText(/This is taking too long/).waitFor();
      assert.equal(await email.inputValue(), "reader@example.invalid");
      await mode("duplicate"); await page.getByRole("button", { name: "Try again" }).click();
      await page.getByRole("button", { name: /You're on the list/ }).waitFor();
      assert.equal(await email.isDisabled(), true);
    }
    console.log("PASS CF-21: both waitlists preserve input on failure/timeout and recover with duplicate-safe success.");

    for (const scenario of ["offline", "error", "empty", "hang", "stream-hang", "stream-fail", "stream-long", "stop", "close"]) {
      await page.goto(base); await mode(scenario === "stop" || scenario === "close" ? "stream-hang" : scenario);
      await page.getByRole("button", { name: "Ask about credit cards" }).click();
      await page.getByRole("textbox", { name: "Your credit card question" }).fill("My saved test question?");
      await page.getByRole("button", { name: "Send", exact: true }).click();
      if (scenario === "hang" || scenario === "stream-hang") await page.clock.fastForward(20001);
      if (scenario === "stream-long") await page.clock.runFor(60001);
      if (scenario === "stream-fail") await page.clock.runFor(150);
      if (scenario === "stop") await page.getByRole("button", { name: "Stop response" }).click();
      if (scenario === "close") {
        await page.getByRole("button", { name: "Close", exact: true }).click();
        await page.getByRole("button", { name: "Ask about credit cards" }).click();
      }
      await page.getByRole("button", { name: "Retry question" }).waitFor();
      assert.equal(await page.locator(".cf-chat-thinking").count(), 0);
      assert.equal(await page.locator(".cf-chat-user").count(), 1);
      await mode("success"); await page.getByRole("button", { name: "Retry question" }).click();
      await page.getByText("Fixture answer complete.", { exact: true }).waitFor();
      assert.equal(await page.locator(".cf-chat-user").count(), 1, `No duplicate question on ${scenario} retry`);
      const requests = await page.evaluate(() => window.__qaRequests);
      assert.equal(requests.at(-1).messages.length, 1);
    }
    for (const scenario of ["gate", "limit"]) {
      await page.goto(base); await mode(scenario);
      await page.getByRole("button", { name: "Ask about credit cards" }).click();
      await page.getByRole("textbox", { name: "Your credit card question" }).fill("Gate test?");
      await page.getByRole("button", { name: "Send", exact: true }).click();
      await page.locator(scenario === "gate" ? ".cf-chat-gate" : ".cf-chat-limit").waitFor();
      assert.equal(await page.getByRole("button", { name: "Retry question" }).count(), 0);
      if (scenario === "gate") {
        await mode("success"); await page.getByRole("textbox", { name: "Your email address", exact: true }).fill("reader@example.invalid");
        await page.getByRole("button", { name: "Continue", exact: true }).click();
        await page.getByText("Fixture answer complete.", { exact: true }).waitFor();
        assert.equal(await page.locator(".cf-chat-user").count(), 1);
      }
    }
    console.log("PASS CF-22: offline/error/empty/slow/stalled/broken streams, total deadline, Stop, close/reopen and retry; email/allowance gates retained.");

    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(base); await mode("error");
    await page.getByRole("button", { name: "Ask about credit cards" }).click();
    await page.getByRole("textbox", { name: "Your credit card question" }).fill("Can I retry this saved question?");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await page.getByRole("button", { name: "Retry question" }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    if (process.env.QA_SCREENSHOT_DIR) await page.screenshot({ path: process.env.QA_SCREENSHOT_DIR + "/recovery-chat.png", fullPage: false });

    const response = await page.goto(base + "/qa-missing-page-20260907");
    assert.equal(response.status(), 404);
    await page.getByRole("heading", { name: "This page isn't here." }).waitFor();
    assert(await page.locator('meta[name="robots"][content*="noindex"]').count());
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    if (process.env.QA_SCREENSHOT_DIR) await page.screenshot({ path: process.env.QA_SCREENSHOT_DIR + "/recovery-404.png", fullPage: true });
    await page.getByRole("link", { name: "Open calculator" }).click();
    await page.getByRole("button", { name: "Build my card profile" }).waitFor();
    if (process.env.QA_ERROR_FIXTURE === "1") {
      assert(base.startsWith("http://127.0.0.1"), "Error injection is local only");
      await page.goto(base + "/qa-recovery-fixture");
      await page.getByRole("button", { name: "Trigger test error" }).click();
      await page.getByRole("heading", { name: "We couldn't load this page." }).waitFor();
      await page.evaluate(() => sessionStorage.removeItem("qa-fail"));
      await page.getByRole("button", { name: "Try again", exact: true }).click();
      await page.getByRole("heading", { name: "Recovery fixture ready" }).waitFor();
    }
    console.log("PASS CF-29: genuine noindex 404, useful links and mobile reflow; local error retry when fixture enabled.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

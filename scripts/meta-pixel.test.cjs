const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadModule(relativePath, globals = {}, overrides = {}) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports,
    require: (name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
    console, Event, URL, ...globals,
  }, { filename: relativePath });
  return module.exports;
}

function fixture({ analytics, marketing, hostname = "www.clearfin.ca", storageBlocked = false, writeBlocked = false } = {}) {
  const values = new Map();
  if (analytics) values.set("clearfin-analytics-consent", analytics);
  if (marketing) values.set("clearfin-marketing-consent", marketing);
  const listeners = new Map();
  const inserted = [];
  const cookies = [];
  const calls = [];
  const window = {
    location: { hostname, pathname: "/" },
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error("blocked"); return values.get(key) ?? null; },
      setItem(key, value) { if (storageBlocked || writeBlocked) throw Error("blocked"); values.set(key, value); },
    },
    gtag(...args) { calls.push(["google", ...args]); },
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    dispatchEvent(event) { for (const fn of listeners.get(event.type) ?? []) fn(event); },
  };
  const document = {
    createElement: () => ({ remove() {} }),
    head: { appendChild(element) { inserted.push(element); } },
    set cookie(value) { cookies.push(value); },
  };
  const globals = { window, document };
  const consent = loadModule("src/lib/trackingConsent.ts", globals);
  const pixel = loadModule("src/lib/metaPixel.ts", globals, { "./trackingConsent": consent });
  const unsubscribe = consent.subscribeToConsent(pixel.syncMetaPixel);
  return {
    window, consent, pixel, inserted, cookies, calls, values, unsubscribe,
    events() { return calls.filter((c) => c[0] === "trackSingle" || c[0] === "trackSingleCustom"); },
    finishLoading() {
      const fbq = window.fbq;
      calls.push(...fbq.queue);
      fbq.queue = [];
      fbq.callMethod = (...args) => calls.push(args);
      inserted.at(-1).onload();
    },
  };
}

test("first-time, declined, and legacy analytics-only visitors never load Meta", () => {
  for (const opts of [{}, { marketing: "denied" }, { analytics: "granted" }]) {
    const f = fixture(opts);
    f.pixel.syncMetaPixel();
    f.pixel.trackMetaAction("Lead");
    assert.equal(f.inserted.length, 0);
    assert.equal(f.events().length, 0);
    assert.equal(f.window.fbq, undefined);
  }
});

test("consent loads the supplied Pixel once; each route gets one PageView", () => {
  const f = fixture();
  f.consent.saveConsent("denied", "granted");
  assert.equal(f.inserted.length, 1);
  assert.equal(f.inserted[0].src, "https://connect.facebook.net/en_US/fbevents.js");
  assert.equal(f.window.fbq.disablePushState, true);
  f.finishLoading();
  f.pixel.syncMetaPixel();
  f.pixel.syncMetaPixel();
  assert.equal(f.events().length, 1);
  assert.deepEqual(Array.from(f.events()[0]), ["trackSingle", "1620418306380365", "PageView"]);
  assert(f.calls.some(c => c[0] === "set" && c[1] === "autoConfig" && c[2] === false));
  assert.equal(f.calls.filter(c => c[0] === "init").length, 1);
  f.window.location.pathname = "/credit-cards/cobalt";
  f.pixel.syncMetaPixel();
  assert.deepEqual(f.events().map(c => c[2]), ["PageView", "PageView", "ViewContent"]);
  f.window.location.pathname = "/";
  f.pixel.syncMetaPixel();
  assert.equal(f.events().filter(c => c[2] === "PageView").length, 3);
  assert.equal(f.inserted.length, 1);
});

test("revoking consent during download prevents late events and replay", () => {
  const f = fixture({ marketing: "granted" });
  f.pixel.syncMetaPixel();
  f.pixel.trackMetaAction("Lead");
  f.consent.saveConsent("granted", "denied");
  f.finishLoading();
  assert.equal(f.events().length, 0);
  f.consent.saveConsent("granted", "granted");
  assert.deepEqual(f.events().map(c => c[2]), ["PageView"]);
  assert.equal(f.inserted.length, 1);
});

test("revocation removes Meta cookies and blocks subsequent actions and routes", () => {
  const f = fixture({ marketing: "granted" });
  f.pixel.syncMetaPixel();
  f.finishLoading();
  f.pixel.trackMetaAction("ApplyClick");
  f.consent.saveConsent("granted", "denied");
  const count = f.events().length;
  f.pixel.trackMetaAction("CalculatorCompleted");
  f.window.location.pathname = "/early-access";
  f.pixel.syncMetaPixel();
  assert.equal(f.events().length, count);
  assert(f.cookies.some(c => c.startsWith("_fbp=; Max-Age=0")));
  assert(f.cookies.some(c => c.startsWith("_fbc=; Max-Age=0")));
  assert(f.calls.some(c => c[0] === "consent" && c[1] === "revoke"));
});

test("consent changes in another tab are honored immediately", () => {
  const f = fixture({ marketing: "granted" });
  f.pixel.syncMetaPixel();
  f.finishLoading();
  f.values.set("clearfin-marketing-consent", "denied");
  f.window.dispatchEvent({ type: "storage", key: "clearfin-marketing-consent" });
  f.pixel.trackMetaAction("Lead");
  assert.equal(f.events().length, 1);
  f.unsubscribe();
});

test("storage failures do not break the consent choice", () => {
  for (const opts of [{ storageBlocked: true }, { writeBlocked: true }]) {
    const f = fixture(opts);
    f.pixel.syncMetaPixel();
    assert.equal(f.inserted.length, 0);
    f.consent.saveConsent("denied", "granted");
    f.finishLoading();
    assert.equal(f.events().length, 1);
    f.consent.saveConsent("denied", "denied");
    f.pixel.trackMetaAction("Lead");
    assert.equal(f.events().length, 1);
  }
});

test("preview and local hosts cannot pollute the production dataset", () => {
  for (const hostname of ["localhost", "clearfin-preview.vercel.app", "clearfin.ca.example.com"]) {
    const f = fixture({ marketing: "granted", hostname });
    f.pixel.syncMetaPixel();
    assert.equal(f.inserted.length, 0);
  }
});

test("blocked SDK does not queue conversion events; all action payloads omit user inputs", () => {
  const f = fixture({ marketing: "granted" });
  f.pixel.syncMetaPixel();
  f.inserted[0].onerror();
  f.pixel.trackMetaAction("Lead");
  assert.equal(f.events().length, 0);
  f.pixel.syncMetaPixel();
  f.finishLoading();
  for (const event of ["Lead", "ApplyClick", "CalculatorCompleted", "CardComparison"]) {
    f.pixel.trackMetaAction(event);
  }
  assert(f.events().every(c => c.length === 3));
});

test("waitlist distinguishes a new lead from duplicate, failed, and invalid submissions", async () => {
  for (const [error, expectedStatus, created] of [
    [null, 200, true], [{ code: "23505" }, 200, false], [{ code: "XX000" }, 500, undefined],
  ]) {
    const route = loadModule("src/app/api/waitlist/route.ts", {
      process: { env: { NEXT_PUBLIC_SUPABASE_URL: "https://test.invalid", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test" } },
      console: { error() {} },
    }, {
      "next/server": { NextResponse: { json: (body, opts) => ({ body, status: opts.status }) } },
      "@supabase/supabase-js": { createClient: () => ({ from: () => ({ insert: async () => ({ error }) }) }) },
    });
    const result = await route.POST({ json: async () => ({ email: "test@example.invalid" }) });
    assert.equal(result.status, expectedStatus);
    assert.equal(result.body.created, created);
    const invalid = await route.POST({ json: async () => ({ email: "invalid" }) });
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.created, undefined);
  }
});

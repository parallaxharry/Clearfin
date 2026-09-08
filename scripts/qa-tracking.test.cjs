const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

function load(file, globals = {}, overrides = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, console, Event, CustomEvent,
    AbortController, URL, setTimeout, clearTimeout, ...globals,
    require: name => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
  });
  return module.exports;
}
const id = "G-7E7SRWHXL4";

function googleFixture({ choice = null, host = "www.clearfin.ca", blocked = false } = {}) {
  const storage = new Map(choice ? [["clearfin-analytics-consent", choice]] : []);
  const listeners = new Map(), inserted = [], cookieWrites = [], diagnostics = [];
  const window = { location: { hostname: host, href: `https://${host}/?private=not-for-tracking#answer` },
    localStorage: { getItem: k => { if (blocked) throw Error(); return storage.get(k) ?? null; }, setItem: (k,v) => { if (blocked) throw Error(); storage.set(k,v); } },
    addEventListener: (k,f) => { if (!listeners.has(k)) listeners.set(k,new Set()); listeners.get(k).add(f); },
    removeEventListener: (k,f) => listeners.get(k)?.delete(f),
    dispatchEvent: e => { for (const f of listeners.get(e.type) ?? []) f(e); },
  };
  const document = { title: "ClearFin", referrer: "https://example.ca/?private=secret", get cookie() { return "_ga=test; _ga_7E7SRWHXL4=test; necessary=keep"; }, set cookie(v) { cookieWrites.push(v); },
    createElement: () => ({ remove() {} }), head: { appendChild: el => inserted.push(el) } };
  const consent = load("src/lib/trackingConsent.ts", {window,document});
  const google = load("src/lib/googleAnalytics.ts", {window,document}, {
    "./trackingConsent": consent, "./trackingDiagnostics": {reportTrackingFailure: (...args) => diagnostics.push(args)},
  });
  const sync = () => google.syncGoogleAnalytics(id);
  consent.subscribeToConsent(sync);
  return {window, consent, inserted, cookieWrites, diagnostics, storage, sync,
    configs: () => (window.dataLayer ?? []).map(a=>Array.from(a)).filter(a=>a[0]==="config")};
}

test("Google is blocked for unknown/denied and nonproduction hosts", () => {
  for (const opts of [{}, {choice:"denied"}, {choice:"granted",host:"localhost"}, {choice:"granted",host:"preview.vercel.app"}]) {
    const f=googleFixture(opts);f.sync();assert.equal(f.inserted.length,0);assert.equal(f.window[`ga-disable-${id}`],true);
  }
});
test("Google grant loads once; repeated preferences do not duplicate config", () => {
  const f=googleFixture();f.sync();f.consent.saveConsent("granted","denied");f.sync();
  assert.equal(f.inserted.length,1);assert.equal(f.configs().length,0);
  f.inserted[0].onload();f.sync();f.consent.saveConsent("granted","granted");
  assert.equal(f.configs().length,1);assert.equal(f.configs()[0][1],id);
  assert.equal(f.configs()[0][2].allow_google_signals,false);
  const defaults=Array.from(f.window.dataLayer[0]);assert.equal(defaults[2].ad_storage,"denied");
});
test("Google handles revoke during load, regrant, cross-tab changes and cookie removal", () => {
  const f=googleFixture({choice:"granted"});f.sync();f.consent.saveConsent("denied","granted");f.inserted[0].onload();
  assert.equal(f.configs().length,0);assert.equal(f.window[`ga-disable-${id}`],true);
  f.consent.saveConsent("granted","denied");assert.equal(f.configs().length,1);
  f.storage.set("clearfin-analytics-consent","denied");f.window.dispatchEvent({type:"storage",key:"clearfin-analytics-consent"});
  assert.equal(f.window[`ga-disable-${id}`],true);assert(f.cookieWrites.some(v=>v.startsWith("_ga=;")));
  assert(!f.cookieWrites.some(v=>v.startsWith("necessary=")));
});
test("Google manually tracks each pathname once and strips URL query/hash data", () => {
  const f=googleFixture({choice:"granted"});f.sync();f.inserted[0].onload();f.sync();
  f.window.location.href="https://www.clearfin.ca/credit-cards?income=185000";f.sync();f.sync();
  f.window.location.href="https://www.clearfin.ca/credit-cards?income=200000";f.sync();
  const events=f.window.dataLayer.map(a=>Array.from(a)).filter(a=>a[0]==="event");
  assert.equal(events.length,2);assert.equal(events[1][2].page_location,"https://www.clearfin.ca/credit-cards");
  assert.equal(events[1][2].page_referrer,"https://www.clearfin.ca/");
  assert.equal(f.configs()[0][2].send_page_view,false);
  assert(!JSON.stringify(f.window.dataLayer).includes("private"));assert(!JSON.stringify(f.window.dataLayer).includes("185000"));
});
test("Google storage denial uses visit consent; blocked SDK yields fixed diagnostic and explicit retry", () => {
  const f=googleFixture({blocked:true});f.sync();f.consent.saveConsent("granted","denied");
  f.inserted[0].onerror();assert.deepEqual(f.diagnostics,[["google","load_failed"]]);
  assert.equal(f.configs().length,0);f.sync();assert.equal(f.inserted.length,2);f.inserted[1].onload();assert.equal(f.configs().length,1);
});
test("Google retains bounded campaign labels, not arbitrary queries or email-shaped labels", () => {
  const f=googleFixture({choice:"granted"});
  f.window.location.href="https://www.clearfin.ca/?utm_source=facebook&utm_medium=paid_social&utm_campaign=fall-2026&utm_term=person%40example.ca&income=185000";
  f.sync();f.inserted[0].onload();const config=f.configs()[0][2];
  assert.equal(config.campaign_source,"facebook");assert.equal(config.campaign_name,"fall-2026");assert.equal(config.campaign_term,undefined);
  assert(!JSON.stringify(f.window.dataLayer).includes("185000"));assert(!JSON.stringify(f.window.dataLayer).includes("person@example.ca"));
});

function clickRoute({configured=true, fail=false, throws=false}={}) {
  const inserts=[],logs=[];
  const route=load("src/app/api/track-click/route.ts", {
    process:{env:configured?{NEXT_PUBLIC_SUPABASE_URL:"https://example.invalid",SUPABASE_SERVICE_ROLE_KEY:"secret-fixture"}:{}},
    console:{error: (...a)=>logs.push(a)},
  }, {
    "next/server": {NextResponse:{json:(body,opts)=>({body,status:opts.status})}},
    "@supabase/supabase-js": {createClient:()=>({from:()=>({insert:async value=>{inserts.push(value);if(throws)throw Error("private payload");return {error:fail?{message:"private payload"}:null};}})})},
  });
  const request=(raw,consent="granted")=>new Request("https://example.invalid/api/track-click", {method:"POST",headers:{"x-clearfin-analytics-consent":consent},body:raw});
  return {route,inserts,logs,request};
}
test("click API rejects missing consent, malformed/unbounded payloads and extra private fields before storage", async()=>{
  const f=clickRoute();
  assert.equal((await f.route.POST(f.request('{"cardId":"cobalt"}',"denied"))).status,403);
  for(const body of ["{", "null","[]","1",'{}','{"cardId":1}','{"cardId":""}','{"cardId":"person@example.ca"}','{"cardId":"cobalt","income":60000}',JSON.stringify({cardId:"x".repeat(101)})]){
    assert.equal((await f.route.POST(f.request(body))).status,400);
  }
  assert.equal((await f.route.POST(f.request("x".repeat(1025)))).status,413);
  assert.equal(f.inserts.length,0);
});
test("click API reports configuration/storage/exception failures honestly without raw error data", async()=>{
  for(const [options,status] of [[{configured:false},503],[{fail:true},500],[{throws:true},500],[{},200]]){
    const f=clickRoute(options);const r=await f.route.POST(f.request('{"cardId":"Amex-cobalt"}'));
    assert.equal(r.status,status);assert.equal(r.body.ok,status===200);
    assert(!JSON.stringify(f.logs).includes("private payload"));assert(!JSON.stringify(f.logs).includes("secret-fixture"));
    if(status===200)assert.equal(JSON.stringify(f.inserts),JSON.stringify([{card_id:"Amex-cobalt"}]));
  }
});
test("apply measurement has independent consent, one minimal keepalive request and safe failure diagnostics", async()=>{
  for(const [choice,reply] of [["denied","ok"],["granted","ok"],["granted","http"],["granted","malformed"],["granted","network"]]){
    const calls=[],meta=[],diagnostics=[];
    const api=load("src/lib/trackApplyClick.ts",{fetch:async(...args)=>{calls.push(args);if(reply==="network")throw Error("private");return {ok:reply!=="http",json:async()=>reply==="malformed"?null:{ok:true}};}},{
      "./trackingConsent":{ANALYTICS_CONSENT_KEY:"analytics",readConsent:()=>choice},
      "./metaPixel":{trackMetaAction:event=>meta.push(event)},
      "./trackingDiagnostics":{reportTrackingFailure:(...a)=>diagnostics.push(a)},
    });
    api.trackApplyClick("cobalt");await new Promise(r=>setTimeout(r,0));
    assert.deepEqual(meta,["ApplyClick"]);assert.equal(calls.length,choice==="granted"?1:0);
    if(calls.length){const opts=calls[0][1];assert.equal(opts.body,'{"cardId":"cobalt"}');assert.equal(opts.credentials,"omit");assert.equal(opts.referrerPolicy,"no-referrer");assert.equal(opts.keepalive,true);}
    assert.equal(diagnostics.length,choice==="granted"&&reply!=="ok"?1:0);
  }
});

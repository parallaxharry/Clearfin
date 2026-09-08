// Uses real provider SDKs but intercepts measurement and all write endpoints.
// Local QA proxies production-host GETs to the local build: no production override in app code.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const origin = "https://www.clearfin.ca";

(async () => {
 const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER_CHANNEL});
 try {
  async function fixture(analytics,marketing,{blockSdk=false}={}) {
   const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce",
    userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36"});
   const network=[], clicks=[], errors=[], diagnostics=[];
   let closing=false;
   await context.addInitScript(({analytics,marketing})=>{
    if(analytics!==null)localStorage.setItem("clearfin-analytics-consent",analytics);
    if(marketing!==null)localStorage.setItem("clearfin-marketing-consent",marketing);
    window.addEventListener("clearfin-tracking-diagnostic",e=>{window.__diagnostics=window.__diagnostics||[];window.__diagnostics.push(e.detail);});
   },{analytics,marketing});
   await context.route("**/*",async route=>{
    const req=route.request(),url=new URL(req.url());
    if(url.hostname==="www.clearfin.ca"){
     if(req.method()!=="GET"){
      if(url.pathname==="/api/track-click")clicks.push({body:req.postData(),headers:req.headers()});
      return route.fulfill({status:503,contentType:"application/json",body:'{"ok":false}'});
     }
     if(base!==origin){
      try { const response=await route.fetch({url:base+url.pathname+url.search});return await route.fulfill({response}); }
      catch(error){if(!closing)throw error;return;}
     }
     return route.continue();
    }
    if(url.hostname==="www.googletagmanager.com"||url.hostname==="connect.facebook.net"){
     network.push({kind:"sdk",url:req.url()});
     return blockSdk?route.abort():route.continue();
    }
    if(/(^|\.)(google-analytics\.com|facebook\.com|doubleclick\.net|google\.com|googlesyndication\.com)$/.test(url.hostname)){
     network.push({kind:"measurement",url:req.url(),body:req.postData()});
     return route.fulfill({status:204});
    }
    // Outbound applications are replaced with an inert fixture before any request.
    if(req.isNavigationRequest())return route.fulfill({status:200,contentType:"text/html",body:"<h1>Application destination intercepted for QA</h1>"});
    return route.continue();
   });
   const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
   if(process.env.QA_ONLY_META)page.on("console",msg=>{if(msg.type()==="warning"||msg.type()==="error")console.log("SDK diagnostic:",msg.text().slice(0,300));});
   const ga=()=>network.filter(r=>r.kind==="measurement"&&r.url.includes("google-analytics.com"))
    .flatMap(r=>(r.body||"").split("\n").map(body=>new URLSearchParams(new URL(r.url).search+"&"+body)))
    .filter(p=>p.get("en")==="page_view");
   const meta=event=>network.filter(r=>r.kind==="measurement"&&r.url.includes("facebook.com")&&new URLSearchParams(new URL(r.url).search+"&"+(r.body||"")).get("ev")===event);
   async function settle(){await page.waitForTimeout(1800);}
   async function nav(path){await page.locator(`a[href="${path}"]:visible`).first().click();await page.waitForURL(origin+path);await settle();}
   async function choices(a,m){await page.evaluate(()=>window.dispatchEvent(new Event("clearfin-open-consent")));await page.getByLabel("Analytics (Google)",{exact:true}).setChecked(a);await page.getByLabel("Advertising (Meta)",{exact:true}).setChecked(m);await page.getByRole("button",{name:"Save choices",exact:true}).click();await settle();}
   const close=async()=>{closing=true;await context.close();};
   return {context,page,network,clicks,errors,diagnostics,ga,meta,settle,nav,choices,close};
  }
  for(const [a,m] of (process.env.QA_ONLY_META ? [["denied","granted"]] : [["denied","denied"],["granted","denied"],["denied","granted"],["granted","granted"]])){
   const f=await fixture(a,m);await f.page.goto(origin+"/",{waitUntil:"networkidle"});await f.settle();
   await f.nav("/compare-credit-cards-canada");
   assert.equal(f.network.filter(r=>r.kind==="sdk"&&r.url.includes("googletagmanager.com/gtag/js")).length,a==="granted"?1:0);
   assert.equal(f.network.filter(r=>r.kind==="sdk"&&r.url.includes("fbevents.js")).length,m==="granted"?1:0);
   if(a==="granted")assert.equal(f.ga().length,2,"GA must emit exactly one view for home and one for SPA navigation");else assert.equal(f.ga().length,0);
   if(m==="granted"&&f.meta("PageView").length!==2)console.log("Meta diagnostic",await f.page.evaluate(()=>({sdk:typeof window.fbq?.callMethod,queue:window.fbq?.queue?.map(a=>a.slice(0,3)),diagnostics:window.__diagnostics})),f.network.filter(r=>r.kind==="sdk").map(r=>new URL(r.url).pathname));
   assert.equal(f.meta("PageView").length,m==="granted"?2:0,"Meta views; observed event names: "+JSON.stringify(f.network.filter(r=>r.kind==="measurement").map(r=>({host:new URL(r.url).hostname,event:new URLSearchParams(new URL(r.url).search+"&"+(r.body||"")).get("ev")}))));
   // One visible Apply action, no real destination reached and no real click stored.
   const popup=f.page.waitForEvent("popup");await f.page.locator(".cmp-apply").first().click();await (await popup).close();await f.settle();
   assert.equal(f.clicks.length,a==="granted"?1:0);assert.equal(f.meta("ApplyClick").length,m==="granted"?1:0);
   if(f.clicks.length){assert.deepEqual(Object.keys(JSON.parse(f.clicks[0].body)),["cardId"]);assert.equal(f.clicks[0].headers["x-clearfin-analytics-consent"],"granted");assert.equal(f.clicks[0].headers.referer,undefined);}
   if(a==="granted"&&m==="granted"){
    const apply=async selector=>{const popup=f.page.waitForEvent("popup");await f.page.locator(selector).first().click();await (await popup).close();await f.settle();};
    await f.nav("/credit-card-calculator-canada");await f.page.getByRole("button",{name:"Build my card profile"}).click();
    for(let step=1;step<=7;step++){
     await f.page.waitForFunction(n=>document.querySelector(".step-shell.step-visible .step-count-current")?.textContent===String(n),step);
     if(step===6)await f.page.locator(".step-slider").fill("185000");
     if(step===7)await f.page.locator(".step-slider").fill("835");
     await f.page.locator(".step-next").click();
    }
    await f.page.locator(".result-shell.result-visible").waitFor();await f.settle();assert.equal(f.meta("CalculatorCompleted").length,1);
    await f.page.getByRole("button",{name:/^View .* details$/}).first().click();await apply("dialog[open] .card-modal-cta");
    await f.page.getByRole("button",{name:"Close card details",exact:true}).click();
    await f.nav("/");await f.page.locator("button.pick-card").first().click();await apply("dialog[open] .card-modal-cta");
    await f.page.locator("dialog[open] .card-modal-view").click();await f.settle();await apply("a.cardpg-apply");
    assert.equal(f.clicks.length,4);assert.equal(f.meta("ApplyClick").length,4);
    assert(!JSON.stringify(f.network).includes("185000"),"profile income excluded from provider payloads");
    assert(f.clicks.every(r=>Object.keys(JSON.parse(r.body)).join() === "cardId"));
    assert((await f.page.evaluate(()=>window.__diagnostics)).every(d=>Object.keys(d).sort().join()==="channel,reason"));
   }
   // Let already-authorized SDK batches drain before testing newly generated
   // events. Revocation cannot retract work already queued by a provider SDK.
   await f.page.waitForTimeout(7000);
   await f.choices(false,false);const previous=f.network.filter(r=>r.kind==="measurement").length;
   await f.nav("/credit-card-calculator-canada");
   const later=f.network.filter(r=>r.kind==="measurement").slice(previous);
   assert.equal(later.length,0,"new measurement after revocation: "+JSON.stringify(later.map(r=>({host:new URL(r.url).hostname,path:new URL(r.url).pathname,event:new URL(r.url).searchParams.get("en"),bodyEvents:(r.body||"").split("\n").map(s=>new URLSearchParams(s).get("en"))}))));
   assert(!(await f.context.cookies()).some(c=>/^(_ga|_fbp|_fbc)/.test(c.name)));
   assert.deepEqual(f.errors,[]);
   console.log(`PASS consent ${a}/${m}: single page/action events, minimal click body, revoke blocks later measurement.`);
   await f.close();
  }
  const fresh=await fixture(null,null);await fresh.page.goto(origin+"/");await fresh.settle();assert.equal(fresh.network.length,0);
  await fresh.page.getByRole("button",{name:"Reject optional",exact:true}).click();await fresh.settle();assert.equal(fresh.network.length,0);await fresh.close();
  const blocked=await fixture("granted","granted",{blockSdk:true});await blocked.page.goto(origin+"/");await blocked.settle();
  const failures=await blocked.page.evaluate(()=>window.__diagnostics);
  assert(failures.some(d=>d.channel==="google"&&d.reason==="load_failed"));assert(failures.some(d=>d.channel==="meta"&&d.reason==="load_failed"));
  assert.equal(blocked.network.filter(r=>r.kind==="measurement").length,0);await blocked.close();
  console.log("PASS first visit/reject sends nothing; blocked SDKs expose payload-free diagnostics. All measurement/write requests intercepted.");
  // Two deliberately empty requests can never contain a card to store. These
  // verify the deployed handler, not successful production database delivery.
  const api=await browser.newContext();
  assert.equal((await api.request.post(base+"/api/track-click",{data:{}})).status(),403);
  assert.equal((await api.request.post(base+"/api/track-click",{data:{},headers:{"x-clearfin-analytics-consent":"granted"}})).status(),400);
  await api.close();console.log("PASS actual handler rejects no-consent and empty-body probes before storage.");
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

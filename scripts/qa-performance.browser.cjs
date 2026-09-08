const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("node:fs");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const runs = Number(process.env.QA_RUNS || 3);
const out = process.env.QA_ARTIFACT_DIR;
const percentile = (values, p) => [...values].sort((a,b) => a-b)[Math.min(values.length-1, Math.floor(values.length*p))] || 0;

(async () => {
 const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL });
 const records = [];
 try {
  for (const route of ["/", "/credit-card-calculator-canada?start=1", "/credit-cards"]) for (let run=1; run<=runs; run++) {
   const context = await browser.newContext({ viewport: { width:390,height:844 }, deviceScaleFactor:1, reducedMotion:"no-preference" });
   await context.route("**/api/{waitlist,chat,track-click}", r => r.fulfill({status:500,body:"{}"}));
   await context.addInitScript(() => {
    localStorage.setItem("clearfin-analytics-consent","denied"); localStorage.setItem("clearfin-marketing-consent","denied");
    window.__perf = {lcp:0, cls:0, cluster:0, start:0, last:0, legacyQueries:0, legacyRects:0, events:[]};
    new PerformanceObserver(list => { for(const e of list.getEntries()) window.__perf.lcp=e.startTime; }).observe({type:"largest-contentful-paint",buffered:true});
    new PerformanceObserver(list => { for(const e of list.getEntries()) if(!e.hadRecentInput) { const p=window.__perf; if(e.startTime-p.last>1000 || e.startTime-p.start>5000){p.cluster=0;p.start=e.startTime;} p.cluster+=e.value;p.last=e.startTime;p.cls=Math.max(p.cls,p.cluster); } }).observe({type:"layout-shift",buffered:true});
    new PerformanceObserver(list => { for(const e of list.getEntries()) if(e.interactionId) window.__perf.events.push(e.duration); }).observe({type:"event",buffered:true,durationThreshold:16});
    const oldQuery=document.getElementById.bind(document);const ids=new Set(["hero","tool","showcase","feat-1","feat-2","feat-3","feat-4","waitlist"]);
    document.getElementById = id => { if(ids.has(id))window.__perf.legacyQueries++;return oldQuery(id); };
    const oldRect=Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function(){if(ids.has(this.id))window.__perf.legacyRects++;return oldRect.call(this);};
   });
   const page=await context.newPage(); const cdp=await context.newCDPSession(page);
   await cdp.send("Network.enable"); await cdp.send("Network.setCacheDisabled",{cacheDisabled:true});
   await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
   await cdp.send("Emulation.setCPUThrottlingRate",{rate:4}); await cdp.send("Performance.enable");
   await page.goto(base+route,{waitUntil:"networkidle",timeout:90000});
   await page.waitForTimeout(1800);
   const initial=await page.evaluate(()=>({lcpMs:window.__perf.lcp,cls:window.__perf.cls,fcpMs:performance.getEntriesByName("first-contentful-paint")[0]?.startTime||0,scriptBytes:performance.getEntriesByType("resource").filter(e=>e.initiatorType==="script").reduce((n,e)=>n+e.encodedBodySize,0)}));
   await page.evaluate(()=>{window.__perf.legacyQueries=0;window.__perf.legacyRects=0;});
   const metric=async()=>Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m=>[m.name,m.value]));
   const before=await metric();
   const frames=await page.evaluate(()=>new Promise(resolve=>{const times=[];let previous=performance.now(),i=0;const max=document.documentElement.scrollHeight-innerHeight;const tick=now=>{times.push(now-previous);previous=now;window.scrollTo({top:max*(++i/120),behavior:"instant"});if(i<120)requestAnimationFrame(tick);else resolve(times);};requestAnimationFrame(tick);}));
   await page.waitForTimeout(250); const after=await metric();
   const scroll=await page.evaluate(()=>({queries:window.__perf.legacyQueries,rects:window.__perf.legacyRects,cls:window.__perf.cls}));
   await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
   const start=Date.now();
   if(route.includes("calculator")){await page.getByRole("slider").first().press("ArrowRight");}
   else if(route==="/credit-cards"){await page.getByRole("searchbox",{name:"Search cards"}).fill("cobalt");await page.waitForFunction(()=>document.querySelectorAll(".catalog-card").length===1);}
   else {await page.getByRole("button",{name:"Search",exact:true}).click();await page.locator("dialog[open]").waitFor();}
   const actionReadyMs=Date.now()-start;await page.waitForTimeout(100);
   const events=await page.evaluate(()=>window.__perf.events);
   records.push({route,run,...initial,scrollCls:scroll.cls,legacyQueries:scroll.queries,legacyRects:scroll.rects,scrollLayoutCount:after.LayoutCount-before.LayoutCount,scrollScriptMs:(after.ScriptDuration-before.ScriptDuration)*1000,frameP95Ms:percentile(frames.slice(1),.95),actionReadyMs,eventMaxMs:Math.max(0,...events)});
   console.log(JSON.stringify(records.at(-1)));
   await context.close();
  }
  if(out){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+"/measurements.json",JSON.stringify({browser:browser.version(),conditions:"Desktop Chrome, 390x844, CPU 4x, 150ms latency, 1.6Mbps down, fresh context/cache disabled. Lab diagnostics, not physical hardware or field INP.",records},null,2));}
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

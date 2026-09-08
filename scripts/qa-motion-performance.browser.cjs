const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const fs=require("node:fs");
const before=process.env.QA_BEFORE_URL||"http://127.0.0.1:3101";
const after=process.env.QA_AFTER_URL||"http://127.0.0.1:3100";
const runs=Number(process.env.QA_RUNS||3);
const output=process.env.QA_ARTIFACT_FILE;
const routes=["/","/early-access","/credit-card-calculator-canada?start=1","/compare-credit-cards-canada"];
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];

(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER_CHANNEL});
 const records=[];
 try{
  for(const [variant,base] of [["before",before],["after",after]])for(const route of routes)for(let run=1;run<=runs;run++){
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:"no-preference"});
   await context.route("**/api/{waitlist,chat,track-click}",r=>r.fulfill({status:500,body:"{}"}));
   await context.addInitScript(()=>{localStorage.setItem("clearfin-analytics-consent","denied");localStorage.setItem("clearfin-marketing-consent","denied");
    window.__motionPerf={lcp:0,cls:0,last:0,start:0,cluster:0};
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.__motionPerf.lcp=e.startTime;}).observe({type:"largest-contentful-paint",buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){const p=window.__motionPerf;if(e.startTime-p.last>1000||e.startTime-p.start>5000){p.cluster=0;p.start=e.startTime;}p.cluster+=e.value;p.last=e.startTime;p.cls=Math.max(p.cls,p.cluster);}}).observe({type:"layout-shift",buffered:true});
   });
   const page=await context.newPage();const cdp=await context.newCDPSession(page);
   await cdp.send("Network.enable");await cdp.send("Network.setCacheDisabled",{cacheDisabled:true});
   await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
   await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
   await page.goto(base+route,{waitUntil:"networkidle",timeout:90000});await page.waitForTimeout(1200);
   const initial=await page.evaluate(()=>({lcpMs:window.__motionPerf.lcp,cls:window.__motionPerf.cls,
    fcpMs:performance.getEntriesByName("first-contentful-paint")[0]?.startTime||0,
    scriptBytes:performance.getEntriesByType("resource").filter(e=>e.initiatorType==="script").reduce((n,e)=>n+e.encodedBodySize,0)}));
   const actionStart=Date.now();
   if(route.includes("calculator"))await page.getByRole("slider").first().press("ArrowRight");
   if(route.includes("compare")){await page.getByRole("button",{name:/Second card:/}).click();const combo=page.getByRole("combobox",{name:/Search second card/});await combo.fill("SimplyCash Preferred");await combo.press("Enter");}
   if(route==="/"||route==="/early-access")await page.locator("#waitlist .wait-form").scrollIntoViewIfNeeded();
   await page.waitForTimeout(950);
   const actionReadyMs=Date.now()-actionStart;
   const finalCls=await page.evaluate(()=>window.__motionPerf.cls);
   records.push({variant,route,run,...initial,finalCls,actionReadyMs});
   await context.close();
  }
  const summary=[];
  for(const route of routes)for(const variant of ["before","after"]){
   const rows=records.filter(r=>r.route===route&&r.variant===variant);
   summary.push({route,variant,lcpMs:median(rows.map(r=>r.lcpMs)),fcpMs:median(rows.map(r=>r.fcpMs)),
    cls:median(rows.map(r=>r.finalCls)),scriptBytes:median(rows.map(r=>r.scriptBytes)),actionReadyMs:median(rows.map(r=>r.actionReadyMs))});
  }
  const result={browser:browser.version(),conditions:"390x844, DPR 1, CPU 4x, 150ms latency, 1.6Mbps down, cache disabled, three fresh contexts. Lab comparison, not physical hardware or field data.",records,summary};
  if(output)fs.writeFileSync(output,JSON.stringify(result,null,2));
  console.log(JSON.stringify(summary));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

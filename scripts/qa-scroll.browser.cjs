const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";

(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER_CHANNEL});
 try {
  const context=await browser.newContext({reducedMotion:"reduce"});
  await context.addInitScript(()=>{localStorage.setItem("clearfin-analytics-consent","denied");localStorage.setItem("clearfin-marketing-consent","denied");});
  await context.route("**/api/{waitlist,chat,track-click}",r=>r.fulfill({status:500,body:"{}"}));
  const page=await context.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
  for(const route of ["/","/early-access"])for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});await page.goto(base+route,{waitUntil:"networkidle"});
   await page.evaluate(()=>document.fonts.ready);
   for(const position of [0,.5,1]){
    await page.evaluate(p=>window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*p,behavior:"instant"}),position);
    await page.waitForTimeout(300);
    const actual=await page.locator(".scroll-progress").evaluate(el=>el.getBoundingClientRect().width/innerWidth);
    assert(Math.abs(actual-position)<.015,`${route} ${width} progress ${position}: ${actual}`);
    if(process.env.QA_ARTIFACT_DIR){fs.mkdirSync(process.env.QA_ARTIFACT_DIR,{recursive:true});await page.screenshot({path:`${process.env.QA_ARTIFACT_DIR}/${route==="/"?"home":"early"}-${width}-${position}.png`,animations:"disabled"});}
   }
  }
  // Content-height changes should update progress without needing another user scroll.
  if(process.env.QA_CHECK_RESIZE==="1"){
   await page.evaluate(()=>{const el=document.createElement("div");el.id="qa-height";el.style.height="2000px";document.body.append(el);});
   await page.waitForTimeout(300);
   const ratio=await page.evaluate(()=>document.documentElement.scrollTop/(document.documentElement.scrollHeight-innerHeight));
   const painted=await page.locator(".scroll-progress").evaluate(el=>el.getBoundingClientRect().width/innerWidth);
   assert(Math.abs(painted-ratio)<.015);
   await page.evaluate(()=>document.getElementById("qa-height").remove());
  }
  for(const [hash,path] of [["#tool","/credit-card-calculator-canada"],["#compare","/compare-credit-cards-canada"],["#waitlist","/early-access"]]){
   await page.goto(base+"/"+hash);await page.waitForURL(base+path);
  }
  await page.goto(base+"/#hero");await page.waitForURL(base+"/");
  assert.deepEqual(errors,[]);
  console.log("PASS: progress at top/middle/end on home and early access, desktop/mobile; legacy links and error-free navigation. Height-change check enabled only for revised implementation.");
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

const assert = require("node:assert/strict");
const fs = require("node:fs");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const out = process.env.QA_ARTIFACT_DIR;

(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER_CHANNEL});
 try {
  for(const reduced of [false,true]){
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:reduced?"reduce":"no-preference"});
   await context.route("**/api/{waitlist,chat,track-click}",r=>r.fulfill({status:500,body:"{}"}));
   await context.addInitScript(()=>{localStorage.setItem("clearfin-analytics-consent","denied");localStorage.setItem("clearfin-marketing-consent","denied");});
   const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.goto(base+"/credit-card-calculator-canada?start=1");
   const slider=page.getByRole("slider").first(),value=page.locator(".step-amount-value");
   await slider.press("ArrowRight");
   assert.equal(await value.innerText(),"$410");
   assert.equal((await value.evaluate(e=>getComputedStyle(e).animationName))==="none",reduced);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));

   await page.goto(base+"/compare-credit-cards-canada");
   const feedback=page.locator(".cmp-value-feedback").first();
   assert.equal((await feedback.evaluate(e=>getComputedStyle(e).animationName))==="none",reduced);
   const old=await feedback.locator("strong").innerText();
   await page.getByRole("button",{name:/Second card:/}).click();
   const combo=page.getByRole("combobox",{name:/Search second card/});
   await combo.fill("SimplyCash Preferred");
   await combo.press("Enter");
   await page.waitForFunction(old=>document.querySelectorAll(".cmp-value-feedback strong")[1]?.textContent!==old,old);
   assert.equal((await page.locator(".cmp-value-feedback").nth(1).evaluate(e=>getComputedStyle(e).animationName))==="none",reduced);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));

   for(const route of ["/","/early-access"]){
    await page.goto(base+route);
    const scene=page.locator("#waitlist .wait-scene");
    assert.equal(await scene.getAttribute("aria-hidden"),"true");
    assert.equal(await scene.evaluate(e=>getComputedStyle(e).pointerEvents),"none");
    assert.equal(await scene.locator(".wait-glass-card").count(),2);
    const animation=await scene.locator(".wait-glass-card-one").evaluate(e=>({name:getComputedStyle(e).animationName,count:getComputedStyle(e).animationIterationCount}));
    assert.equal(animation.name==="none",reduced);
    if(!reduced)assert.equal(animation.count,"1");
    const form=page.locator("#waitlist .wait-form");
    await form.scrollIntoViewIfNeeded();
    const before=await form.boundingBox();
    await page.waitForTimeout(1000);
    const after=await form.boundingBox();
    assert(before&&after&&Math.abs(before.x-after.x)<.2&&Math.abs(before.y-after.y)<.2,"Form controls must not move");
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    if(out&&!reduced){
     fs.mkdirSync(out,{recursive:true});const name=route==="/"?"home":"early-access";
     await page.screenshot({path:`${out}/${name}-390.png`,fullPage:true});
     await page.setViewportSize({width:1440,height:1000});
     await page.screenshot({path:`${out}/${name}-1440.png`,fullPage:true});
     await page.setViewportSize({width:390,height:844});
    }
   }
   assert.deepEqual(errors,[]);
   await context.close();
  }
  console.log("PASS immediate calculator/compare feedback, one-shot decorative CTA entrance, reduced-motion stills, stable forms and 390px reflow.");
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

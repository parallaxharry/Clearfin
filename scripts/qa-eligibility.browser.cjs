const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const fixtures = process.env.QA_ELIGIBILITY_FIXTURE === "1";
if(fixtures && !["127.0.0.1","localhost"].includes(new URL(base).hostname)) throw Error("Fixtures are local-only");

(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER_CHANNEL});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
  await context.addInitScript(()=>{localStorage.setItem("clearfin-analytics-consent","denied");localStorage.setItem("clearfin-marketing-consent","denied");});
  const writes=[];
  await context.route("**/api/{waitlist,chat,track-click}",r=>{writes.push(r.request().postData());return r.fulfill({status:500,body:"{}"});});
  const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
  const waitStep=n=>page.waitForFunction(n=>document.querySelector(".step-shell.step-visible .step-count-current")?.textContent===String(n),n);
  async function toIncome(){for(let n=1;n<=5;n++){await waitStep(n);await page.locator(".step-next").click();}await waitStep(6);}
  const household=page.getByRole("spinbutton",{name:"Household income per year (optional)"});
  async function finish(){await page.locator(".step-next").click();await waitStep(7);await page.locator(".step-slider").fill("300");await page.locator(".step-next").click();await page.locator(".result-shell.result-visible").waitFor();}
  async function screenshot(name){if(process.env.QA_ARTIFACT_DIR){fs.mkdirSync(process.env.QA_ARTIFACT_DIR,{recursive:true});await page.screenshot({path:process.env.QA_ARTIFACT_DIR+"/"+name+".png",fullPage:true});}}

  if(fixtures){
   await page.goto(base+"/qa-eligibility-fixture");await toIncome();await page.locator(".step-slider").fill("35000");await household.fill("100000");await finish();
   assert.equal(await page.locator(".result-card").count(),1);
   assert.equal(await page.locator('[data-income-check="matched"]').count(),1);
   await page.getByText("Recorded household-income check met",{exact:true}).waitFor();
   await page.getByText("Below the estimated credit-score range — check with issuer",{exact:true}).waitFor();
   await screenshot("household-match");
   await page.getByRole("button",{name:/Recalculate|Start over/}).click();await toIncome();assert.equal(await household.inputValue(),"");
   await page.locator(".step-slider").fill("35000");await household.fill("90000");await finish();
   assert.equal(await page.locator(".result-card").count(),0);await page.getByText(/This is not a credit decision/).waitFor();
   await page.goto(base+"/qa-eligibility-fixture?mode=unknown");await toIncome();await finish();
   assert.equal(await page.locator('[data-income-check="unknown"]').count(),3);assert.equal(await page.locator('[data-income-check="matched"]').count(),0);
   console.log("PASS local fixtures: household alternative, below-threshold empty state, missing map safe state; estimated score does not exclude cards.");
  }

  await page.goto(base+"/credit-card-calculator-canada?start=1");await toIncome();assert.equal(await household.inputValue(),"");
  await household.fill("100");assert.equal(await household.getAttribute("aria-invalid"),"true");assert.equal(await page.locator(".step-next").isDisabled(),true);
  await household.fill("140000");assert.equal(await page.locator(".step-next").isEnabled(),true);
  await page.locator(".step-back").click();await waitStep(5);await page.locator(".step-next").click();await waitStep(6);assert.equal(await household.inputValue(),"140000");
  for(const width of [390,320]){await page.setViewportSize({width,height:900});assert(await household.isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await screenshot("income-"+width);}
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('a[href="/compare-credit-cards-canada"]:visible').first().click();await page.waitForURL(base+"/compare-credit-cards-canada");
  await page.locator('a[href="/credit-card-calculator-canada"]:visible').first().click();await page.waitForURL(url=>url.pathname==="/credit-card-calculator-canada");
  if(await page.getByRole("button",{name:"Build my card profile"}).isVisible())await page.getByRole("button",{name:"Build my card profile"}).click();
  await toIncome();assert.equal(await household.inputValue(),"140000");
  await finish();assert(await page.locator(".result-card").count()>0);await page.getByText(/This ranks estimated rewards, not approval odds/).waitFor();
  assert.equal(await page.locator(".result-card [data-income-check]").count(),await page.locator(".result-card").count());
  await page.getByRole("button",{name:/^View .* details$/}).first().click();await page.getByText("Check current issuer terms. This is not an approval decision.",{exact:true}).waitFor();await page.getByRole("button",{name:"Close card details",exact:true}).click();
  await page.setViewportSize({width:390,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await screenshot("results-390");
  assert(!(await page.evaluate(()=>JSON.stringify({...localStorage}))).includes("140000"));assert.deepEqual(writes,[]);
  await page.getByRole("button",{name:/Recalculate|Start over/}).click();await toIncome();assert.equal(await household.inputValue(),"");
  await household.fill("160000");await page.reload();
  if(await page.getByRole("button",{name:"Build my card profile"}).isVisible())await page.getByRole("button",{name:"Build my card profile"}).click();
  await toIncome();assert.equal(await household.inputValue(),"");
  await household.fill("");assert.equal(await page.locator(".step-next").isEnabled(),true);assert.deepEqual(errors,[]);
  console.log("PASS optional field validation, Back/navigation persistence, reset/reload clearing, unknown-safe labels, modal guidance, mobile reflow and no stored/submitted household values.");
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

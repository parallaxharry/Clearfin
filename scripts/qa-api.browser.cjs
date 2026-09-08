const assert = require("node:assert/strict");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
(async()=>{
  const browser=await chromium.launch({headless:true,channel:process.env.QA_BROWSER_CHANNEL});
  try {
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    await context.addInitScript(()=>{localStorage.setItem("clearfin-analytics-consent","denied");localStorage.setItem("clearfin-marketing-consent","denied");});
    await context.route("**/api/{waitlist,track-click}",r=>r.fulfill({status:500,body:"{}"}));
    const payloads=[];let fail=false;
    await context.route("**/api/chat",r=>{
      payloads.push(r.request().postDataJSON());
      return r.fulfill(fail?{status:413,contentType:"application/json",body:JSON.stringify({error:"Request too large."})}
        :{status:200,contentType:"text/plain",body:"Fixture answer "+"helpful text. ".repeat(100)});
    });
    const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(base+"/credit-card-calculator-canada");
    await page.getByRole("button",{name:"Ask about credit cards"}).click();
    const question=page.getByRole("textbox",{name:"Your credit card question"});
    const send=page.getByRole("button",{name:"Send",exact:true});
    for(let i=0;i<7;i++){
      await question.fill("Synthetic question "+i);await send.click();
      await page.waitForFunction(()=>!document.querySelector(".cf-chat-thinking")&&document.querySelectorAll(".cf-chat-assistant").length>0);
      await question.waitFor({state:"visible"});await send.waitFor({state:"visible"});
      // Wait for this response to finish, not just the first streamed text.
      await page.getByRole("button",{name:"Stop response"}).waitFor({state:"hidden"});
    }
    assert.equal(payloads.length,7);assert.equal(payloads[6].messages.length,10);
    assert.equal(payloads[6].messages.at(-1).content,"Synthetic question 6");
    assert(!JSON.stringify(payloads[6]).includes("Synthetic question 0"));
    assert(payloads.every(p=>p.messages.every(m=>m.content.length<=1000)));
    assert.equal(await page.locator(".cf-chat-user").count(),7);
    assert((await page.locator(".cf-chat-assistant").first().innerText()).length>1000,"Visible answer must not be truncated");
    fail=true;await question.fill("Retain me after a size error");await send.click();
    await page.getByText("Request too large.",{exact:true}).waitFor();
    await page.getByRole("button",{name:"Retry question"}).waitFor();
    fail=false;await page.getByRole("button",{name:"Retry question"}).click();
    await page.getByRole("button",{name:"Stop response"}).waitFor({state:"hidden"});
    assert.equal(await page.locator(".cf-chat-user").count(),8);
    assert.deepEqual(errors,[]);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    console.log("PASS bounded ten-turn chat payload, full visible history, long answer preservation and recoverable 413; all chat replies mocked.");

    // Tiny invalid requests only: no valid identity, email, card or question can reach storage/paid work.
    for(const [route,body,type,headers,expected] of [
      ["waitlist","{}","text/plain",{},415],
      ["waitlist","null","application/json",{},400],
      ["chat","null","application/json",{},400],
      ["track-click","{}","text/plain",{"x-clearfin-analytics-consent":"granted"},415],
    ]){
      const response=await context.request.post(base+"/api/"+route,{data:body,headers:{"content-type":type,...headers}});
      // An unconfigured local assistant deliberately returns 503 before parsing.
      const local=["localhost","127.0.0.1"].includes(new URL(base).hostname);
      assert(response.status()===expected||(local&&route==="chat"&&response.status()===503),route+": "+response.status());
      assert((await response.json()).error);
    }
    console.log("PASS four harmless invalid-request probes; no valid submission or load test.");
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

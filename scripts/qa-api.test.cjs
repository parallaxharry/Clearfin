const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, overrides = {}, globals = {}) {
  const module = {exports:{}};
  const code = ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  vm.runInNewContext(code,{module,exports:module.exports,TextEncoder,TextDecoder,ReadableStream,Response,AbortSignal,
    setTimeout,clearTimeout,console,...globals,require:name=>Object.hasOwn(overrides,name)?overrides[name]:require(name)});
  return module.exports;
}
const bounds = load("src/lib/requestBody.ts");
const chat = load("src/lib/chatRequest.ts");
const req = (body, headers = {}) => new Request("https://example.invalid",{method:"POST",headers:{"content-type":"application/json",...headers},body});
const json = value => req(JSON.stringify(value));
const clientId = "11111111-1111-1111-1111-111111111111";
const valid = {clientId,cardId:null,messages:[{role:"user",content:"Compare everyday cards"}]};
const rejects = (promise,status) => assert.rejects(promise,error=>error.status===status);

test("JSON bounds use UTF-8 bytes, accept exact limits and reject empty/invalid encoding", async()=>{
  const raw='{"x":"é"}',size=new TextEncoder().encode(raw).length;
  assert.equal((await bounds.readBoundedJson(req(raw),size)).x,"é");
  await rejects(bounds.readBoundedJson(req(raw),size-1),413);
  for(const body of ["", "{", new Uint8Array([0xff])])await rejects(bounds.readBoundedJson(req(body),1024),400);
});
test("JSON rejects wrong media type and oversized declarations before reading", async()=>{
  let reads=0,cancels=0;
  const fake=headers=>({headers:new Headers(headers),body:{getReader(){reads++;throw Error("must not read");},cancel:async()=>{cancels++;}}});
  await rejects(bounds.readBoundedJson(fake({"content-type":"text/plain"}),100),415);
  await rejects(bounds.readBoundedJson(fake({"content-type":"application/json","content-length":"101"}),100),413);
  await rejects(bounds.readBoundedJson(fake({"content-type":"application/json","content-length":"invalid"}),100),400);
  assert.equal(reads,0);assert.equal(cancels,3);
  assert.equal((await bounds.readBoundedJson(req("{}",{"content-type":"Application/JSON; charset=utf-8"}),2)).constructor.name,"Object");
});
test("chunked or falsely small declarations cannot bypass byte limit; reader is cancelled", async()=>{
  for(const declared of [null,"1"]){
    let reads=0,cancelled=false;
    const body=new ReadableStream({pull(c){reads++;c.enqueue(new Uint8Array(600));},cancel(){cancelled=true;}},{highWaterMark:0});
    const headers=new Headers({"content-type":"application/json"});if(declared)headers.set("content-length",declared);
    await rejects(bounds.readBoundedJson({headers,body},1024),413);
    assert.equal(reads,2);assert(cancelled);assert.equal(body.locked,false);
  }
});
test("stalled body times out and cancels; broken stream is a safe 400 without raw diagnostics", async()=>{
  let cancelled=false;
  const body=new ReadableStream({pull(){},cancel(){cancelled=true;return new Promise(()=>{});}});
  await rejects(bounds.readBoundedJson({headers:new Headers({"content-type":"application/json"}),body},1024,15),408);
  assert(cancelled);assert.equal(body.locked,false);
  const broken=new ReadableStream({start(c){c.error(Error("private marker"));}});
  await assert.rejects(bounds.readBoundedJson({headers:new Headers({"content-type":"application/json"}),body:broken},1024),error=>error.status===400&&!error.message.includes("private marker"));
});
test("chat schema rejects malformed histories, roles, fields and overlong values", ()=>{
  assert(chat.isChatRequest(valid));assert(chat.isChatRequest({...valid,email:"hello@example.invalid",cardId:"Amex-cobalt"}));
  const bad=[null,[],1,{}, {...valid,extra:"private"},{...valid,clientId:"bad"},{...valid,email:{}},{...valid,email:"bad"},{...valid,cardId:{}},
    {...valid,messages:[]},{...valid,messages:Array(11).fill(valid.messages[0])},
    ...[null,1,[],{role:"system",content:"x"},{role:"user",content:1},{role:"user",content:" "},{role:"user",content:"x".repeat(1001)},{role:"user",content:"x",extra:1}].map(message=>({...valid,messages:[message]})),
    {...valid,messages:[{role:"assistant",content:"answer"}]}];
  for(const value of bad)assert.equal(chat.isChatRequest(value),false,JSON.stringify(value));
});
test("chat sends only the already-used ten-turn context without mutating visible history", ()=>{
  const messages=Array.from({length:20},(_,i)=>({role:i%2?"user":"assistant",content:(i===0?"old private marker":"x").repeat(i%2?1000:6000)}));
  const before=JSON.stringify(messages),out=chat.chatHistoryForRequest(messages);
  assert.equal(out.length,10);assert(out.every(m=>m.content.length===1000));assert.equal(JSON.stringify(messages),before);
  assert(chat.isChatRequest({...valid,messages:out}));
  assert(!JSON.stringify(out).includes("private marker"));
  // Do not silently truncate a too-long new question; server validation must reject it.
  assert.equal(chat.chatHistoryForRequest([{role:"user",content:"x".repeat(1001)}])[0].content.length,1001);
  const worst={...valid,email:"x".repeat(240)+"@example.ca",cardId:"x".repeat(100),messages:Array.from({length:10},()=>({role:"user",content:"\u0000".repeat(1000)}))};
  assert(new TextEncoder().encode(JSON.stringify(worst)).length<chat.MAX_CHAT_BODY_BYTES);
});

function chatRoute(gate={allow:false,reason:"email_required",message:"Email required"},configured=true){
  const calls=[];
  const session={getSession:async()=>{calls.push("session");return {promptCount:10,email:null};},dailyCapExceeded:async()=>false,checkGate:async()=>gate,
    hashIp:()=>"fixture",clientIpFrom:()=>"fixture",isValidEmail:()=>false,MAX_PROMPTS:20,FREE_PROMPTS:10,CONTACT_EMAIL:"info@example.invalid"};
  const route=load("src/app/api/chat/route.ts",{
    "next/server":{NextResponse:{json:(body,opts)=>({body,status:opts.status})}},openai:class{constructor(){throw Error("No paid calls allowed");}},
    "@/lib/chatContext":{},"@/lib/chatTools":{},"@/lib/chatSession":session,"@/lib/requestBody":bounds,"@/lib/chatRequest":chat,
  },{process:{env:configured?{OPENAI_API_KEY:"fixture-not-a-real-key"}:{}},console:{error(){}}});
  return {route,calls};
}
test("chat rejects null/malformed earlier history before sessions, storage or paid work", async()=>{
  const {route,calls}=chatRoute();
  for(const value of [null,[],{...valid,messages:[null,...valid.messages]},{...valid,messages:[{role:"user",content:{}},...valid.messages]}]){
    assert.equal((await route.POST(json(value))).status,400);
  }
  assert.equal((await route.POST(req("x".repeat(65537)))).status,413);
  assert.equal((await route.POST(req("{}",{"content-type":"text/plain"}))).status,415);
  assert.equal(calls.length,0);
});
test("valid bounded chat retains email and allowance gates; missing configuration stays unavailable",async()=>{
  for(const [reason,status] of [["email_required",428],["limit_reached",429]]){
    const f=chatRoute({allow:false,reason,message:"fixture"});assert.equal((await f.route.POST(json(valid))).status,status);assert.deepEqual(f.calls,["session"]);
  }
  const f=chatRoute(undefined,false);assert.equal((await f.route.POST(json(valid))).status,503);assert.equal(f.calls.length,0);
});
test("waitlist and click body failures return safe statuses without database access",async()=>{
  for(const [file,limit] of [["waitlist",4096],["track-click",1024]]){
    let calls=0;
    const route=load(`src/app/api/${file}/route.ts`,{"next/server":{NextResponse:{json:(body,opts)=>({body,status:opts.status})}},
      "@/lib/requestBody":bounds,"@supabase/supabase-js":{createClient(){calls++;throw Error("No database access allowed");}}},{process:{env:{}},console:{error(){}}});
    const headers={"x-clearfin-analytics-consent":"granted"};
    assert.equal((await route.POST(req("x".repeat(limit+1),headers))).status,413);
    assert.equal((await route.POST(req("{}",{...headers,"content-type":"text/plain"}))).status,415);
    assert.equal((await route.POST(req(JSON.stringify({email:"hello@example.invalid",unexpected:1}),headers))).status,400);
    assert.equal(calls,0);
  }
});

test("valid chat streams a mocked answer and retains accounting; provider errors have fixed diagnostics",async()=>{
  for(const fail of [false,true]){
    const records=[],logs=[],diagnostics=[],sent=[];
    class FakeOpenAI {chat={completions:{create:async args=>{
      sent.push(args);if(fail)throw Error("private provider marker");
      return (async function*(){yield {choices:[{delta:{content:"Fixture answer"}}],usage:{total_tokens:12}};})();
    }}};}
    const route=load("src/app/api/chat/route.ts",{
      "next/server":{NextResponse:{json:(body,opts)=>({body,status:opts.status})}},openai:{default:FakeOpenAI},
      "@/lib/chatContext":{CHAT_MODEL:"fixture",getSlimCatalogue:async()=>[],buildSystemPrompt:()=>"Fixture system"},"@/lib/chatTools":{CHAT_TOOLS:[]},
      "@/lib/chatSession":{getSession:async()=>({promptCount:0,email:null}),dailyCapExceeded:async()=>false,checkGate:async()=>({allow:true,email:null}),
        hashIp:()=>"fixture",clientIpFrom:()=>"fixture",isValidEmail:()=>false,recordPrompt:async(...a)=>records.push(a),logMessage:async(...a)=>logs.push(a)},
      "@/lib/requestBody":bounds,"@/lib/chatRequest":chat,
    },{process:{env:{OPENAI_API_KEY:"fixture"}},console:{error:(...a)=>diagnostics.push(a)}});
    const result=await route.POST(json(valid)),text=await result.text();
    assert.equal(result.status,200);assert.equal(sent.length,1);assert.equal(sent[0].messages.at(-1).content,valid.messages[0].content);
    assert.equal(records.length,1);assert.equal(logs.length,2);
    if(fail){assert(text.includes("couldn't finish"));assert(!JSON.stringify(diagnostics).includes("private provider marker"));}
    else {assert.equal(text,"Fixture answer");assert.equal(records[0][1],12);}
  }
});

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadModule(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require, console },
    { filename: relativePath });
  return module.exports;
}

test("headings slugify to url-safe ids", () => {
  const { slugifyHeading } = loadModule("src/lib/blogToc.ts");
  assert.equal(slugifyHeading("The Short Answer"), "the-short-answer");
  assert.equal(slugifyHeading("What a 2.5% FX Fee Costs You"), "what-a-25-fx-fee-costs-you");
  assert.equal(slugifyHeading("Who This Isn't For"), "who-this-isnt-for");
});

test("ids survive punctuation and spacing that markdown headings carry", () => {
  const { slugifyHeading } = loadModule("src/lib/blogToc.ts");
  assert.equal(slugifyHeading("  Caps, Explained  "), "caps-explained");
  assert.equal(slugifyHeading("No-Fee vs Paid"), "no-fee-vs-paid");
});

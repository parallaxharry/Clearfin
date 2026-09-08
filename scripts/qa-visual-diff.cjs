const fs = require("node:fs");
const assert = require("node:assert/strict");
const { PNG } = require(process.env.PNG_MODULE || "pngjs");
const loaded = require(process.env.PIXELMATCH_MODULE || "pixelmatch");
const pixelmatch = loaded.default || loaded;
const [before, after] = process.argv.slice(2);
assert(before && after, "Pass before and after screenshot directories");
const results = fs.readdirSync(before).filter(name => name.endsWith(".png")).map(name => {
 const a = PNG.sync.read(fs.readFileSync(`${before}/${name}`));
 const b = PNG.sync.read(fs.readFileSync(`${after}/${name}`));
 assert.equal(a.width,b.width,name);assert.equal(a.height,b.height,name);
 const pixels = pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:.1});
 return {name,pixels,ratio:pixels/(a.width*a.height)};
});
console.log(JSON.stringify(results,null,2));
fs.writeFileSync(`${after}/visual-comparison.json`,JSON.stringify(results,null,2));
assert(results.length>0 && results.every(r=>r.ratio<.001), "Review screenshot differences before release");

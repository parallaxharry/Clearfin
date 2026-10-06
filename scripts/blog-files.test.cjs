const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadModule(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    // esModuleInterop mirrors tsconfig.json; without it `import fs from
    // "node:fs"` compiles to fs.default.existsSync, which is undefined.
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require, console, process },
    { filename: relativePath });
  return module.exports;
}

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "clearfin-blog-"));
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body, "utf8");
  }
  return dir;
}

const post = (title, date) => `---
title: ${title}
description: A description of ${title}.
tags: [travel, fees]
publishedAt: ${date}
---

## The Short Answer

Body of ${title}.
`;

test("parses frontmatter and keeps the body intact", () => {
  const { parseFrontmatter } = loadModule("src/lib/blogFiles.ts");
  const { data, body } = parseFrontmatter(post("Example", "2026-10-05"));
  assert.equal(data.title, "Example");
  assert.equal(data.description, "A description of Example.");
  assert.equal(data.publishedAt, "2026-10-05");
  assert.equal(body.trim().startsWith("## The Short Answer"), true);
});

test("tags parse into an array", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  const dir = tempDir({ "a.md": post("A", "2026-10-05") });
  // Array.from re-homes the value into this realm. Arrays built inside the vm
  // context carry that context's Array.prototype, which deepStrictEqual treats
  // as a mismatch even when the contents are identical.
  assert.deepEqual(Array.from(getFilePosts(dir)[0].tags), ["travel", "fees"]);
});

test("slug comes from the filename and the date becomes ISO", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  const dir = tempDir({ "no-fx-fee-cards.md": post("A", "2026-10-05") });
  const [found] = getFilePosts(dir);
  assert.equal(found.slug, "no-fx-fee-cards");
  assert.equal(found.publishedAt, "2026-10-05T00:00:00.000Z");
});

test("posts come back newest first", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  const dir = tempDir({
    "older.md": post("Older", "2026-10-01"),
    "newer.md": post("Newer", "2026-10-09"),
  });
  assert.deepEqual(Array.from(getFilePosts(dir), (p) => p.slug), ["newer", "older"]);
});

test("a missing directory yields no posts rather than throwing", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  assert.deepEqual(Array.from(getFilePosts(path.join(os.tmpdir(), "clearfin-does-not-exist"))), []);
});

test("a missing required field fails the build loudly", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  const dir = tempDir({ "broken.md": "---\ntitle: Only a title\n---\n\nBody.\n" });
  assert.throws(() => getFilePosts(dir), /broken\.md.*description/s);
});

test("non-markdown files are ignored", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  const dir = tempDir({ "a.md": post("A", "2026-10-05"), ".DS_Store": "junk", "notes.txt": "junk" });
  assert.equal(getFilePosts(dir).length, 1);
});

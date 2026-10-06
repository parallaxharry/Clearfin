# Blog Content Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish blog posts by adding one markdown file and pushing — no SQL, no code edit — and ship the first two posts.

**Architecture:** Posts live as markdown files in `content/blog/`. A build-time loader parses their frontmatter and returns them in the existing `BlogPost` shape. `getPosts()` slots them between the (never-populated) database rows and the existing hardcoded fallbacks, so nothing currently published changes. A table of contents is generated from each post's H2 headings.

**Tech Stack:** Next.js 16.2.4 App Router, TypeScript, `react-markdown` + `remark-gfm` (already installed), `node:test` + `node:assert/strict` for tests (the pattern `scripts/meta-pixel.test.cjs` already uses). No new runtime dependencies.

## Global Constraints

Copied from `docs/superpowers/specs/2026-10-05-blog-content-pipeline-design.md`. Every task's requirements implicitly include these.

- **No new runtime dependencies.** Frontmatter is parsed by hand; the key set is fixed and small.
- **Posts live at `/blog/<slug>`.** Flat. No category segment.
- **Card facts come from `card_catalog` at draft time, never from memory.**
- **Merit ordering only.** Posts rank cards on the numbers, never on affiliate payout.
- **Every card named links to its `/credit-cards/<id>` page.**
- **Rate and fee claims carry a date.**
- **No cents-per-point valuations.** The rate columns mix conventions and `point_value_cpp` is null on 51 of 122 cards.
- **Post shape:** 1200–1600 words; first H2 is exactly `## The Short Answer`; at least one GFM table built from live catalog data; a worked dollar example; a closing section on who the advice does not suit.
- **The five existing posts must keep rendering unchanged.**
- **Caching model:** this project does *not* set `cacheComponents: true`, so it uses the previous model — `export const revalidate` and React `cache()`. Do not introduce `use cache` / `cacheLife`.
- **Tests run with** `node --test scripts/<name>.test.cjs`.

---

### Task 1: Markdown post loader

**Files:**
- Create: `src/lib/blogFiles.ts`
- Create: `scripts/blog-files.test.cjs`
- Create: `content/blog/.gitkeep`
- Modify: `package.json` (add a `test` script)

**Interfaces:**
- Consumes: the `BlogPost` interface exported from `src/lib/blog.ts:5`.
- Produces:
  - `parseFrontmatter(raw: string): { data: Record<string, string>; body: string }`
  - `getFilePosts(dir?: string): BlogPost[]` — `dir` defaults to `path.join(process.cwd(), "content/blog")`; returns posts newest-first; returns `[]` when the directory does not exist.

A post file looks like this:

```markdown
---
title: Credit Cards With No Foreign Transaction Fees in Canada
description: Only five of the 122 cards we track waive the 2.5 percent FX fee.
tags: [travel, fees]
publishedAt: 2026-10-05
coverImg: /blog/no-fx-fees.jpg
---

## The Short Answer

Body text.
```

`tags` is the only list-valued key, written inline in brackets. `coverImg`, `metaTitle` and `updatedAt` are optional; everything else is required and a missing one is a build-time error, because a half-formed post should fail the build rather than publish broken.

- [ ] **Step 1: Write the failing test**

Create `scripts/blog-files.test.cjs`:

```js
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
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
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
  assert.deepEqual(getFilePosts(dir)[0].tags, ["travel", "fees"]);
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
  assert.deepEqual(getFilePosts(dir).map((p) => p.slug), ["newer", "older"]);
});

test("a missing directory yields no posts rather than throwing", () => {
  const { getFilePosts } = loadModule("src/lib/blogFiles.ts");
  assert.deepEqual(getFilePosts(path.join(os.tmpdir(), "clearfin-does-not-exist")), []);
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/blog-files.test.cjs`
Expected: FAIL — `src/lib/blogFiles.ts` does not exist (ENOENT from `loadModule`).

- [ ] **Step 3: Write the implementation**

Create `src/lib/blogFiles.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import type { BlogPost } from "@/lib/blog";

/*
 * Posts are markdown files in content/blog/, one per post, read at build time.
 * The frontmatter key set is fixed and small, so it is parsed here rather than
 * pulling in a YAML dependency. See
 * docs/superpowers/specs/2026-10-05-blog-content-pipeline-design.md.
 */

const REQUIRED = ["title", "description", "publishedAt"] as const;

export function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(normalized);
  if (!match) return { data: {}, body: normalized };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) data[key] = value.replace(/^["']|["']$/g, "");
  }
  return { data, body: normalized.slice(match[0].length) };
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

export function getFilePosts(
  dir: string = path.join(process.cwd(), "content/blog"),
): BlogPost[] {
  if (!fs.existsSync(dir)) return [];

  const posts = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, name), "utf8"));
      for (const key of REQUIRED) {
        if (!data[key]) {
          throw new Error(`content/blog/${name}: frontmatter is missing "${key}"`);
        }
      }
      const publishedAt = new Date(data.publishedAt).toISOString();
      return {
        slug: name.replace(/\.md$/, ""),
        title: data.title,
        metaTitle: data.metaTitle || undefined,
        description: data.description,
        bodyMd: body.trim(),
        coverImg: data.coverImg || null,
        tags: parseTags(data.tags),
        author: data.author || "ClearFin Team",
        publishedAt,
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : publishedAt,
      } satisfies BlogPost;
    });

  return posts.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/blog-files.test.cjs`
Expected: PASS, 7 tests.

- [ ] **Step 5: Add the test script and keep the directory in git**

In `package.json`, add to `"scripts"`:

```json
"test": "node --test scripts/*.test.cjs"
```

Create an empty `content/blog/.gitkeep` so the directory survives a clone before any post exists.

- [ ] **Step 6: Run the whole suite**

Run: `npm test`
Expected: PASS — the 7 new tests plus the 9 existing `meta-pixel` tests.

- [ ] **Step 7: Commit**

```bash
git add src/lib/blogFiles.ts scripts/blog-files.test.cjs content/blog/.gitkeep package.json
git commit -m "feat(blog): read posts from markdown files in content/blog"
```

---

### Task 2: Serve file posts, and make sure they survive deployment

**Files:**
- Modify: `src/lib/blog.ts:234` (the `CODE_POSTS` constant) and `src/lib/blog.ts:243-270` (`getPosts`)
- Modify: `next.config.ts`
- Create: `scripts/blog-precedence.test.cjs`

**Interfaces:**
- Consumes: `getFilePosts()` from Task 1.
- Produces: no new exports. `getPosts()` keeps its existing signature, `Promise<BlogPost[]>`.

Precedence becomes database rows → file posts → hardcoded `CODE_POSTS`, deduplicated by slug with the earlier source winning, sorted newest first.

`next.config.ts` needs `outputFileTracingIncludes`. The pages are ISR (`export const revalidate = 300`), so the markdown is read again on the server when a page revalidates — not only at build. Next's tracer does not reliably follow a `readdirSync` on a path built at runtime, and the failure mode is an ENOENT in production while everything works locally.

- [ ] **Step 1: Write the failing test**

Create `scripts/blog-precedence.test.cjs`:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadBlog({ filePosts = [], rows = null, error = null } = {}) {
  const source = fs.readFileSync(path.join(root, "src/lib/blog.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;

  const builder = {
    select: () => builder,
    eq: () => builder,
    order: async () => ({ data: rows, error }),
  };
  const overrides = {
    react: { cache: (fn) => fn },
    "@supabase/supabase-js": { createClient: () => ({ from: () => builder }) },
    // These keys must match the import specifiers in blog.ts exactly. That file
    // uses the @/lib path alias, which plain node cannot resolve, so the
    // override is what makes the module loadable at all — a mismatched key here
    // fails as an unresolved module, not as a silently un-mocked import.
    "@/lib/blogFiles": { getFilePosts: () => filePosts },
    "@/lib/editorialBlogPosts": { EDITORIAL_BLOG_POSTS: [] },
  };

  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports, console, process,
    require: (name) => (Object.hasOwn(overrides, name) ? overrides[name] : require(name)),
  }, { filename: "src/lib/blog.ts" });
  return module.exports;
}

const filePost = (slug, date) => ({
  slug, title: `File ${slug}`, description: "d", bodyMd: "b", coverImg: null,
  tags: [], author: "ClearFin Team",
  publishedAt: new Date(date).toISOString(), updatedAt: new Date(date).toISOString(),
});

test("file posts appear alongside the hardcoded fallbacks", async () => {
  const { getPosts } = loadBlog({ filePosts: [filePost("from-a-file", "2030-01-01")] });
  const slugs = (await getPosts()).map((p) => p.slug);
  assert.ok(slugs.includes("from-a-file"));
  assert.ok(slugs.includes("how-clearfin-helps"));
});

test("everything is sorted newest first", async () => {
  const { getPosts } = loadBlog({ filePosts: [filePost("newest", "2031-01-01")] });
  const posts = await getPosts();
  assert.equal(posts[0].slug, "newest");
  const dates = posts.map((p) => Date.parse(p.publishedAt));
  assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
});

test("a file post does not duplicate a hardcoded post with the same slug", async () => {
  const { getPosts } = loadBlog({ filePosts: [filePost("how-clearfin-helps", "2030-01-01")] });
  const matching = (await getPosts()).filter((p) => p.slug === "how-clearfin-helps");
  assert.equal(matching.length, 1);
  assert.equal(matching[0].title, "File how-clearfin-helps");
});

test("a database row still outranks a file post with the same slug", async () => {
  const { getPosts } = loadBlog({
    filePosts: [filePost("shared", "2030-01-01")],
    rows: [{
      slug: "shared", title: "From the database", description: "d", body_md: "b",
      cover_img: null, tags: [], author: "ClearFin Team",
      published_at: "2030-01-01T00:00:00.000Z", updated_at: "2030-01-01T00:00:00.000Z",
    }],
  });
  const matching = (await getPosts()).filter((p) => p.slug === "shared");
  assert.equal(matching.length, 1);
  assert.equal(matching[0].title, "From the database");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/blog-precedence.test.cjs`
Expected: FAIL — the first test fails because `blog.ts` does not import `./blogFiles`, so no file post reaches the output.

- [ ] **Step 3: Wire the loader into `getPosts`**

In `src/lib/blog.ts`, add the import beside the existing `editorialBlogPosts`
import, matching that file's `@/lib` alias style:

```ts
import { getFilePosts } from "@/lib/blogFiles";
```

Replace the `CODE_POSTS` constant at line 234 with:

```ts
/* Markdown files in content/blog/ outrank the hardcoded posts below them, and a
   database row (if the blog_posts table is ever populated and made readable)
   outranks both. */
const CODE_POSTS = [...EDITORIAL_BLOG_POSTS, ...FALLBACK_POSTS].sort(
  (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
);

function mergeBySlug(...sources: BlogPost[][]): BlogPost[] {
  const bySlug = new Map<string, BlogPost>();
  for (const source of sources) {
    for (const post of source) {
      if (!bySlug.has(post.slug)) bySlug.set(post.slug, post);
    }
  }
  return [...bySlug.values()].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}
```

Then replace the body of `getPosts` (lines 243-270) with:

```ts
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const filePosts = getFilePosts();
  const supabase = readClient();
  if (!supabase) return mergeBySlug(filePosts, CODE_POSTS);

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) console.error("getPosts blog_posts error:", error.message);

  const databasePosts = (!error && data ? (data as BlogPostRow[]) : []).map((row) => {
    const databasePost = fromRow(row);
    const codePost = CODE_POSTS.find((post) => post.slug === databasePost.slug);
    return codePost ? { ...codePost, ...databasePost } : databasePost;
  });

  return mergeBySlug(databasePosts, filePosts, CODE_POSTS);
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/blog-precedence.test.cjs`
Expected: PASS, 4 tests.

- [ ] **Step 5: Keep the markdown in the deployed bundle**

In `next.config.ts`, add to the `nextConfig` object, above `async redirects()`:

```ts
  /* The blog pages are ISR, so content/blog is read on the server when a page
     revalidates, not only at build time. The tracer does not follow a readdir
     on a runtime-built path, and the failure mode is ENOENT in production
     while local dev is fine. */
  outputFileTracingIncludes: {
    "/blog": ["content/blog/**/*.md"],
    "/blog/*": ["content/blog/**/*.md"],
  },
```

The keys are picomatch globs, so a literal `"/blog/[slug]"` would be read as a
character class matching one of `s`, `l`, `u`, `g` — the Next docs escape the
brackets for exactly this reason. `"/blog/*"` avoids the escaping entirely.

- [ ] **Step 6: Verify the build and the whole suite**

Run: `npm test && npm run build`
Expected: all tests pass; the build completes with no new warnings.

- [ ] **Step 7: Commit**

```bash
git add src/lib/blog.ts next.config.ts scripts/blog-precedence.test.cjs
git commit -m "feat(blog): serve markdown posts ahead of the hardcoded fallbacks"
```

---

### Task 3: Table of contents

**Files:**
- Create: `src/lib/blogToc.ts`
- Create: `scripts/blog-toc.test.cjs`
- Modify: `src/components/BlogPostArticle.tsx:97-115` (the `ReactMarkdown` call)
- Modify: `src/app/globals.css` (append a styles block)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `slugifyHeading(text: string): string`
  - `extractH2s(bodyMd: string): { id: string; text: string }[]`

Both the list and the headings must derive their ids from the same function or the links break. `ReactMarkdown` does not add heading ids on its own, so `BlogPostArticle` supplies an `h2` renderer that sets one.

- [ ] **Step 1: Write the failing test**

Create `scripts/blog-toc.test.cjs`:

```js
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
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
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

test("only h2 headings are collected", () => {
  const { extractH2s } = loadModule("src/lib/blogToc.ts");
  const md = "# Title\n\n## First\n\ntext\n\n### Nested\n\n## Second\n";
  assert.deepEqual(extractH2s(md), [
    { id: "first", text: "First" },
    { id: "second", text: "Second" },
  ]);
});

test("headings inside fenced code blocks are not collected", () => {
  const { extractH2s } = loadModule("src/lib/blogToc.ts");
  const md = "## Real\n\n```md\n## Not A Heading\n```\n\n## Also Real\n";
  assert.deepEqual(extractH2s(md).map((h) => h.text), ["Real", "Also Real"]);
});

test("duplicate headings get distinct ids", () => {
  const { extractH2s } = loadModule("src/lib/blogToc.ts");
  assert.deepEqual(extractH2s("## Fees\n\n## Fees\n").map((h) => h.id), ["fees", "fees-2"]);
});

test("a post with no h2s yields an empty list", () => {
  const { extractH2s } = loadModule("src/lib/blogToc.ts");
  assert.deepEqual(extractH2s("Just a paragraph.\n"), []);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/blog-toc.test.cjs`
Expected: FAIL — `src/lib/blogToc.ts` does not exist.

- [ ] **Step 3: Write the implementation**

Create `src/lib/blogToc.ts`:

```ts
/*
 * The contents list and the rendered headings must agree on ids, so both go
 * through slugifyHeading. ReactMarkdown does not add heading ids itself; the
 * h2 renderer in BlogPostArticle supplies them.
 */

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractH2s(bodyMd: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of bodyMd.replace(/\r\n/g, "\n").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[1].replace(/\s*#+\s*$/, "");
    const base = slugifyHeading(text);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    headings.push({ id: count === 1 ? base : `${base}-${count}`, text });
  }

  return headings;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/blog-toc.test.cjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Render the contents list and give the headings ids**

In `src/components/BlogPostArticle.tsx`, add the import:

```tsx
import { extractH2s, slugifyHeading } from "@/lib/blogToc";
```

Inside the component, above the returned JSX:

```tsx
  const headings = extractH2s(post.bodyMd);
```

Then replace the `<ReactMarkdown>` element (lines 97-115) with:

```tsx
        {headings.length > 2 && (
          <nav className="blog-toc" aria-label="On this page">
            <p className="blog-toc-label">On this page</p>
            <ol>
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children, ...props }) => {
              const text = Array.isArray(children)
                ? children.filter((child) => typeof child === "string").join("")
                : String(children ?? "");
              return <h2 id={slugifyHeading(text)} {...props}>{children}</h2>;
            },
            a: ({ href, children, ...props }) => {
              const external = href?.startsWith("http");
              return (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {post.bodyMd}
        </ReactMarkdown>
```

Note the duplicate-heading case: `extractH2s` appends `-2` to the second identical heading but the `h2` renderer cannot know the ordinal, so its id stays the base slug. Two identical H2s in one post is a content smell; the post shape in the spec does not produce them. Do not add ordinal tracking to the renderer for it.

- [ ] **Step 6: Style the contents list**

Append to `src/app/globals.css`:

```css
/* ─────────────────────────────────────────────
   Blog post table of contents
───────────────────────────────────────────── */
.blog-toc {
  margin: 0 0 32px;
  padding: 18px 22px;
  border: 1px solid rgba(28, 30, 26, .1);
  border-radius: 12px;
  background: #f9f9f6;
}
.blog-toc-label {
  margin: 0 0 10px;
  font-family: var(--font-jetbrains), monospace;
  font-size: 10px;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: #6b706a;
}
.blog-toc ol {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.blog-toc li { font-size: 14px; line-height: 1.45; }
.blog-toc a { color: #0066cc; text-decoration: none; }
.blog-toc a:hover { text-decoration: underline; }
```

- [ ] **Step 7: Verify in the browser**

Run: `npm run dev`, then open an existing post, for example
`http://localhost:3000/blog/best-credit-card-combination-canada`.
Expected: a contents list above the body; clicking an entry jumps to that heading.

- [ ] **Step 8: Run the whole suite and commit**

```bash
npm test
git add src/lib/blogToc.ts scripts/blog-toc.test.cjs src/components/BlogPostArticle.tsx src/app/globals.css
git commit -m "feat(blog): add a table of contents built from post headings"
```

---

### Task 4: Post — no foreign transaction fee cards

**Files:**
- Create: `content/blog/no-foreign-transaction-fee-credit-cards-canada.md`

**Interfaces:**
- Consumes: the loader from Task 1. No code changes.

**Verified against `card_catalog` on 2026-10-05.** Re-run every query before publishing; these numbers change.

FX fee distribution across all 122 cards:

| FX fee | Cards |
| --- | --- |
| 0% | 5 |
| 1.5% | 2 |
| 2.5% | 108 |
| 2.9% | 3 |
| 3.0% | 3 |
| not recorded | 1 |

The five cards that charge nothing:

| id | Card | Issuer | Annual fee | Program | Min income |
| --- | --- | --- | --- | --- | --- |
| `scotia-gold` | Scotia Gold Amex | Scotiabank | $120 | Scene+ | $12,000 |
| `scotia-passport` | Scotia Passport Visa Infinite + | Scotiabank | $150 | Scene+ | $60,000 |
| `wealthsimple` | Wealthsimple Card | Wealthsimple | $240 | Cash Back | $150,000 |
| `scotia-platinum` | Scotiabank Platinum Amex | Scotiabank | $399 | Scene+ | $12,000 |
| `scotia-passport-privilege` | Scotia Passport Visa Infinite Privilege | Scotiabank | $599 | Scene+ | $150,000 |

The angle: **four of the five are Scotiabank.** On this question Scotiabank is effectively the only Canadian bank competing, and the only non-bank option is Wealthsimple. The second angle is the tail nobody writes about — **six cards charge more than the standard 2.5%**.

Required H2s, in order:

1. `## The Short Answer`
2. `## What the 2.5% FX Fee Actually Costs`  — the worked example
3. `## Every Card in Canada With No FX Fee`  — the five-card table
4. `## Why Four of the Five Are Scotiabank`
5. `## The Cards That Charge More Than 2.5%`
6. `## Does the Annual Fee Cancel Out the Savings?`  — break-even
7. `## Who Shouldn't Bother`

- [ ] **Step 1: Re-verify the data**

```sql
select id, name, issuer, annual_fee, fx_fee, reward_program, min_income_personal
from card_catalog where fx_fee = 0 order by annual_fee;

select fx_fee, count(*) from card_catalog group by fx_fee order by fx_fee nulls last;
```

If any figure differs from the tables above, the post uses the new numbers and this plan is stale, not the database.

- [ ] **Step 2: Resolve the Wealthsimple annual fee before writing**

The catalog records `$240` for `wealthsimple`. A fee inconsistency for this card between the chatbot and the calculator is a known open issue in this project, and $240 matches Wealthsimple's **Premium subscription tier**, not a card annual fee. Confirm against `bank_url` what the $240 represents.

If it is a subscription rather than a card fee, do not print it in the annual-fee column unqualified — the post says so in words. Getting this wrong on a post arguing about costs undermines the whole piece.

- [ ] **Step 3: Write the worked example**

Use a realistic profile and state it: **$6,000 of foreign-currency spend a year** — roughly a two-week trip plus regular USD subscriptions and online orders.

- 2.5% on $6,000 = **$150 a year** in FX fees alone.
- Against Scotia Gold Amex at $120: the fee saving alone covers the annual fee with $30 left, before counting any rewards.
- Against a 3.0% card: **$180 a year**, a $30 penalty versus the standard card for the same spending.

Show the arithmetic in the post. Do not assert a conclusion without it.

- [ ] **Step 4: Write the file**

Create `content/blog/no-foreign-transaction-fee-credit-cards-canada.md` with frontmatter:

```markdown
---
title: Credit Cards With No Foreign Transaction Fees in Canada
description: Only five of the 122 cards we track waive the 2.5% foreign transaction fee — and four of them come from the same bank.
tags: [travel, fees]
publishedAt: 2026-10-05
---
```

Then the body, following the H2 list above and every Global Constraint — notably 1200–1600 words, each card linked to `/credit-cards/<id>`, the data dated, merit order, and no cents-per-point claims.

- [ ] **Step 5: Check it renders**

Run: `npm run dev` and open
`http://localhost:3000/blog/no-foreign-transaction-fee-credit-cards-canada`.
Expected: the post renders, the contents list shows the seven H2s, the table has borders and the card links resolve to real detail pages.

- [ ] **Step 6: Verify every internal link**

```bash
for id in scotia-gold scotia-passport wealthsimple scotia-platinum scotia-passport-privilege; do
  printf '%s -> ' "$id"
  curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000/credit-cards/$id"
done
```

Expected: `200` for all five.

- [ ] **Step 7: Commit**

```bash
git add content/blog/no-foreign-transaction-fee-credit-cards-canada.md
git commit -m "content(blog): no foreign transaction fee credit cards in canada"
```

---

### Task 5: Post — earn rate caps

**Files:**
- Create: `content/blog/credit-card-earn-rate-caps-canada.md`

**Interfaces:**
- Consumes: the loader from Task 1. No code changes.

**Verified against `card_catalog` on 2026-10-05:** of 122 cards, **63 carry structured cap entries** and **59 have notes only**. Across those entries the writers used **45 distinct JSON keys** — `cap_amount_cad`, `spend_limit_cad`, `value`, `cap_period`, `period`, `effect_after_cap`, `after_cap_rate` and so on. There is no uniform schema.

**This means the table cannot be generated mechanically.** It is hand-assembled by reading the rows. Scope the post to **10–15 cards with a hard, clearly stated dollar cap** rather than attempting all 63 — a short accurate table beats a long shaky one.

Three confirmed examples to anchor it:

| id | Card | Cap |
| --- | --- | --- |
| `nbc-echo` | National Bank ECHO Cashback Mastercard | 1.5% on gas, grocery and online, first **$25,000/year**, then 1% |
| `nbc-world-elite` | National Bank World Elite Mastercard | 5 pts/$1 on groceries and restaurants, first **$2,500/month**, then 2 pts |
| `triangle-world-elite` | Triangle World Elite Mastercard | 3% CT Money on groceries, first **$12,000/year**, then 1% (excludes Costco and Walmart) |

The angle: a headline rate is a rate *up to a number*, and the advertised figure is what gets compared while the cap is what decides the actual return. A $2,500 monthly grocery cap binds on a large family; a $25,000 annual cap rarely binds at all. Same "5%", different outcomes.

Required H2s, in order:

1. `## The Short Answer`
2. `## What an Earn Rate Cap Is`
3. `## The Caps Worth Knowing About`  — the hand-built table
4. `## Monthly Caps Bite Harder Than Annual Ones`  — the worked example
5. `## The Cards That Don't Cap at All`
6. `## How to Tell Whether a Cap Will Affect You`
7. `## When a Capped Card Still Wins`

- [ ] **Step 1: Pull the candidate rows**

```sql
select id, name, annual_fee, jsonb_pretty(earn_caps) as caps
from card_catalog
where jsonb_array_length(coalesce(earn_caps->'reward_caps','[]'::jsonb)) > 0
order by name;
```

Read them and choose the 10–15 with an unambiguous dollar cap. Skip anything whose cap is described as `not_disclosed`, `variable` or `event_based` — those belong in the prose, not the table.

- [ ] **Step 2: Identify the genuinely uncapped cards**

```sql
select id, name, annual_fee, earn_caps->>'notes' as notes
from card_catalog
where jsonb_array_length(coalesce(earn_caps->'reward_caps','[]'::jsonb)) = 0
order by name;
```

`notes` saying no caps are disclosed is not the same as a card having none — section 5 says "no published cap", never "no cap".

- [ ] **Step 3: Write the worked example**

Compare a $2,500/month cap against a $25,000/year cap for a household spending **$1,200 a month on groceries**:

- Against the monthly cap: never binds. Full accelerated rate all year.
- At **$3,000 a month**: $500 a month over the cap, so $6,000 a year drops to the base rate. At 5 pts versus 2 pts that is 18,000 points a year of difference.

State the spend profile, show the arithmetic, and do not convert points to dollars — the Global Constraints forbid cents-per-point claims.

- [ ] **Step 4: Write the file**

Create `content/blog/credit-card-earn-rate-caps-canada.md`:

```markdown
---
title: Which Credit Card Bonus Categories Stop Paying in Canada
description: A headline earn rate is a rate up to a number. Here are the caps across the 122 cards we track, and when they actually bite.
tags: [rewards, fine-print]
publishedAt: 2026-10-05
---
```

Body follows the H2 list and every Global Constraint.

- [ ] **Step 5: Check it renders and verify the links**

Run `npm run dev`, open
`http://localhost:3000/blog/credit-card-earn-rate-caps-canada`, then check
every `/credit-cards/<id>` the post links to returns `200`, as in Task 4 Step 6.

- [ ] **Step 6: Run the whole suite, build, and commit**

```bash
npm test && npm run build
git add content/blog/credit-card-earn-rate-caps-canada.md
git commit -m "content(blog): which credit card bonus categories stop paying"
```

---

## Out of scope

Recorded so they are not picked up mid-implementation:

- **`blog_posts` RLS.** The table has RLS enabled with no policies and cannot serve. Task 2 keeps the database branch for when that is fixed; fixing it is not part of this work.
- **`benefits` and `network` backfill.** `benefits` is `{}` on all 122 cards and `network` is null on 102. Both need a data pass before any post can use them.
- **The duplicate rendering of the two editorial posts** at both `/blog/<slug>` and their top-level `path`.
- **Migrating the five existing posts to markdown files.** They keep working as they are.

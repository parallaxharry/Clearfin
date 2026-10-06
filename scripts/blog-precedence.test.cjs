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
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
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

  // readClient() returns null without these, which would silently skip the
  // database branch and make every precedence test pass for the wrong reason.
  // Placeholder values: the supabase client is mocked above and never dials out.
  const env = {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  };

  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    module, exports: module.exports, console, process: { ...process, env },
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
  const slugs = Array.from(await getPosts(), (p) => p.slug);
  assert.ok(slugs.includes("from-a-file"));
  assert.ok(slugs.includes("how-clearfin-helps"));
});

test("everything is sorted newest first", async () => {
  const { getPosts } = loadBlog({ filePosts: [filePost("newest", "2031-01-01")] });
  const posts = await getPosts();
  assert.equal(posts[0].slug, "newest");
  const dates = Array.from(posts, (p) => Date.parse(p.publishedAt));
  assert.deepEqual(dates, [...dates].sort((a, b) => b - a));
});

test("a file post does not duplicate a hardcoded post with the same slug", async () => {
  const { getPosts } = loadBlog({ filePosts: [filePost("how-clearfin-helps", "2030-01-01")] });
  const matching = Array.from(await getPosts()).filter((p) => p.slug === "how-clearfin-helps");
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
  const matching = Array.from(await getPosts()).filter((p) => p.slug === "shared");
  assert.equal(matching.length, 1);
  assert.equal(matching[0].title, "From the database");
});

test("a failed database query does not hide the file posts", async () => {
  const { getPosts } = loadBlog({
    filePosts: [filePost("still-here", "2030-01-01")],
    error: { message: "permission denied" },
  });
  const slugs = Array.from(await getPosts(), (p) => p.slug);
  assert.ok(slugs.includes("still-here"));
  assert.ok(slugs.includes("how-clearfin-helps"));
});

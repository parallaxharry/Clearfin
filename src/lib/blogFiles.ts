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

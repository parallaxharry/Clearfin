import { BLOG_ARTWORK } from "@/lib/blogArtwork";

/** Consistent editorial artwork across listing, sharing and article views. */
export function resolveBlogCover(slug: string, coverImg?: string | null): string | undefined {
  return BLOG_ARTWORK[slug]?.cover ?? coverImg ?? undefined;
}

/*
 * Heading ids for markdown posts.
 *
 * The on-page rail (SeoTableOfContents) already builds itself from
 * ".seo-content > h2" and will assign ids client-side when a heading has none.
 * Rendering them on the server instead means the anchors exist in the static
 * HTML, so deep links work on first paint and a crawler can see them — and
 * that component uses `heading.id || slugify(...)`, so a server-rendered id
 * wins and the two stay consistent.
 */

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

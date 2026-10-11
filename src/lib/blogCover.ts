const STOCK_BLOG_COVERS: Record<string, string> = {
  "cash-back-calculator-canada":
    "https://images.pexels.com/photos/10020082/pexels-photo-10020082.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "best-credit-card-for-costco-canada":
    "https://images.pexels.com/photos/11835351/pexels-photo-11835351.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "best-credit-card-for-recurring-bills-canada":
    "https://images.pexels.com/photos/22046261/pexels-photo-22046261.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "is-credit-card-annual-fee-worth-it-canada":
    "https://images.pexels.com/photos/7821905/pexels-photo-7821905.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "best-gas-credit-card-canada":
    "https://images.pexels.com/photos/29370541/pexels-photo-29370541.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

/**
 * The September SEO cluster uses editorial stock photography to match the
 * visual language of the rest of the ClearFin blog. The source photographs
 * are free-to-use Pexels images; all other posts keep their existing artwork.
 */
export function resolveBlogCover(
  slug: string,
  coverImg?: string | null,
): string | undefined {
  return STOCK_BLOG_COVERS[slug] ?? coverImg ?? undefined;
}

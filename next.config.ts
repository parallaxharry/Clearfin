import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The blog pages are ISR, so content/blog is read on the server when a page
     revalidates, not only at build time. The tracer does not follow a readdir
     on a runtime-built path, and the failure mode is ENOENT in production
     while local dev is fine. Keys are picomatch globs — "/blog/[slug]" would
     read as a character class, hence "/blog/*". */
  outputFileTracingIncludes: {
    "/blog": ["content/blog/**/*.md"],
    "/blog/*": ["content/blog/**/*.md"],
  },

  async redirects() {
    return [
      // The combination guide lives under /blog since 2026-08-10; older URLs follow it.
      {
        source: "/blog/two-card-strategy-canada",
        destination: "/blog/best-credit-card-combination-canada",
        permanent: true,
      },
      {
        source:
          "/best-credit-card-combination-in-canada-for-2026-how-to-pair-two-cards-for-maximum-rewards",
        destination: "/blog/best-credit-card-combination-canada",
        permanent: true,
      },
      // Compare moved from the home #compare section to its own page (2026-07-10).
      // Old shared links /?compare=a,b keep working; the query passes through.
      {
        source: "/",
        has: [{ type: "query", key: "compare" }],
        destination: "/compare-credit-cards-canada",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

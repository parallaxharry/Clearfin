import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Post replaced by the richer combination guide (2026-07-10).
      {
        source: "/blog/two-card-strategy-canada",
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

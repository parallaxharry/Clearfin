import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Consolidate older combination posts into the reviewed 2026 guide.
      {
        source: "/blog/two-card-strategy-canada",
        destination:
          "/best-credit-card-combination-in-canada-for-2026-how-to-pair-two-cards-for-maximum-rewards",
        permanent: true,
      },
      {
        source: "/blog/best-credit-card-combination-canada",
        destination:
          "/best-credit-card-combination-in-canada-for-2026-how-to-pair-two-cards-for-maximum-rewards",
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

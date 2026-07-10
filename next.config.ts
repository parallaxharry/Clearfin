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
    ];
  },
};

export default nextConfig;

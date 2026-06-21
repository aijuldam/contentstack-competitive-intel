import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // Permanent redirect from old Vercel preview URL to canonical domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "gt-mtaste.vercel.app" }],
        destination: "https://gtmtaste.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

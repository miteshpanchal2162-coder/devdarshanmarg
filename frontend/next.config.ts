import type { NextConfig } from "next";

const apiHost = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiHost.startsWith("https") ? "https" : "http",
        hostname: new URL(apiHost).hostname,
        pathname: "/public/media/**",
      },
    ],
  },
};

export default nextConfig;

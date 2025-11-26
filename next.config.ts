import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**", // ✅ Must use /** to match all paths
      },
    ],
  },
};

export default nextConfig;


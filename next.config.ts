import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@remotion/renderer"],
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

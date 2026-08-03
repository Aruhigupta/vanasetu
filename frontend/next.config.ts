import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io", "images.unsplash.com"],
  },
};

export default nextConfig;

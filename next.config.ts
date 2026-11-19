import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

export default nextConfig;

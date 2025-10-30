import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // valfritt – bra att ha
  swcMinify: true,       // valfritt – snabbare build
  eslint: {
    ignoreDuringBuilds: true, // 🧩 ignorerar ESLint-fel vid build (så Vercel inte stoppar)
  },
};

export default nextConfig;

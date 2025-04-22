import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Prevent duplicate WalletConnect initializations 
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Setting up React strict mode to prevent double initialization
  reactStrictMode: false,
};

export default nextConfig;

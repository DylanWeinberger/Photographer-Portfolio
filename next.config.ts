import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from Sanity CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;

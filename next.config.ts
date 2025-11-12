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
    // Enable modern image formats for better performance
    // AVIF provides ~50% smaller files than WebP
    // WebP provides ~30% smaller files than JPEG
    // Fallback to JPEG for older browsers
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

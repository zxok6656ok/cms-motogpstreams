import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.bp.blogspot.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
        {
        protocol: "https",
        hostname: "nekopoi.care",
      },
    ],
  },
};

export default nextConfig;

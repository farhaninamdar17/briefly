import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.thehindu.com",
      },
      {
        protocol: "https",
        hostname: "**.reuters.com",
      },
      {
        protocol: "https",
        hostname: "**.indianexpress.com",
      },
      {
        protocol: "https",
        hostname: "**.ndma.gov.in",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.cdn1.buscalibre.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.cdn2.buscalibre.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.cdn3.buscalibre.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

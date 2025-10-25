import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.cdn2.buscalibre.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

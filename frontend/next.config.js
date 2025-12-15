/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.cdn*.buscalibre.com',
      },
      {
        protocol: 'https',
        hostname: 'naruto-official.com',
      },
    ],
  },
};

module.exports = nextConfig;
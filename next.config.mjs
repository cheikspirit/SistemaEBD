import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = async (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: isDev ? undefined : 'export',
    distDir: isDev ? '.next_dev' : 'dist',
    reactStrictMode: false,
    transpilePackages: ['motion'],
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ui-avatars.com',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
        {
          protocol: 'https',
          hostname: '**.supabase.co',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      ],
    },
  };
};

export default nextConfig;

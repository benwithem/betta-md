import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import { resolve } from 'path';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mantine/core': resolve(process.cwd(), 'node_modules/@mantine/core'),
      '@mantine/hooks': resolve(process.cwd(), 'node_modules/@mantine/hooks'),
      '@app': resolve(process.cwd(), 'app'),
    };

    return config;
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  },
};

export default nextConfig;

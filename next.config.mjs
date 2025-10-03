/** @type {import('next').NextConfig} */
export default {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

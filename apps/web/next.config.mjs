/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;

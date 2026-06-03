import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // <-- IS LINE KO COMMENT OUT YA DELETE KAR DEIN
  reactStrictMode: true,
  images: { unoptimized: true },
  turbopack: {},
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
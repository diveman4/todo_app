import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // コンテナ間通信のため、/api/* へのリクエストをバックエンドコンテナに転送
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://backend:3001'}/:path*`,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // バックエンドAPIへのリクエストを転送
  // 環境変数 BACKEND_URL または NEXT_PUBLIC_BACKEND_URL を優先
  // 開発環境（Docker）では 'http://backend:3001' を使用
  async rewrites() {
    const backendUrl = 
      process.env.BACKEND_URL || 
      process.env.NEXT_PUBLIC_BACKEND_URL || 
      'http://backend:3001';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

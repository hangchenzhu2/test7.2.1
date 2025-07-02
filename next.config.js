/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/replicate/paint-by-text",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js/paint-by-text",
        permanent: false,
      },
    ]
  },
  
  // 重写规则以支持自定义多语言路由
  async rewrites() {
    return [
      // 确保根路径重定向到英语版本
      {
        source: "/",
        destination: "/en",
      },
    ]
  },
};

module.exports = nextConfig;

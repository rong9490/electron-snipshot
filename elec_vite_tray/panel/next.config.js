/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: '../dist_panel',
  images: {
    unoptimized: true
  },
  // 移除 basePath 和 assetPrefix，因为 NestJS 会处理路径前缀
  trailingSlash: true
}

module.exports = nextConfig

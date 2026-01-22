/** @type {import('next').NextConfig} */
const nextConfig = {
  // 仅在生产环境使用静态导出
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  // 仅在生产环境使用自定义输出目录
  distDir: process.env.NODE_ENV === 'production' ? '../dist_panel' : undefined,
  images: {
    unoptimized: true
  },
  // 移除 basePath 和 assetPrefix，因为 NestJS 会处理路径前缀
  trailingSlash: true
}

module.exports = nextConfig

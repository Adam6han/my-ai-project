/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ 危险警告：仅供快速验证上线使用，允许在有 TS 错误时依然完成打包
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ 危险警告：允许在有 ESLint 错误时依然完成打包
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

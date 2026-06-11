/** @type {import('next').NextConfig} */
const apiServerOrigin =
  process.env.API_PROXY_TARGET ??
  process.env.API_INTERNAL_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3001";

const nextConfig = {
  // 允许用 127.0.0.1 / 局域网 IP 访问 dev 时加载 _next 静态资源，避免客户端 JS 未执行而卡在登录校验
  allowedDevOrigins: ["127.0.0.1", "192.168.0.51", "localhost"],
  experimental: {
    externalDir: true
  },
  async rewrites() {
    const target = apiServerOrigin.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`
      }
    ];
  }
};

export default nextConfig;

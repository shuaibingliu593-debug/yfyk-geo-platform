import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true
  },
  async redirects() {
    return [
      { source: "/cases/geo-native-website", destination: "/cases", permanent: true },
      { source: "/cases/website-ai-retrofit", destination: "/cases", permanent: true },
      { source: "/cases/knowledge-base", destination: "/cases", permanent: true },
      { source: "/cases/showcase", destination: "/cases", permanent: true },
      { source: "/solutions/cases", destination: "/cases", permanent: true },
      { source: "/services/upgrade", destination: "/ai-friendly-upgrade", permanent: true },
      { source: "/services/products/ai-enterprise-site", destination: "/geo-native-website#ai-enterprise-site", permanent: true },
      { source: "/services/products/ai-brand-site", destination: "/geo-native-website#ai-brand-site", permanent: true },
      { source: "/services/products/ai-global-site", destination: "/geo-native-website#ai-global-site", permanent: true },
      { source: "/services/knowledge-source", destination: "/enterprise-knowledge-base", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ];
  },
};

export default nextConfig;

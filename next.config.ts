import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  async rewrites() {
    return [
      { source: "/404.html", destination: "/404" },
      { source: "/crm.html", destination: "/crm" },
      { source: "/crm/index.html", destination: "/crm" },
      { source: "/admin-panel/index.html", destination: "/admin-panel" },
      { source: "/ai-itinerary/index.html", destination: "/ai-itinerary" },
      { source: "/invoice-maker/index.html", destination: "/invoice-maker" },
    ];
  },
};

export default nextConfig;

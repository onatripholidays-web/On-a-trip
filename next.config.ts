import type { NextConfig } from "next";

const securityHeaders = [
  {key:"X-Content-Type-Options",value:"nosniff"},
  {key:"X-Frame-Options",value:"DENY"},
  {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
  {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
  {key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains; preload"},
  {key:"Cross-Origin-Opener-Policy",value:"same-origin-allow-popups"},
  {key:"Cross-Origin-Resource-Policy",value:"same-site"}
];

const nextConfig: NextConfig = {
  poweredByHeader:false,
  reactStrictMode:true,
  compress:true,
  async headers(){ return [{source:"/(.*)",headers:securityHeaders}]; }
};

export default nextConfig;

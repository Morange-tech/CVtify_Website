import type { NextConfig } from "next";

const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const backendUrl = new URL(backendOrigin);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: "/storage/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Exclude /api/auth/* (handled locally by next-auth) from the Laravel proxy
        source: "/api/:path((?!auth/).*)",
        destination: `${backendOrigin}/api/:path`,
      },
    ];
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingExcludes: {
    "*": ["./.private/**/*", "./.env*", "./.tmp/**/*", "./tests/**/*"],
  },
};

export default nextConfig;

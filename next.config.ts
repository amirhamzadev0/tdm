import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
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

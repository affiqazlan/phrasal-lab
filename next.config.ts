import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/phrasal-lab",
  assetPrefix: "/phrasal-lab/",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

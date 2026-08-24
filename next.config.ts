import type { NextConfig } from "next";
import { dirname } from "path";

const blobUrl = process.env.BLOB_BASE_URL ? new URL(process.env.BLOB_BASE_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: blobUrl
      ? [
          {
            protocol: blobUrl.protocol.replace(":", "") as "http" | "https",
            hostname: blobUrl.hostname,
            port: blobUrl.port,
            pathname: "/**",
          },
        ]
      : [],
  },
  turbopack: {
    root: dirname(__filename)
  }
};

export default nextConfig;

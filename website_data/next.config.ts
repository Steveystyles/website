import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // TheSportsDB artwork CDN (badges, crests, etc.)
      { protocol: "https", hostname: "www.thesportsdb.com" },
      { protocol: "https", hostname: "r2.thesportsdb.com" },
    ],
  },
}

export default nextConfig

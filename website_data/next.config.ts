import type { NextConfig } from "next"

// Next.js configuration for this project.
//
// TheSportsDB returns crest and badge URLs on a variety of subdomains.
// Without whitelisting these hosts, Next.js will throw an exception at
// runtime and the components that rely on team crests will fail to render.

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Primary domains for API‑served images
      {
        protocol: "https",
        hostname: "www.thesportsdb.com",
      },
      {
        protocol: "https",
        hostname: "thesportsdb.com",
      },
      // Images are served from Cloudflare R2 storage on the `r2` subdomain.
      // Example: https://r2.thesportsdb.com/images/media/team/badge/xxxxx.png
      {
        protocol: "https",
        hostname: "r2.thesportsdb.com",
      },
      // Some endpoints (e.g. lookupteam.php) return URLs from the `v2` subdomain.
      // Example: https://v2.thesportsdb.com/images/media/team/badge/xxxxx.png
      {
        protocol: "https",
        hostname: "v2.thesportsdb.com",
      },
    ],
  },
}

export default nextConfig

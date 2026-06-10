import type { NextConfig } from "next";

/**
 * Static-export config — the landing is content-only, so we ship it as
 * pure HTML/CSS/JS that any static host (Vercel, Netlify, Cloudflare
 * Pages, S3) can serve. Set `WWXD_APP_URL` at build time to point CTAs
 * at the right place if you're running your own instance of the chat app.
 */
const nextConfig: NextConfig = {
  output: "export",
  turbopack: { root: __dirname },
};

export default nextConfig;

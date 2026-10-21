import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Payload CMS backend (separate app). Server-side only — never NEXT_PUBLIC_.
const CMS_URL = (process.env.CMS_URL || "http://localhost:3001").replace(/\/+$/, "");

// Baseline security headers for every route.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // CMS media: `/api/media/file/*` (proxied to the CMS, see rewrites) in dev,
    // Vercel Blob in production.
    localPatterns: [
      { pathname: "/api/media/file/**" },
      { pathname: "/logo.png" },
      { pathname: "/events/**" },
      // Static home-page sections (उद्देश्य / Vision).
      { pathname: "/home/**" },
      // Static media for snapshot ("frontend only") deploys.
      { pathname: "/media/**" },
    ],
    // Pin to OUR Blob store (BLOB_STORE_HOSTNAME, e.g. abc123.public.blob.vercel-storage.com).
    remotePatterns: process.env.BLOB_STORE_HOSTNAME
      ? [{ protocol: "https", hostname: process.env.BLOB_STORE_HOSTNAME }]
      : [],
  },
  async redirects() {
    // Pillar slugs were renamed in the CMS on 18 Oct 2026; keep the old URLs
    // working (rules.md: a slug change needs a redirect). Temporary (307) in
    // case the CMS slugs change again.
    return [
      { source: "/shiksha", destination: "/education", permanent: false },
      { source: "/swasthya", destination: "/healthcare", permanent: false },
      { source: "/swavalamban", destination: "/selfreliance", permanent: false },
      { source: "/samajik", destination: "/socialharmony", permanent: false },
    ];
  },
  async rewrites() {
    // Serve CMS-hosted media files same-origin (mediaUrl() makes them relative).
    return [{ source: "/api/media/file/:path*", destination: `${CMS_URL}/api/media/file/:path*` }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    // Pin the workspace root to this app so stray lockfiles in parent
    // directories (repo root, home) are not picked up.
    root: dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

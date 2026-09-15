/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      // Stock placeholders still standing in for real product photography.
      // Removable once /admin/products reports zero placeholders left.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Images uploaded through the admin land in Vercel Blob.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            // Disable powerful features we don't use
            value:
              "geolocation=(), camera=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "Content-Security-Policy",
            // Conservative but backwards-compatible CSP.
            // Note: this may need tuning if you add new external scripts.
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
              "style-src 'self' 'unsafe-inline' https:;",
              "img-src 'self' https: data: blob:;",
              "connect-src 'self' https:;",
              // MapLibre decodes vector tiles in a web worker created from a
              // blob: URL (and our self-hosted /maplibre-gl-worker.mjs). Without
              // worker-src this falls back to default-src 'self', the worker is
              // refused, and the map renders as a black canvas with no tiles.
              "worker-src 'self' blob:;",
              "child-src 'self' blob:;",
              "font-src 'self' https: data:;",
              "frame-ancestors 'self';",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;


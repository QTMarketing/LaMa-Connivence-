/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow marketing/hero images from Unsplash and similar hosts
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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


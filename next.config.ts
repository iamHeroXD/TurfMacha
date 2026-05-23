import type { NextConfig } from "next";
// @ts-expect-error — next-pwa has no official TypeScript types for the config wrapper
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + Razorpay + PostHog + Firebase inline/eval needed by some libs
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://app.posthog.com https://www.googletagmanager.com https://*.firebaseapp.com",
              // Styles: self + Google Fonts + inline styles (Tailwind CSS-in-JS)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + Supabase + Unsplash + Picsum + Pravatar + data URIs
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://picsum.photos https://i.pravatar.cc",
              // Connect: Supabase + Razorpay + PostHog + Firebase + Upstash + MSG91
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://app.posthog.com https://*.firebaseio.com https://*.upstash.io https://api.msg91.com",
              // Frames: Razorpay payment gateway
              "frame-src https://api.razorpay.com https://checkout.razorpay.com",
              // Workers: service worker for PWA
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "supabase-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 300 },
      },
    },
    {
      urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "unsplash-images",
        expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "google-fonts-stylesheets" },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: { maxEntries: 30, maxAgeSeconds: 604800 },
      },
    },
  ],
})(nextConfig);

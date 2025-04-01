// next.config.js or next.config.ts
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable in development
  register: true, // Register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration
};

module.exports = withPWA(nextConfig);

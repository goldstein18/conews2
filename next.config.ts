import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cultureowl-api-upload.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
    minimumCacheTTL: 0, // Don't cache S3 images (they have expiring pre-signed URLs)
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              process.env.NODE_ENV === 'development'
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://challenges.cloudflare.com" // Allow Cloudflare Turnstile + blob scripts in development
                : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com", // Allow Cloudflare Turnstile in production
              "style-src 'self' 'unsafe-inline'", // Tailwind CSS requires unsafe-inline
              "img-src 'self' data: blob: https://*.amazonaws.com https://images.unsplash.com", // Allow S3 images and Unsplash
              "font-src 'self'",
              "connect-src 'self' https://*.sentry.io https://*.amazonaws.com https://challenges.cloudflare.com", // Allow Turnstile verification
              "worker-src 'self' blob: data:", // FilePond requires worker-src with blob and data support
              "frame-src https://challenges.cloudflare.com", // Allow Turnstile iframe
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : [])
            ].join('; '),
          },
          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // X-XSS-Protection (legacy, but good for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Strict Transport Security (only in production with HTTPS)
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }] : []),
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()'
            ].join(', '),
          },
        ],
      },
    ];
  },
  // Ensure external packages work correctly
  serverExternalPackages: ['jose'],
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  automaticVercelMonitors: true,
});
// ─────────────────────────────────────────────────────────────────────────────
// PostHog browser integration stub
//
// When ready to activate:
// 1. npm install posthog-js
// 2. Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST in .env.local
// 3. Import PostHogProvider from 'posthog-js/react' in AnalyticsProvider
// 4. Replace stubs in src/lib/analytics/client.ts with posthog.capture() calls
// ─────────────────────────────────────────────────────────────────────────────

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";

export const POSTHOG_CLIENT_OPTIONS = {
  api_host: POSTHOG_HOST,
  // Disable autocapture — we track everything manually for precision.
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  persistence: "localStorage+cookie" as const,
  cross_subdomain_cookie: false,
  // Opt out in development so local events don't pollute production.
  loaded: (ph: { opt_out_capturing: () => void }) => {
    if (process.env.NODE_ENV !== "production") ph.opt_out_capturing();
  },
} as const;

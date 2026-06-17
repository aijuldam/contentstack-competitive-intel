"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AnalyticsProvider
//
// Wraps the app to initialize client-side analytics on mount.
// Mount once in the root layout (app/layout.tsx).
//
// PostHog activation steps:
//   1. npm install posthog-js
//   2. Add NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST to .env.local
//   3. Import { PostHogProvider } from 'posthog-js/react'
//   4. Import { POSTHOG_KEY, POSTHOG_CLIENT_OPTIONS } from
//        "@/lib/analytics/posthog/client"
//   5. Replace the stub body with:
//      <PostHogProvider apiKey={POSTHOG_KEY} options={POSTHOG_CLIENT_OPTIONS}>
//        {children}
//      </PostHogProvider>
// ─────────────────────────────────────────────────────────────────────────────

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Stub — replace with PostHogProvider when ready.
  return <>{children}</>;
}

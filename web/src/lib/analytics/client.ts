"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Client-side analytics
//
// Use in: Client Components ("use client") and hooks.
// Never import in Server Components — use src/lib/analytics/server.ts instead.
//
// PostHog JS integration: see src/lib/analytics/posthog/client.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { EventProperties } from "./properties";

/**
 * Track a client-side event (button click, page view, etc.)
 */
export function track(event: string, props?: EventProperties): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics:client]", event, props);
  }
  // window.posthog?.capture(event, props);
}

/**
 * Identify the logged-in user with traits client-side.
 * Called once on app load via AnalyticsIdentity.
 */
export function identify(userId: string, traits: EventProperties): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics:identify:client]", userId, traits);
  }
  // window.posthog?.identify(userId, traits);
}

/**
 * Associate the current user with a group (workspace).
 */
export function group(groupType: string, groupKey: string, properties?: EventProperties): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics:group:client]", { groupType, groupKey, properties });
  }
  // window.posthog?.group(groupType, groupKey, properties);
}

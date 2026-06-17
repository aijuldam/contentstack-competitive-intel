// ─────────────────────────────────────────────────────────────────────────────
// Server-side analytics
//
// Use in: Server Components, Server Actions, API Routes.
// Do NOT import in client components — use src/lib/analytics/client.ts instead.
//
// PostHog Node SDK integration: see src/lib/analytics/posthog/server.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { EventProperties } from "./properties";

/**
 * Track an event server-side.
 * @param event  Fixed event name from E (see events.ts)
 * @param props  Serialisable key-value properties
 * @param userId Supabase user ID (optional — omit when not available)
 */
export function track(
  event: string,
  props?: EventProperties,
  userId?: string
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics:server]", event, { userId, ...props });
  }
  // ── PostHog Node SDK (uncomment when ready) ──────────────────────────────
  // import { getPosthogServer } from "./posthog/server";
  // const ph = getPosthogServer();
  // ph.capture({ distinctId: userId ?? "server", event, properties: props });
  // ── Segment (alternate) ──────────────────────────────────────────────────
  // analytics.track({ userId: userId ?? "server", event, properties: props });
}

/**
 * Identify a user with traits server-side.
 * Call after signup/login and whenever plan changes.
 */
export function identify(userId: string, traits: EventProperties): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics:identify:server]", userId, traits);
  }
  // const ph = getPosthogServer();
  // ph.identify({ distinctId: userId, properties: traits });
}

/**
 * Associate a user with a group (workspace) server-side.
 */
export function group(
  userId: string,
  groupType: string,
  groupKey: string,
  properties?: EventProperties
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics:group:server]", { userId, groupType, groupKey, properties });
  }
  // const ph = getPosthogServer();
  // ph.groupIdentify({ distinctId: userId, groupType, groupKey, groupProperties: properties });
}

// ─────────────────────────────────────────────────────────────────────────────
// PostHog server-side (Node) integration stub
//
// When ready to activate:
// 1. npm install posthog-node
// 2. Set POSTHOG_KEY in .env.local (server-only — no NEXT_PUBLIC prefix)
// 3. Uncomment the PostHog client below and replace stubs in server.ts
// ─────────────────────────────────────────────────────────────────────────────

export const POSTHOG_SERVER_KEY = process.env.POSTHOG_KEY ?? "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";

/*
import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

// Returns a singleton PostHog client for server-side capture.
// Call ph.shutdown() at the end of long-lived processes or lambda handlers.
export function getPosthogServer(): PostHog {
  if (!_client) {
    _client = new PostHog(POSTHOG_SERVER_KEY, { host: POSTHOG_HOST });
  }
  return _client;
}
*/

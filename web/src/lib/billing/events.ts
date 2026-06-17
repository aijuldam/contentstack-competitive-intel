// ─────────────────────────────────────────────────────────────────────────────
// Billing instrumentation hooks
//
// Bridges billing lifecycle events to the unified analytics layer.
// ─────────────────────────────────────────────────────────────────────────────

import { track } from "@/lib/analytics/server";

export type BillingEventType =
  | "pricing_page_viewed"
  | "free_resources_clicked"
  | "paid_cta_clicked"
  | "checkout_started"
  | "checkout_completed"
  | "paywall_viewed"
  | "upgrade_clicked";

export interface BillingEventPayload {
  event: BillingEventType;
  planKey?: string;
  source?: string;
  feature?: string;
  metadata?: Record<string, unknown>;
}

export function emitBillingEvent(payload: BillingEventPayload, userId?: string): void {
  const { event, planKey, source, feature, metadata } = payload;
  track(
    event,
    {
      plan: planKey,
      source_page: source,
      paywall_context: feature,
      ...(metadata as Record<string, string | number | boolean | null | undefined>),
    },
    userId
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Billing instrumentation hooks
//
// Emit structured events for analytics on key billing lifecycle moments.
// Currently logs to console in dev. Wire to PostHog / Segment / etc. in prod.
// ─────────────────────────────────────────────────────────────────────────────

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
  source?: string;       // which page or component triggered it
  feature?: string;      // which gated feature was blocked
  metadata?: Record<string, unknown>;
}

export function emitBillingEvent(payload: BillingEventPayload): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[billing:event]", payload);
  }
  // TODO: analytics.track(payload.event, { ...payload })
}

// ─────────────────────────────────────────────────────────────────────────────
// Stripe webhook handler — stub
//
// Mount at: POST /api/webhooks/stripe
// Requires: STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET
//
// On receipt of a subscription event, update workspace_billing in Supabase,
// then update workspace.plan to "paid_monthly" or "free" as appropriate.
// ─────────────────────────────────────────────────────────────────────────────

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "inactive";

export interface ParsedSubscriptionEvent {
  workspaceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  planKey: "paid_monthly";
  currentPeriodEnd: Date;
}

export interface WebhookHandlerParams {
  rawBody: string;
  signature: string;
}

export async function handleStripeWebhook(
  _params: WebhookHandlerParams
): Promise<ParsedSubscriptionEvent | null> {
  throw new Error(
    "Stripe webhooks are not yet enabled. Set STRIPE_WEBHOOK_SECRET to activate."
  );

  /*
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  const event = stripe.webhooks.constructEvent(
    _params.rawBody,
    _params.signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  const HANDLED = [
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ] as const;

  if (!HANDLED.includes(event.type as typeof HANDLED[number])) return null;

  const sub = event.data.object as Stripe.Subscription;
  const workspaceId = sub.metadata.workspace_id;
  const status: SubscriptionStatus =
    sub.status === "active"   ? "active"   :
    sub.status === "past_due" ? "past_due" :
    "canceled";

  return {
    workspaceId,
    stripeCustomerId: sub.customer as string,
    stripeSubscriptionId: sub.id,
    status,
    planKey: "paid_monthly",
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
  };
  */
}

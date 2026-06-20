import Stripe from "stripe";
import type { SubscriptionStatus } from "@/lib/db/types";

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

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// Throws if the Stripe signature is invalid — let the route handler return 400.
export async function handleStripeWebhook(
  params: WebhookHandlerParams
): Promise<{ type: string; data: ParsedSubscriptionEvent | null }> {
  const stripe = getStripe();

  const event = stripe.webhooks.constructEvent(
    params.rawBody,
    params.signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  const HANDLED = new Set([
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);

  if (!HANDLED.has(event.type)) {
    return { type: event.type, data: null };
  }

  // checkout.session.completed is the primary signal for initial payment.
  // Retrieve the full subscription to get current_period_end.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspace_id;
    if (!workspaceId || !session.subscription) {
      return { type: event.type, data: null };
    }
    const sub = await stripe.subscriptions.retrieve(session.subscription as string);
    return {
      type: event.type,
      data: {
        workspaceId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: sub.id,
        status: "active",
        planKey: "paid_monthly",
        currentPeriodEnd: new Date(Number((sub as unknown as Record<string, unknown>).current_period_end) * 1000),
      },
    };
  }

  // customer.subscription.created / updated / deleted
  const sub = event.data.object as Stripe.Subscription & Record<string, unknown>;
  const workspaceId = (sub.metadata as Record<string, string>)?.workspace_id;
  if (!workspaceId) return { type: event.type, data: null };

  const subStatus = String(sub.status);
  const status: SubscriptionStatus =
    subStatus === "active"   ? "active"   :
    subStatus === "past_due" ? "past_due" :
    "canceled";

  return {
    type: event.type,
    data: {
      workspaceId,
      stripeCustomerId: sub.customer as string,
      stripeSubscriptionId: sub.id,
      status,
      planKey: "paid_monthly",
      currentPeriodEnd: new Date(Number(sub.current_period_end) * 1000),
    },
  };
}

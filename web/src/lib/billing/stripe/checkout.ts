import Stripe from "stripe";

export interface CheckoutSessionParams {
  workspaceId: string;
  userId: string;
  email: string;
  stripeCustomerId?: string | null;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // apiVersion omitted — SDK default (2026-05-27.dahlia) is used
  return new Stripe(key);
}

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const stripe = getStripe();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PAID_MONTHLY_PRICE_ID!, quantity: 1 }],
    success_url: params.successUrl + "?checkout=success",
    cancel_url: params.cancelUrl,
    client_reference_id: params.workspaceId,
    metadata: {
      workspace_id: params.workspaceId,
      user_id: params.userId,
    },
  };

  // Reuse existing Stripe customer to avoid duplicate customer records
  if (params.stripeCustomerId) {
    sessionParams.customer = params.stripeCustomerId;
  } else {
    sessionParams.customer_email = params.email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return { url: session.url!, sessionId: session.id };
}

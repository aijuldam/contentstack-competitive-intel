// ─────────────────────────────────────────────────────────────────────────────
// Stripe Checkout — stub
//
// Wire up by installing `stripe` and setting env vars:
//   STRIPE_SECRET_KEY
//   STRIPE_PAID_MONTHLY_PRICE_ID
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckoutSessionParams {
  workspaceId: string;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

export async function createCheckoutSession(
  _params: CheckoutSessionParams
): Promise<CheckoutSessionResult> {
  throw new Error(
    "Stripe Checkout is not yet enabled. " +
      "Set STRIPE_SECRET_KEY and STRIPE_PAID_MONTHLY_PRICE_ID to activate."
  );

  /*
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: _params.email,
    line_items: [{ price: process.env.STRIPE_PAID_MONTHLY_PRICE_ID!, quantity: 1 }],
    success_url: _params.successUrl + "?checkout=success",
    cancel_url: _params.cancelUrl,
    metadata: {
      workspace_id: _params.workspaceId,
      user_id: _params.userId,
    },
  });
  return { url: session.url!, sessionId: session.id };
  */
}

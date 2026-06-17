// ─────────────────────────────────────────────────────────────────────────────
// Stripe Customer Portal — stub
//
// Lets paid customers manage their subscription (cancel, update payment, etc.)
// Requires: STRIPE_SECRET_KEY + a configured Stripe billing portal.
// ─────────────────────────────────────────────────────────────────────────────

export interface PortalSessionParams {
  stripeCustomerId: string;
  returnUrl: string;
}

export async function createPortalSession(
  _params: PortalSessionParams
): Promise<{ url: string }> {
  throw new Error(
    "Stripe customer portal is not yet enabled. Set STRIPE_SECRET_KEY to activate."
  );

  /*
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  const session = await stripe.billingPortal.sessions.create({
    customer: _params.stripeCustomerId,
    return_url: _params.returnUrl,
  });
  return { url: session.url };
  */
}

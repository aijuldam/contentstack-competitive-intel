import Stripe from "stripe";

export interface PortalSessionParams {
  stripeCustomerId: string;
  returnUrl: string;
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function createPortalSession(
  params: PortalSessionParams
): Promise<{ url: string }> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: params.stripeCustomerId,
    return_url: params.returnUrl,
  });
  return { url: session.url };
}

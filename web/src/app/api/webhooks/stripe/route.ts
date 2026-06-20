import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { handleStripeWebhook } from "@/lib/billing/stripe/webhook";
import { upsertWorkspaceBilling, updateWorkspacePlan } from "@/lib/db/queries/billing";
import type { Database } from "@/lib/db/types";

// Use the plain Supabase client with service role — webhooks have no user session.
function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let parsed: Awaited<ReturnType<typeof handleStripeWebhook>>;
  try {
    parsed = await handleStripeWebhook({ rawBody, signature });
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Unhandled event type — acknowledge without processing
  if (!parsed.data) {
    return NextResponse.json({ received: true, type: parsed.type });
  }

  const { workspaceId, stripeCustomerId, stripeSubscriptionId, status, planKey, currentPeriodEnd } =
    parsed.data;

  const db = getServiceClient();

  try {
    await upsertWorkspaceBilling(db, {
      workspace_id: workspaceId,
      plan_key: planKey,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      subscription_status: status,
      current_period_end: currentPeriodEnd.toISOString(),
    });

    const newPlan = status === "active" ? "paid_monthly" : "free";
    await updateWorkspacePlan(db, workspaceId, newPlan);
  } catch (err) {
    console.error("[stripe/webhook] db update failed:", err);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, type: parsed.type });
}

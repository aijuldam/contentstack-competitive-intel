"use server";

import { redirect } from "next/navigation";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { createCheckoutSession } from "@/lib/billing/stripe/checkout";
import { createPortalSession } from "@/lib/billing/stripe/portal";
import { getWorkspaceBilling } from "@/lib/db/queries/billing";
import { track } from "@/lib/analytics/server";
import { E } from "@/lib/analytics/events";

export async function startCheckoutAction() {
  const { user, workspace } = await requireAuthAndWorkspace();

  const db = await createClient();
  const billing = await getWorkspaceBilling(db, workspace.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  track(E.CHECKOUT_STARTED, { plan: "paid_monthly", source_page: "billing" }, user.id);

  const { url } = await createCheckoutSession({
    workspaceId: workspace.id,
    userId: user.id,
    email: user.email ?? "",
    stripeCustomerId: billing?.stripe_customer_id,
    successUrl: `${appUrl}/app/billing`,
    cancelUrl: `${appUrl}/app/billing`,
  });

  redirect(url);
}

export async function openPortalAction() {
  const { workspace } = await requireAuthAndWorkspace();

  const db = await createClient();
  const billing = await getWorkspaceBilling(db, workspace.id);

  if (!billing?.stripe_customer_id) {
    redirect("/app/billing");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { url } = await createPortalSession({
    stripeCustomerId: billing.stripe_customer_id,
    returnUrl: `${appUrl}/app/billing`,
  });

  redirect(url);
}

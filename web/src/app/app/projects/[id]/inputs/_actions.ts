"use server";

import { redirect } from "next/navigation";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createServiceClient } from "@/lib/db/server";
import { generateFoundationForProject } from "@/lib/services";
import { canGenerateMessagingFoundation } from "@/lib/billing/entitlements";
import { emitBillingEvent } from "@/lib/billing/events";

export async function generateFoundationAction(projectId: string) {
  const { user, workspace } = await requireAuthAndWorkspace();

  if (!canGenerateMessagingFoundation(workspace)) {
    emitBillingEvent({ event: "paywall_viewed", feature: "generate_foundation", planKey: workspace.plan });
    redirect("/app/billing?gate=generate_foundation");
  }

  const client = await createServiceClient();

  await generateFoundationForProject(client, {
    projectId,
    userId: user.id,
  });

  redirect(`/app/projects/${projectId}/narrative`);
}

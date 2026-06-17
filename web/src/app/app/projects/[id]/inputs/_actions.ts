"use server";

import { redirect } from "next/navigation";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createServiceClient } from "@/lib/db/server";
import { generateFoundationForProject } from "@/lib/services";
import { canGenerateMessagingFoundation } from "@/lib/billing/entitlements";
import { emitBillingEvent } from "@/lib/billing/events";
import { track } from "@/lib/analytics/server";
import { E } from "@/lib/analytics/events";

export async function generateFoundationAction(projectId: string) {
  const { user, workspace } = await requireAuthAndWorkspace();

  if (!canGenerateMessagingFoundation(workspace)) {
    emitBillingEvent({ event: "paywall_viewed", feature: "generate_foundation", planKey: workspace.plan });
    redirect("/app/billing?gate=generate_foundation");
  }

  const client = await createServiceClient();

  const result = await generateFoundationForProject(client, {
    projectId,
    userId: user.id,
  });

  track(
    E.MESSAGING_FOUNDATION_GENERATED,
    {
      project_id: projectId,
      foundation_version: result.version.version_number,
      plan: workspace.plan,
      workspace_id: workspace.id,
    },
    user.id
  );

  redirect(`/app/projects/${projectId}/narrative`);
}

"use server";

import { redirect } from "next/navigation";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createServiceClient } from "@/lib/db/server";
import { approveFoundationVersion } from "@/lib/services";
import { track } from "@/lib/analytics/server";
import { E } from "@/lib/analytics/events";

export async function approveFoundationAction(narrativeVersionId: string, projectId: string) {
  const { user, workspace } = await requireAuthAndWorkspace();
  const client = await createServiceClient();

  await approveFoundationVersion(client, narrativeVersionId, user.id);

  track(
    E.MESSAGING_FOUNDATION_APPROVED,
    {
      project_id: projectId,
      foundation_version_id: narrativeVersionId,
      plan: workspace.plan,
      workspace_id: workspace.id,
    },
    user.id
  );

  redirect(`/app/projects/${projectId}/assets`);
}

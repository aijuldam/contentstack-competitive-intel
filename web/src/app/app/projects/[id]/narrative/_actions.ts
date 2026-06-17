"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { createServiceClient } from "@/lib/db/server";
import { approveFoundationVersion } from "@/lib/services";

export async function approveFoundationAction(narrativeVersionId: string, projectId: string) {
  const user = await requireAuth();
  const client = await createServiceClient();

  await approveFoundationVersion(client, narrativeVersionId, user.id);

  redirect(`/app/projects/${projectId}/assets`);
}

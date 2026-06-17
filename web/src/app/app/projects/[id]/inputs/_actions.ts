"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { createServiceClient } from "@/lib/db/server";
import { generateFoundationForProject } from "@/lib/services";

export async function generateFoundationAction(projectId: string) {
  const user = await requireAuth();
  const client = await createServiceClient();

  await generateFoundationForProject(client, {
    projectId,
    userId: user.id,
  });

  redirect(`/app/projects/${projectId}/narrative`);
}

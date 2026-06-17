"use server";

import { redirect } from "next/navigation";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createServiceClient } from "@/lib/db/server";
import { createProject } from "@/lib/db/queries/projects";
import { createProjectSource } from "@/lib/db/queries/sources";
import { RawIntakeSchema } from "@/lib/schemas/intake.schema";
import { canCreateProject } from "@/lib/billing/entitlements";
import { emitBillingEvent } from "@/lib/billing/events";
import { track } from "@/lib/analytics/server";
import { E } from "@/lib/analytics/events";

export async function createProjectAction(formData: FormData) {
  const { user, workspace } = await requireAuthAndWorkspace();

  if (!canCreateProject(workspace)) {
    emitBillingEvent({ event: "paywall_viewed", feature: "create_project", planKey: workspace.plan });
    redirect("/app/billing?gate=create_project");
  }

  const projectName = ((formData.get("project_name") as string | null) ?? "").trim() || "New Project";

  const rawInput = {
    product_description: (formData.get("product_description") as string) ?? "",
    buyer_and_user: (formData.get("buyer_and_user") as string) ?? "",
    problem_and_cost: (formData.get("problem_and_cost") as string) ?? "",
    differentiation_and_proof: (formData.get("differentiation_and_proof") as string) ?? "",
  };

  const parse = RawIntakeSchema.safeParse(rawInput);
  if (!parse.success) {
    throw new Error(parse.error.issues.map((i) => i.message).join(", "));
  }

  const client = await createServiceClient();

  const project = await createProject(client, {
    workspace_id: workspace.id,
    name: projectName,
    created_by: user.id,
  });

  await createProjectSource(client, {
    project_id: project.id,
    raw_input: parse.data,
    normalization_status: "pending",
  });

  track(
    E.PROJECT_CREATED,
    { project_id: project.id, plan: workspace.plan, workspace_id: workspace.id },
    user.id
  );

  redirect(`/app/projects/${project.id}/inputs`);
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { NewProjectForm } from "./NewProjectForm";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { canCreateProject } from "@/lib/billing/entitlements";
import { UpgradePrompt } from "@/components/billing/UpgradePrompt";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  const { workspace } = await requireAuthAndWorkspace();

  if (!canCreateProject(workspace)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          title="New project"
          description="Create a project to generate a Messaging Foundation and GTM assets."
          className="mb-8"
        />
        <UpgradePrompt
          feature="Creating projects requires the Go-to-Market Taste plan"
          benefit="At €5/month you get unlimited projects, Messaging Foundation generation, and all three GTM asset types — pitch deck, one-pager, and sales deck."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="New project"
        description="Fill in four fields. The AI will structure the rest."
        className="mb-6"
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <Badge variant="inferred" className="shrink-0">Note</Badge>
        <p className="text-xs text-amber-800">
          Plain language is fine. Do not format or over-polish. The normalizer
          works from raw input — over-edited inputs produce less accurate inferences.
        </p>
      </div>

      <NewProjectForm />
    </div>
  );
}

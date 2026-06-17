import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { NewProjectForm } from "./NewProjectForm";

export const metadata: Metadata = {
  title: "New project",
};

export default function NewProjectPage() {
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

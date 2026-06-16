import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Product",
  description: "How NarrativeKit structures your B2B SaaS messaging.",
};

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">Product</Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          A structured system, not a prompt toy
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          NarrativeKit runs a three-stage AI pipeline — intake normalization,
          canonical narrative synthesis, asset generation — grounded in MEDDIC
          and Command of the Message at every step.
        </p>
      </div>

      <div className="space-y-12">
        {[
          {
            stage: "Stage 1",
            title: "Intake Normalization",
            description:
              "Your 4 free-text fields are parsed into structured JSON — explicit facts, inferred interpretations, confidence notes, and a list of missing-but-important items. Nothing is invented.",
          },
          {
            stage: "Stage 2",
            title: "Canonical Narrative Synthesis",
            description:
              "The normalized intake becomes a structured MEDDIC + Command of the Message narrative. Each section is tagged verified or inferred. You review and edit before any assets are generated.",
          },
          {
            stage: "Stage 3",
            title: "Asset Generation",
            description:
              "Three asset types — pitch deck, one-pager, sales enablement deck — derive their content from the canonical narrative. Section-by-section, traceable to source.",
          },
        ].map((item) => (
          <div key={item.stage} className="grid gap-4 border-b border-border pb-10 md:grid-cols-4 last:border-0">
            <div>
              <p className="label-xs">{item.stage}</p>
            </div>
            <div className="md:col-span-3">
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

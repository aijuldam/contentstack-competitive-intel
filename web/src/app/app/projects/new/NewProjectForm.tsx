"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createProjectAction } from "./_actions";
import type { SampleIntakeContent } from "@/lib/experiments/sample-intake";

const INTAKE_FIELDS = [
  {
    id: "product_description" as keyof SampleIntakeContent,
    label: "What does your product do?",
    hint: "Be concrete. Who does it help? What does it automate, replace, or enable? One short paragraph.",
    placeholder:
      "e.g. We help RevOps teams at mid-market SaaS companies sync CRM, billing, and support data automatically — replacing 4–6 hours of manual reconciliation per week.",
    rows: 4,
  },
  {
    id: "buyer_and_user" as keyof SampleIntakeContent,
    label: "Who buys it and who uses it?",
    hint: "The economic buyer (budget owner) and the day-to-day user are often different. Name both roles and company type.",
    placeholder:
      "e.g. Buyer: VP of Revenue Operations at Series B–D SaaS companies. Users: RevOps analysts and CRO admin teams.",
    rows: 3,
  },
  {
    id: "problem_and_cost" as keyof SampleIntakeContent,
    label: "What is the cost of not solving this?",
    hint: "What happens if the buyer does nothing? Time lost, revenue at risk, compliance exposure, team frustration. Be specific where you can.",
    placeholder:
      "e.g. Without us, teams are doing manual exports every Monday morning. Forecast errors compound. Deals slip through because no one caught the CRM gap until it was too late.",
    rows: 4,
  },
  {
    id: "differentiation_and_proof" as keyof SampleIntakeContent,
    label: "What makes you different? Any proof?",
    hint: "Your strongest differentiator vs. the status quo or a named competitor. Add a metric, case study, or quote if you have one — even approximate.",
    placeholder:
      "e.g. We're the only tool that syncs bidirectionally without a data warehouse. Customers typically cut their reconciliation time by 80%. One customer reduced CRM errors from 12% to under 1% in 30 days.",
    rows: 4,
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving...
        </>
      ) : (
        "Create project →"
      )}
    </Button>
  );
}

interface NewProjectFormProps {
  /** EXP-002: Sample intake prefill content. Pass empty object when flag is off. */
  sampleContent?: Partial<SampleIntakeContent>;
}

export function NewProjectForm({ sampleContent = {} }: NewProjectFormProps) {
  const hasSample = Object.keys(sampleContent).length > 0;

  return (
    <form action={createProjectAction} className="space-y-6">
      {/* EXP-002: banner explaining the prefilled example */}
      {hasSample && (
        <div className="rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Example content loaded.</span>{" "}
            Replace each field with your own product&apos;s details. The example shows
            what specific, useful inputs look like.
          </p>
        </div>
      )}

      <Card>
        <CardContent className="pt-5">
          <Label htmlFor="project_name" className="text-sm font-semibold">
            <span className="mr-2 font-mono text-muted-foreground">00</span>
            Project name
          </Label>
          <p className="mb-3 mt-1.5 text-xs text-muted-foreground">
            A short internal name for this project. You can change it later.
          </p>
          <Input
            id="project_name"
            name="project_name"
            defaultValue={sampleContent.project_name ?? ""}
            placeholder="e.g. Acme RevOps Platform"
            className="text-sm"
            required
            minLength={2}
            maxLength={120}
          />
        </CardContent>
      </Card>

      {INTAKE_FIELDS.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="pt-5">
            <div className="mb-1.5">
              <Label htmlFor={field.id} className="text-sm font-semibold">
                <span className="mr-2 font-mono text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {field.label}
              </Label>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{field.hint}</p>
            <Textarea
              id={field.id}
              name={field.id}
              defaultValue={sampleContent[field.id] ?? ""}
              placeholder={field.placeholder}
              rows={field.rows}
              className="text-sm"
              required
            />
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground">
          Your input is normalized by AI — reviewed before anything generates.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" type="button" size="sm" asChild>
            <a href="/app/projects">Cancel</a>
          </Button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

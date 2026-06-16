import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "New project",
};

const fields = [
  {
    id: "product_description",
    label: "What does your product do?",
    hint: "Be concrete. Who does it help? What does it automate, replace, or enable? One short paragraph.",
    placeholder:
      "e.g. We help RevOps teams at mid-market SaaS companies sync CRM, billing, and support data automatically — replacing 4–6 hours of manual reconciliation per week.",
    type: "textarea",
    rows: 4,
  },
  {
    id: "buyer_and_user",
    label: "Who buys it and who uses it?",
    hint: "The economic buyer (budget owner) and the day-to-day user are often different. Name both roles and company type.",
    placeholder:
      "e.g. Buyer: VP of Revenue Operations at Series B–D SaaS companies. Users: RevOps analysts and CRO admin teams.",
    type: "textarea",
    rows: 3,
  },
  {
    id: "problem_and_cost",
    label: "What is the cost of not solving this?",
    hint: "What happens if the buyer does nothing? Time lost, revenue at risk, compliance exposure, team frustration. Be specific where you can.",
    placeholder:
      "e.g. Without us, teams are doing manual exports every Monday morning. Forecast errors compound. Deals slip through because no one caught the CRM gap until it was too late.",
    type: "textarea",
    rows: 4,
  },
  {
    id: "differentiation_and_proof",
    label: "What makes you different? Any proof?",
    hint: "Your strongest differentiator vs. the status quo or a named competitor. Add a metric, case study, or quote if you have one — even approximate.",
    placeholder:
      "e.g. We're the only tool that syncs bidirectionally without a data warehouse. Customers typically cut their reconciliation time by 80%. One customer reduced CRM errors from 12% to under 1% in 30 days.",
    type: "textarea",
    rows: 4,
  },
];

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

      {/* TODO: wire to server action → intake normalizer → review */}
      <form className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-5">
              <div className="mb-1.5 flex items-start justify-between gap-2">
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
                placeholder={field.placeholder}
                rows={field.rows}
                className="text-sm"
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
            <Button type="submit" size="sm">
              Normalize intake →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

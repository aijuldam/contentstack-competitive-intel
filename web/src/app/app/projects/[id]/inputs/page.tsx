import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Project inputs" };

// TODO: replace with real data from Supabase
const MOCK_NORMALIZED = {
  explicit_inputs: {
    product_description:
      "We help RevOps teams at mid-market SaaS sync CRM, billing, and support data automatically — replacing 4–6 hours of manual reconciliation per week.",
    buyer_and_user:
      "Buyer: VP RevOps at Series B–D SaaS. Users: RevOps analysts and CRO admin teams.",
    problem_and_cost:
      "Manual exports every Monday. Forecast errors compound. Deals slip because CRM gaps aren't caught in time.",
    differentiation_and_proof:
      "Only tool that syncs bidirectionally without a data warehouse. Customers cut reconciliation time by 80%.",
  },
  parsed_facts: {
    buyer_roles: ["VP of Revenue Operations"],
    user_roles: ["RevOps Analyst", "CRO Admin"],
    pain_points: ["Manual reconciliation", "Forecast errors", "CRM data gaps"],
    metrics_mentioned: ["4–6 hours/week saved", "80% reduction in reconciliation time"],
    differentiators: ["Bidirectional sync", "No data warehouse required"],
    proof_points: ["80% reconciliation time reduction (unattributed)"],
    competitors_or_alternatives: [],
  },
  confidence_notes: [
    "Metrics are approximate — '4-6 hours' and '80%' are user-provided but unverified",
    "No named customer or case study provided for proof",
  ],
  missing_but_important: [
    "Named customer reference or case study",
    "Decision criteria the buyer evaluates vendors on",
    "Champion profile — who internally sponsors this purchase",
  ],
};

interface PageProps {
  params: { id: string };
}

export default function ProjectInputsPage({ params: _ }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Normalized Intake</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Structured output from Stage 1. Review before generating the narrative.
          </p>
        </div>
        <Button size="sm" variant="outline">Re-run normalization</Button>
      </div>

      {/* Explicit inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Explicit inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(MOCK_NORMALIZED.explicit_inputs).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <p className="label-xs">{key.replace(/_/g, " ")}</p>
              <p className="text-sm text-foreground">{val}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Parsed facts */}
      <Card>
        <CardHeader>
          <CardTitle>Parsed facts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(MOCK_NORMALIZED.parsed_facts)
            .filter(([, v]) => Array.isArray(v) && v.length > 0)
            .map(([key, values]) => (
              <div key={key}>
                <p className="label-xs mb-1.5">{key.replace(/_/g, " ")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(values as string[]).map((v) => (
                    <Badge key={v} variant="secondary">{v}</Badge>
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Confidence notes */}
      <Card>
        <CardHeader>
          <CardTitle>Confidence notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {MOCK_NORMALIZED.confidence_notes.map((note) => (
              <li key={note} className="flex gap-2 text-sm">
                <Badge variant="inferred" className="shrink-0 mt-0.5">Inferred</Badge>
                <span className="text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Missing fields */}
      <Card className="border-amber-200 bg-amber-50/40">
        <CardHeader>
          <CardTitle>Missing but important</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {MOCK_NORMALIZED.missing_but_important.map((item) => (
              <li key={item} className="text-sm text-amber-800 flex gap-2 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

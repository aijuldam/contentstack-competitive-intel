import type { Metadata } from "next";
import { FileText, LayoutTemplate, Presentation, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Assets" };

const ASSET_TYPES = [
  {
    type: "pitch-deck",
    icon: Presentation,
    label: "Pitch Deck",
    description:
      "8-slide narrative: problem, cost, solution, differentiation, proof, outcomes, CTA.",
    sections: 8,
    status: "complete" as const,
  },
  {
    type: "one-pager",
    icon: FileText,
    label: "One-Pager",
    description:
      "Single-page leave-behind for champions. Skimmable, framework-aligned.",
    sections: 7,
    status: "draft" as const,
  },
  {
    type: "sales-deck",
    icon: LayoutTemplate,
    label: "Sales Enablement Deck",
    description:
      "10-section AE playbook with discovery questions, objection handling, and competitive angles.",
    sections: 10,
    status: "pending" as const,
  },
];

interface PageProps {
  params: { id: string };
}

export default function AssetsPage({ params: _ }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold">Assets</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          All assets derive from the canonical narrative. Generate, review, and edit section by section.
        </p>
      </div>

      <div className="space-y-3">
        {ASSET_TYPES.map((asset) => (
          <Card key={asset.type}>
            <CardContent className="flex items-start gap-4 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <asset.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold">{asset.label}</h3>
                  <Badge
                    variant={
                      asset.status === "complete"
                        ? "active"
                        : asset.status === "draft"
                        ? "draft"
                        : "secondary"
                    }
                  >
                    {asset.status === "complete"
                      ? "Ready"
                      : asset.status === "draft"
                      ? "Draft"
                      : "Not generated"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{asset.description}</p>
                {asset.status !== "pending" && (
                  <p className="text-2xs text-muted-foreground mt-1">
                    {asset.sections} sections
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {asset.status === "pending" ? (
                  <Button size="sm">
                    Generate
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">
          Assets are locked from generation until the canonical narrative status is <Badge variant="active" className="text-2xs">Ready</Badge>.
          Edit the narrative first.
        </p>
      </div>
    </div>
  );
}

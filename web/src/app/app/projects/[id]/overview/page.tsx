import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, LayoutTemplate, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Project overview" };

// TODO: replace with real project data
const MOCK_NARRATIVE_STATUS = "complete";
const MOCK_ASSETS = [
  { type: "pitch-deck", label: "Pitch Deck", icon: Presentation, status: "complete" },
  { type: "one-pager", label: "One-Pager", icon: FileText, status: "draft" },
  { type: "sales-deck", label: "Sales Enablement Deck", icon: LayoutTemplate, status: "pending" },
];

interface PageProps {
  params: { id: string };
}

export default function ProjectOverviewPage({ params }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Narrative status */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Canonical Narrative</h2>
          <Badge variant={MOCK_NARRATIVE_STATUS === "complete" ? "active" : "draft"}>
            {MOCK_NARRATIVE_STATUS === "complete" ? "Ready" : "Draft"}
          </Badge>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm text-foreground font-medium">
                MEDDIC + Command of the Message narrative
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                12 blocks · 8 verified · 4 inferred · Last edited 2 hours ago
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/app/projects/${params.id}/narrative`}>
                Review
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Assets */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Assets</h2>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/app/projects/${params.id}/assets`}>View all</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {MOCK_ASSETS.map((asset) => (
            <Card key={asset.type} hover>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <asset.icon className="h-4 w-4 text-muted-foreground" />
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
                      : "Not started"}
                  </Badge>
                </div>
                <CardTitle>{asset.label}</CardTitle>
                <CardDescription>
                  {asset.status === "pending"
                    ? "Generate from narrative"
                    : "Derived from canonical narrative"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  variant={asset.status === "pending" ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href={`/app/projects/${params.id}/assets`}>
                    {asset.status === "pending" ? "Generate" : "Open"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

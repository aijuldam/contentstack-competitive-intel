import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  LayoutTemplate,
  Presentation,
  ArrowRight,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Assets" };

// Mock data: replace with Supabase query once server actions are wired.
const MOCK_FOUNDATION = {
  approved: true,
  version: 2,
  approvedAt: "Jun 14, 2026",
};

const MOCK_ASSETS = [
  {
    slug: "pitch-deck",
    type: "pitch_deck" as const,
    icon: Presentation,
    label: "Pitch Deck",
    description:
      "8-slide narrative: problem, cost, solution, differentiation, proof, outcomes, and CTA.",
    sectionCount: 8,
    status: "complete" as const,
    version: 2,
    generatedAt: "Jun 14, 2026",
    hasDrift: false,
  },
  {
    slug: "one-pager",
    type: "one_pager" as const,
    icon: FileText,
    label: "One-Pager",
    description:
      "Single-page leave-behind for champions. Skimmable, framework-aligned.",
    sectionCount: 7,
    status: "complete" as const,
    version: 1,
    generatedAt: "Jun 12, 2026",
    hasDrift: true,
  },
  {
    slug: "sales-enablement",
    type: "sales_deck" as const,
    icon: LayoutTemplate,
    label: "Sales Enablement Deck",
    description:
      "10-section AE playbook with discovery questions, objection handling, and competitive angles.",
    sectionCount: 10,
    status: "pending" as const,
    version: null,
    generatedAt: null,
    hasDrift: false,
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetsPage({ params }: PageProps) {
  const { id } = await params;
  const foundationApproved = MOCK_FOUNDATION.approved;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">Assets</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          All assets derive from the approved Messaging Foundation. Generate, review, and edit section by section.
        </p>
      </div>

      {/* Foundation status row */}
      <div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Messaging Foundation</span>
          {foundationApproved ? (
            <>
              <Badge variant="active">Approved v{MOCK_FOUNDATION.version}</Badge>
              <span className="text-muted-foreground">{MOCK_FOUNDATION.approvedAt}</span>
            </>
          ) : (
            <Badge variant="draft">Not approved</Badge>
          )}
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/app/projects/${id}/narrative`}>
            Review foundation
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {MOCK_ASSETS.map((asset) => (
          <Card key={asset.slug}>
            <CardContent className="flex items-start gap-4 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <asset.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold">{asset.label}</h3>
                  {asset.status === "complete" && (
                    <Badge variant="active">
                      v{asset.version}
                    </Badge>
                  )}
                  {asset.status === "pending" && (
                    <Badge variant="secondary">Not generated</Badge>
                  )}
                  {asset.hasDrift && (
                    <Badge variant="inferred">Foundation updated</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{asset.description}</p>
                {asset.generatedAt && (
                  <p className="mt-1 text-2xs text-muted-foreground">
                    {asset.sectionCount} sections · Generated {asset.generatedAt}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {asset.status === "pending" ? (
                  <Button
                    size="sm"
                    disabled={!foundationApproved}
                    asChild={foundationApproved}
                  >
                    {foundationApproved ? (
                      <Link href={`/app/projects/${id}/assets/${asset.slug}`}>
                        Generate
                      </Link>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                ) : (
                  <div className="flex gap-1.5">
                    {asset.hasDrift && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/app/projects/${id}/assets/${asset.slug}`}>
                          <RefreshCw className="h-3.5 w-3.5" />
                          Regen
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/app/projects/${id}/assets/${asset.slug}`}>
                        Open
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!foundationApproved && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Approve the Messaging Foundation before generating assets. Go to{" "}
            <Link
              href={`/app/projects/${id}/narrative`}
              className="underline underline-offset-2"
            >
              Narrative
            </Link>{" "}
            to review and approve.
          </p>
        </div>
      )}
    </div>
  );
}

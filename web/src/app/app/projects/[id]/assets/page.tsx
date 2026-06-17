import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  LayoutTemplate,
  Presentation,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { getCurrentFoundation } from "@/lib/services/foundation.service";
import { formatDistanceToNow } from "@/lib/utils/date";

export const metadata: Metadata = { title: "Assets" };

const ASSET_DEFS = [
  {
    slug: "pitch-deck",
    icon: Presentation,
    label: "Pitch Deck",
    description:
      "8-slide narrative: problem, cost, solution, differentiation, proof, outcomes, and CTA.",
    sectionCount: 8,
  },
  {
    slug: "one-pager",
    icon: FileText,
    label: "One-Pager",
    description:
      "Single-page leave-behind for champions. Skimmable, framework-aligned.",
    sectionCount: 7,
  },
  {
    slug: "sales-enablement",
    icon: LayoutTemplate,
    label: "Sales Enablement Deck",
    description:
      "AE playbook with discovery questions, objection handling, and competitive angles.",
    sectionCount: 9,
  },
] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetsPage({ params }: PageProps) {
  const { id } = await params;
  await requireAuthAndWorkspace();

  const client = await createClient();
  const result = await getCurrentFoundation(client, id);

  const hasFoundation = result !== null;
  const foundationApproved = result !== null && result.version.approved_at !== null;
  const versionNumber = result?.version.version_number ?? null;
  const approvedAt = result?.version.approved_at ?? null;

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
          {!hasFoundation && <Badge variant="secondary">Not generated</Badge>}
          {hasFoundation && !foundationApproved && <Badge variant="draft">Pending approval</Badge>}
          {foundationApproved && (
            <>
              <Badge variant="active">
                Approved{versionNumber !== null ? ` v${versionNumber}` : ""}
              </Badge>
              {approvedAt && (
                <span className="text-muted-foreground">
                  {formatDistanceToNow(approvedAt)}
                </span>
              )}
            </>
          )}
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/app/projects/${id}/${hasFoundation ? "narrative" : "inputs"}`}>
            {hasFoundation ? "Review foundation" : "Start intake"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {ASSET_DEFS.map((asset) => (
          <Card key={asset.slug}>
            <CardContent className="flex items-start gap-4 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <asset.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold">{asset.label}</h3>
                  <Badge variant="secondary">Not generated</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{asset.description}</p>
                <p className="mt-1 text-2xs text-muted-foreground">
                  {asset.sectionCount} sections
                </p>
              </div>
              <div className="shrink-0">
                <Button size="sm" disabled={!foundationApproved} asChild={foundationApproved}>
                  {foundationApproved ? (
                    <Link href={`/app/projects/${id}/assets/${asset.slug}`}>
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    "Open"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!foundationApproved && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {hasFoundation
              ? <>Approve the Messaging Foundation before opening assets. Go to{" "}
                  <Link href={`/app/projects/${id}/narrative`} className="underline underline-offset-2">
                    Narrative
                  </Link>{" "}to review and approve.</>
              : <>Generate and approve a Messaging Foundation first. Go to{" "}
                  <Link href={`/app/projects/${id}/inputs`} className="underline underline-offset-2">
                    Inputs
                  </Link>{" "}to start.</>
            }
          </p>
        </div>
      )}
    </div>
  );
}

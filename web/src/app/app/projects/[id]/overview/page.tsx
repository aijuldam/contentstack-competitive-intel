import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, LayoutTemplate, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { getCurrentFoundation } from "@/lib/services/foundation.service";
import { formatDistanceToNow } from "@/lib/utils/date";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { E } from "@/lib/analytics/events";

export const metadata: Metadata = { title: "Project overview" };

const ASSET_DEFS = [
  { type: "pitch-deck",       label: "Pitch Deck",              icon: Presentation },
  { type: "one-pager",        label: "One-Pager",               icon: FileText     },
  { type: "sales-enablement", label: "Sales Enablement Deck",   icon: LayoutTemplate },
] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { id } = await params;
  await requireAuthAndWorkspace();

  const client = await createClient();
  const result = await getCurrentFoundation(client, id);

  const hasFoundation = result !== null;
  const isApproved = result !== null && result.version.approved_at !== null;
  const versionNumber = result?.version.version_number ?? null;
  const approvedAt = result?.version.approved_at ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <PageViewTracker event={E.ASSET_OPENED} properties={{ project_id: id, asset_type: "overview" }} />
      {/* Narrative / Foundation status */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Messaging Foundation</h2>
          {hasFoundation ? (
            <Badge variant={isApproved ? "active" : "draft"}>
              {isApproved ? "Approved" : "Draft"}
            </Badge>
          ) : (
            <Badge variant="secondary">Not generated</Badge>
          )}
        </div>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              {hasFoundation ? (
                <>
                  <p className="text-sm text-foreground font-medium">
                    MEDDIC + Command of the Message narrative
                    {versionNumber !== null && ` · v${versionNumber}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isApproved && approvedAt
                      ? `Approved ${formatDistanceToNow(approvedAt)}`
                      : "Review and approve before generating assets"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-foreground font-medium">No foundation yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fill in your intake to generate a Messaging Foundation.
                  </p>
                </>
              )}
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/app/projects/${id}/${hasFoundation ? "narrative" : "inputs"}`}>
                {hasFoundation ? "Review" : "Start intake"}
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
            <Link href={`/app/projects/${id}/assets`}>View all</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {ASSET_DEFS.map((asset) => (
            <Card key={asset.type}>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <asset.icon className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={isApproved ? "secondary" : "secondary"}>
                    {isApproved ? "Not generated" : "Locked"}
                  </Badge>
                </div>
                <CardTitle>{asset.label}</CardTitle>
                <CardDescription>
                  {isApproved
                    ? "Generate from approved foundation"
                    : "Approve foundation to unlock"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href={`/app/projects/${id}/assets`}>
                    {isApproved ? "Generate" : "View assets"}
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

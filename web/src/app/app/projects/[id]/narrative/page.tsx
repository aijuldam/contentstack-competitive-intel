import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/db/server";
import { getCurrentFoundation } from "@/lib/services";
import {
  FOUNDATION_SECTION_LABELS,
  MEDDIC_SECTION_LABELS,
  type MessagingFoundation,
} from "@/lib/schemas/foundation.schema";
import { foundationConfidenceCounts } from "@/lib/schemas/foundation.map";
import { ApproveFoundationButton } from "./ApproveFoundationButton";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { E } from "@/lib/analytics/events";
import type { GroundedBlock } from "@/lib/schemas/provenance";

export const metadata: Metadata = { title: "Canonical narrative" };

interface PageProps {
  params: Promise<{ id: string }>;
}

const COTM_KEYS = [
  "current_state",
  "negative_consequences",
  "required_capabilities",
  "differentiated_value",
  "business_outcomes",
  "positioning_summary",
] as const satisfies ReadonlyArray<keyof MessagingFoundation>;

export default async function NarrativePage({ params }: PageProps) {
  const { id } = await params;
  const client = await createClient();
  const result = await getCurrentFoundation(client, id);

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 text-center space-y-3">
        <p className="text-sm font-medium">No foundation yet</p>
        <p className="text-xs text-muted-foreground">
          Go to Inputs and generate the Messaging Foundation first.
        </p>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/app/projects/${id}/inputs`}>
            <Sparkles className="h-3.5 w-3.5" />
            Go to Inputs
          </Link>
        </Button>
      </div>
    );
  }

  const { version, foundation } = result;
  const isApproved = !!version.approved_at;
  const counts = foundationConfidenceCounts(foundation);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-8">
      <PageViewTracker
        event={E.MESSAGING_FOUNDATION_REVIEWED}
        properties={{ project_id: id, foundation_version: version.version_number }}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Canonical Narrative</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Source of truth. All assets derive from this.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="verified">Verified</Badge> {counts.verified}
            <span className="mx-1">·</span>
            <Badge variant="inferred">Inferred</Badge> {counts.inferred}
          </div>
          {isApproved ? (
            <Badge variant="verified" className="gap-1">Approved</Badge>
          ) : (
            <ApproveFoundationButton narrativeVersionId={version.id} projectId={id} />
          )}
        </div>
      </div>

      {/* MEDDIC */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">MEDDIC</h3>
          <Separator className="flex-1" />
        </div>
        <div className="space-y-3">
          {(Object.keys(MEDDIC_SECTION_LABELS) as Array<keyof typeof MEDDIC_SECTION_LABELS>).map(
            (key) => (
              <FoundationBlock
                key={key}
                label={MEDDIC_SECTION_LABELS[key]}
                block={foundation.meddic[key]}
              />
            )
          )}
        </div>
      </section>

      {/* Command of the Message */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
            Command of the Message
          </h3>
          <Separator className="flex-1" />
        </div>
        <div className="space-y-3">
          {COTM_KEYS.map((key) => (
            <FoundationBlock
              key={key}
              label={FOUNDATION_SECTION_LABELS[key] ?? key.replace(/_/g, " ")}
              block={foundation[key] as GroundedBlock}
            />
          ))}
        </div>
      </section>

      {/* Proof points */}
      {foundation.proof_points.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Proof Points
            </h3>
            <Separator className="flex-1" />
          </div>
          <Card>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {foundation.proof_points.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge
                      variant={item.confidence === "verified" ? "verified" : "inferred"}
                      className="shrink-0 mt-0.5"
                    >
                      {item.confidence}
                    </Badge>
                    <span className="text-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Missing inputs */}
      {foundation.missing_inputs.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Missing Inputs
            </h3>
            <Separator className="flex-1" />
          </div>
          <Card className="border-amber-200 bg-amber-50/40">
            <CardContent className="pt-4">
              <ul className="space-y-1.5">
                {foundation.missing_inputs.map((item) => (
                  <li key={item} className="text-sm text-amber-800 flex gap-2 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

function FoundationBlock({ label, block }: { label: string; block: GroundedBlock }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </CardTitle>
          <Badge variant={block.confidence === "verified" ? "verified" : "inferred"}>
            {block.confidence}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {block.content}
        </p>
      </CardContent>
    </Card>
  );
}

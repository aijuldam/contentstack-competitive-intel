import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Canonical narrative" };

const MOCK_NARRATIVE = {
  meddic: [
    {
      key: "identify_pain",
      label: "Identify Pain",
      content:
        "RevOps teams spend 4–6 hours every week manually reconciling data across CRM, billing, and support tools. This creates forecast errors and deal slippage that compounds over time.",
      confidence: "verified",
    },
    {
      key: "metrics",
      label: "Metrics",
      content:
        "Target outcome: 80% reduction in reconciliation time. CRM error rate reduction from ~12% to <1% (reference customer, unattributed).",
      confidence: "inferred",
    },
    {
      key: "economic_buyer",
      label: "Economic Buyer",
      content:
        "VP of Revenue Operations at Series B–D SaaS companies ($10M–$100M ARR). Cares about forecast accuracy, data reliability, and team efficiency.",
      confidence: "inferred",
    },
    {
      key: "decision_criteria",
      label: "Decision Criteria",
      content: "Not yet specified. Add what the buyer evaluates vendors on.",
      confidence: "inferred",
    },
    {
      key: "decision_process",
      label: "Decision Process",
      content: "Not yet specified. Add typical procurement path and timeline.",
      confidence: "inferred",
    },
    {
      key: "champion",
      label: "Champion",
      content:
        "Likely a RevOps Analyst or senior RevOps Manager who owns the reconciliation workflow and will sponsor the purchase internally.",
      confidence: "inferred",
    },
  ],
  cotm: [
    {
      key: "current_state",
      label: "Current State",
      content:
        "RevOps teams export data manually from three systems every Monday morning. Errors are caught days later — sometimes not at all.",
      confidence: "verified",
    },
    {
      key: "negative_consequences",
      label: "Negative Consequences",
      content:
        "Forecast errors persist into QBRs. Deals slip because CRM gaps go unnoticed. Analysts spend capacity on reconciliation instead of analysis.",
      confidence: "verified",
    },
    {
      key: "required_capabilities",
      label: "Required Capabilities",
      content:
        "Bidirectional sync across CRM, billing, and support. No data warehouse required. Real-time or near-real-time updates.",
      confidence: "verified",
    },
    {
      key: "positive_outcomes",
      label: "Positive Business Outcomes",
      content:
        "80% reduction in reconciliation time. Forecast accuracy improves measurably. Analysts shift from data hygiene to strategic work.",
      confidence: "inferred",
    },
    {
      key: "proof_points",
      label: "Proof Points",
      content:
        "One customer reduced CRM error rate from 12% to under 1% in 30 days. No named attribution available yet.",
      confidence: "inferred",
    },
    {
      key: "differentiated_value",
      label: "Differentiated Value",
      content:
        "The only tool that syncs bidirectionally without requiring a data warehouse. Competitors require ETL setup or a separate data layer.",
      confidence: "inferred",
    },
  ],
};

interface PageProps {
  params: { id: string };
}

export default function NarrativePage({ params: _ }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Canonical Narrative</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Source of truth. All assets derive from this.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="verified">Verified</Badge> 8
            <span className="mx-1">·</span>
            <Badge variant="inferred">Inferred</Badge> 4
          </div>
        </div>
      </div>

      {/* MEDDIC */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">MEDDIC</h3>
          <Separator className="flex-1" />
        </div>
        <div className="space-y-3">
          {MOCK_NARRATIVE.meddic.map((block) => (
            <NarrativeBlock key={block.key} block={block} />
          ))}
        </div>
      </section>

      {/* Command of the Message */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Command of the Message</h3>
          <Separator className="flex-1" />
        </div>
        <div className="space-y-3">
          {MOCK_NARRATIVE.cotm.map((block) => (
            <NarrativeBlock key={block.key} block={block} />
          ))}
        </div>
      </section>
    </div>
  );
}

function NarrativeBlock({
  block,
}: {
  block: { key: string; label: string; content: string; confidence: string };
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {block.label}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={block.confidence === "verified" ? "verified" : "inferred"}
            >
              {block.confidence}
            </Badge>
            <Button size="icon-sm" variant="ghost" className="text-muted-foreground">
              ✎
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground">{block.content}</p>
      </CardContent>
    </Card>
  );
}

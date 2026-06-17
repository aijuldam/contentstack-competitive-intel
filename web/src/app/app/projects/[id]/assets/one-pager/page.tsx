"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RefreshCw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetSectionCard } from "@/components/app/AssetSectionCard";
import { FoundationDriftBanner } from "@/components/app/FoundationDriftBanner";
import { ExportScaffold } from "@/components/app/ExportScaffold";
import { AssetVersionHistory } from "@/components/app/AssetVersionHistory";

const SECTIONS = [
  {
    id: "headline",
    label: "Headline",
    content:
      "Stop reconciling your RevOps data. Start trusting your forecast.",
    confidence: "verified" as const,
    sourceBlocks: ["hero_statement", "identify_pain"],
    needsValidation: false,
  },
  {
    id: "who_its_for",
    label: "Who It's For",
    content:
      "Revenue Operations teams at Series B–D SaaS companies who manage CRM, billing, and support data manually. Typically: VP of RevOps, RevOps Manager, Senior RevOps Analyst.",
    confidence: "verified" as const,
    sourceBlocks: ["economic_buyer", "champion"],
    needsValidation: false,
  },
  {
    id: "the_problem",
    label: "The Problem",
    content:
      "RevOps teams spend 4–6 hours every week manually reconciling data across CRM, billing, and support tools. Errors go undetected for days. Forecasts miss. Deals slip. Analysts waste capacity on data hygiene instead of strategic work.",
    confidence: "verified" as const,
    sourceBlocks: ["identify_pain", "current_state", "negative_consequences"],
    needsValidation: false,
  },
  {
    id: "how_it_works",
    label: "How It Works",
    content:
      "1. Connect your CRM, billing system, and support tool via OAuth in under 30 minutes.\n2. Acme maps fields across systems automatically, with human review for edge cases.\n3. Changes sync bidirectionally in real time — no data warehouse, no ETL, no engineering dependency.",
    confidence: "verified" as const,
    sourceBlocks: ["required_capabilities", "solution_description"],
    needsValidation: false,
  },
  {
    id: "why_us",
    label: "Why Us",
    content:
      "The only RevOps sync tool that works bidirectionally without requiring a data warehouse or ETL pipeline. Competitors require additional data infrastructure. Acme connects directly to the source systems your team already uses.",
    confidence: "inferred" as const,
    sourceBlocks: ["differentiated_value"],
    needsValidation: true,
  },
  {
    id: "results",
    label: "Results",
    content:
      "80% reduction in reconciliation time within month one.\n\nCRM error rate reduced from 12% to under 1% in 30 days (reference customer).\n\nAnalysts shift from data hygiene to high-value strategic work.",
    confidence: "inferred" as const,
    sourceBlocks: ["proof_points", "positive_outcomes", "metrics"],
    needsValidation: true,
  },
  {
    id: "next_step",
    label: "Next Step",
    content:
      "Start a 14-day free trial at acme.io — no credit card required.\n\nOr book a 30-minute live walkthrough with a RevOps specialist.",
    confidence: "inferred" as const,
    sourceBlocks: [],
    needsValidation: false,
  },
];

const MOCK_VERSIONS = [
  {
    id: "av1op",
    versionNumber: 1,
    createdAt: "Jun 12, 2026",
    promptVersion: "asset.one_pager@1.0.0",
    foundationVersion: 1,
    isCurrent: true,
  },
];

export default function OnePagerPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [showHistory, setShowHistory] = useState(false);
  const hasDrift = true; // foundation v2 > asset generated on foundation v1

  const verifiedCount = SECTIONS.filter((s) => s.confidence === "verified").length;
  const inferredCount = SECTIONS.filter((s) => s.confidence === "inferred").length;

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" asChild className="-ml-2">
            <Link href={`/app/projects/${projectId}/assets`}>
              <ChevronLeft className="h-3.5 w-3.5" />
              Assets
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <h2 className="text-sm font-semibold">One-Pager</h2>
          <Badge variant="draft">v1</Badge>
          {hasDrift && (
            <Badge variant="inferred">Foundation updated</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowHistory((v) => !v)}
          >
            History
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
          <ExportScaffold assetType="one_pager" projectId={projectId} />
        </div>
      </div>

      {/* Confidence summary */}
      <div className="flex items-center gap-3 border-b border-border px-4 pb-3 pt-2 sm:px-6 text-xs">
        <Badge variant="verified">{verifiedCount} verified</Badge>
        <Badge variant="inferred">{inferredCount} inferred</Badge>
        <span className="ml-auto text-muted-foreground">7 sections · Foundation v1</span>
      </div>

      {/* Main area + optional history panel */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {hasDrift && (
              <FoundationDriftBanner projectId={projectId} />
            )}
            {SECTIONS.map((section) => (
              <AssetSectionCard
                key={section.id}
                label={section.label}
                content={section.content}
                confidence={section.confidence}
                needsValidation={section.needsValidation}
                sourceBlocks={section.sourceBlocks}
                onSave={(updated) => console.log("save", section.id, updated)}
              />
            ))}
          </div>
        </main>

        {showHistory && (
          <aside className="w-56 shrink-0 border-l border-border overflow-y-auto px-3 py-4">
            <h3 className="mb-2 text-xs font-semibold text-foreground">
              Version history
            </h3>
            <AssetVersionHistory versions={MOCK_VERSIONS} />
          </aside>
        )}
      </div>
    </div>
  );
}

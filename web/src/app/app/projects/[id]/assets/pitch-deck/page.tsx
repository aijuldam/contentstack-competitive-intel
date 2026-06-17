"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetSectionCard } from "@/components/app/AssetSectionCard";
import { FoundationDriftBanner } from "@/components/app/FoundationDriftBanner";
import { ExportScaffold } from "@/components/app/ExportScaffold";
import { AssetVersionHistory } from "@/components/app/AssetVersionHistory";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    id: "title",
    slideNumber: 1,
    label: "Cover",
    content:
      "Acme RevOps Platform\n\nAI-powered revenue data sync for B2B SaaS teams.\n\nStop reconciling. Start growing.",
    confidence: "verified" as const,
    sourceBlocks: ["product_name", "hero_statement"],
    needsValidation: false,
  },
  {
    id: "problem",
    slideNumber: 2,
    label: "The Problem",
    content:
      "RevOps teams at Series B–D SaaS companies spend 4–6 hours every week manually reconciling data across CRM, billing, and support tools.\n\nErrors go undetected for days. Forecast accuracy suffers. Analysts spend capacity on data hygiene instead of strategic work.",
    confidence: "verified" as const,
    sourceBlocks: ["identify_pain", "current_state"],
    needsValidation: false,
  },
  {
    id: "cost_of_inaction",
    slideNumber: 3,
    label: "Cost of Inaction",
    content:
      "Every week of delay costs an average of 4–6 analyst hours in manual work.\n\nCRM error rates of 12%+ compound into forecast misses, deal slippage, and QBR embarrassments that erode executive confidence in the RevOps function.\n\nThe problem does not resolve itself.",
    confidence: "verified" as const,
    sourceBlocks: ["negative_consequences", "metrics"],
    needsValidation: false,
  },
  {
    id: "solution",
    slideNumber: 4,
    label: "Our Solution",
    content:
      "Acme RevOps Platform syncs data bidirectionally across CRM, billing, and support—in real time, with no data warehouse required.\n\nSet up in under 30 minutes. Clean, consistent data across all your systems from day one.",
    confidence: "verified" as const,
    sourceBlocks: ["required_capabilities", "solution_description"],
    needsValidation: false,
  },
  {
    id: "differentiation",
    slideNumber: 5,
    label: "Why Us",
    content:
      "The only RevOps sync tool that works bidirectionally without requiring a data warehouse or ETL pipeline.\n\nCompetitors require additional data infrastructure that adds weeks of setup and ongoing maintenance.\n\nAcme connects directly to the source systems your team already uses.",
    confidence: "inferred" as const,
    sourceBlocks: ["differentiated_value", "competitive_landscape"],
    needsValidation: true,
  },
  {
    id: "proof",
    slideNumber: 6,
    label: "Proof Points",
    content:
      "One reference customer reduced CRM error rate from 12% to under 1% in 30 days.\n\nTeams report 80% reduction in weekly reconciliation time within the first month of use.\n\n(Reference customer unattributed by request.)",
    confidence: "inferred" as const,
    sourceBlocks: ["proof_points", "metrics"],
    needsValidation: true,
  },
  {
    id: "positive_outcomes",
    slideNumber: 7,
    label: "Positive Outcomes",
    content:
      "80% reduction in reconciliation time.\n\nCRM error rate below 1%.\n\nAnalysts shift from data hygiene to high-value strategic work.\n\nRevenue forecasts become reliable inputs to board-level planning.",
    confidence: "inferred" as const,
    sourceBlocks: ["positive_outcomes"],
    needsValidation: false,
  },
  {
    id: "call_to_action",
    slideNumber: 8,
    label: "Next Steps",
    content:
      "Start a 14-day free trial. No credit card required.\n\nYour data stays clean from day one.\n\nBook a 30-minute live walkthrough with a RevOps specialist.",
    confidence: "inferred" as const,
    sourceBlocks: [],
    needsValidation: false,
  },
];

const MOCK_VERSIONS = [
  {
    id: "av2",
    versionNumber: 2,
    createdAt: "Jun 14, 2026",
    promptVersion: "asset.pitch_deck@1.0.0",
    foundationVersion: 2,
    isCurrent: true,
  },
  {
    id: "av1",
    versionNumber: 1,
    createdAt: "Jun 10, 2026",
    promptVersion: "asset.pitch_deck@1.0.0",
    foundationVersion: 1,
    isCurrent: false,
  },
];

export default function PitchDeckPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [activeSlide, setActiveSlide] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const slide = SLIDES[activeSlide];
  const verifiedCount = SLIDES.filter((s) => s.confidence === "verified").length;
  const inferredCount = SLIDES.filter((s) => s.confidence === "inferred").length;
  const needsReviewCount = SLIDES.filter((s) => s.needsValidation).length;

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
          <h2 className="text-sm font-semibold">Pitch Deck</h2>
          <Badge variant="active">v2</Badge>
          {needsReviewCount > 0 && (
            <Badge variant="inferred">{needsReviewCount} need review</Badge>
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
          <ExportScaffold assetType="pitch_deck" />
        </div>
      </div>

      {/* Drift banner placeholder */}
      <div className="px-4 pt-4 sm:px-6">
        {/* Uncomment when drift is detected: */}
        {/* <FoundationDriftBanner projectId={projectId} className="mb-4" /> */}
      </div>

      {/* Confidence summary */}
      <div className="flex items-center gap-3 border-b border-border px-4 pb-3 pt-1 sm:px-6 text-xs text-muted-foreground">
        <span><Badge variant="verified">{verifiedCount} verified</Badge></span>
        <span><Badge variant="inferred">{inferredCount} inferred</Badge></span>
        <span className="ml-auto text-muted-foreground">8 slides · Foundation v2</span>
      </div>

      {/* Main two-panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide list sidebar */}
        <aside className="w-44 shrink-0 border-r border-border overflow-y-auto">
          <ol className="py-2">
            {SLIDES.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => setActiveSlide(i)}
                  className={cn(
                    "w-full px-3 py-2.5 text-left transition-colors",
                    i === activeSlide
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span className="block text-2xs font-medium text-muted-foreground mb-0.5">
                    Slide {s.slideNumber}
                  </span>
                  <span className="block text-xs font-medium leading-tight">
                    {s.label}
                  </span>
                  {s.needsValidation && (
                    <span className="mt-1 block text-2xs text-amber-600 dark:text-amber-400">
                      Review needed
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* Active slide content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-4">
            <AssetSectionCard
              key={slide.id}
              label={`Slide ${slide.slideNumber} — ${slide.label}`}
              content={slide.content}
              confidence={slide.confidence}
              needsValidation={slide.needsValidation}
              sourceBlocks={slide.sourceBlocks}
              onSave={(updated) => console.log("save", slide.id, updated)}
            />

            {/* Slide navigation */}
            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide((i) => i - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                {activeSlide + 1} / {SLIDES.length}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={activeSlide === SLIDES.length - 1}
                onClick={() => setActiveSlide((i) => i + 1)}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </main>

        {/* Version history panel */}
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

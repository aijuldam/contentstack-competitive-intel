"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RefreshCw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetSectionCard } from "@/components/app/AssetSectionCard";
import { ExportScaffold } from "@/components/app/ExportScaffold";
import { AssetVersionHistory } from "@/components/app/AssetVersionHistory";
import { cn } from "@/lib/utils/cn";

interface Section {
  id: string;
  label: string;
  content: string;
  confidence: "verified" | "inferred";
  sourceBlocks: string[];
  needsValidation: boolean;
}

const SECTIONS: Section[] = [
  {
    id: "buyer_profile",
    label: "Buyer Profile",
    content:
      "Primary buyer: VP of Revenue Operations at Series B–D SaaS companies ($10M–$100M ARR).\n\nCares about: forecast accuracy, data reliability, team efficiency.\n\nSecondary: RevOps Manager or Senior Analyst who will sponsor internally.\n\nCommon titles: Head of RevOps, Revenue Operations Manager, Senior RevOps Analyst.",
    confidence: "verified" as const,
    sourceBlocks: ["economic_buyer", "champion"],
    needsValidation: false,
  },
  {
    id: "common_pains",
    label: "Common Pains",
    content:
      "1. Manual CRM reconciliation consuming 4–6 hours/week\n2. Forecast errors discovered only after the fact, in QBRs\n3. Support tickets not reflected in CRM risk scores\n4. RevOps team perceived as a cost center, not a strategic asset\n5. Integration projects stuck in data engineering queue for weeks",
    confidence: "verified" as const,
    sourceBlocks: ["identify_pain", "current_state", "negative_consequences"],
    needsValidation: false,
  },
  {
    id: "discovery_questions",
    label: "Discovery Questions",
    content:
      "- How many hours per week does your team spend on data reconciliation today?\n- When was the last time a deal slipped because of a CRM data gap?\n- Who owns the relationship between your CRM and billing system today?\n- What would it mean for your forecast accuracy if your CRM was always clean?\n- How long does it typically take to get a new integration to production?\n- If you could fix one data problem by end of quarter, what would it be?",
    confidence: "inferred" as const,
    sourceBlocks: ["identify_pain", "decision_criteria"],
    needsValidation: false,
  },
  {
    id: "solution_narrative",
    label: "Solution Narrative",
    content:
      "Acme RevOps Platform connects your CRM, billing, and support tools and keeps them in sync — bidirectionally, in real time.\n\nNo data warehouse. No ETL pipeline. No engineering dependency.\n\nYour team gets clean data in every system, starting within 30 minutes of setup.",
    confidence: "verified" as const,
    sourceBlocks: ["required_capabilities", "solution_description"],
    needsValidation: false,
  },
  {
    id: "competitive_differentiation",
    label: "Competitive Angles",
    content:
      "vs. Workato/Zapier:\nThose are general automation tools. Acme is purpose-built for revenue data sync with CRM-native field mapping and two-way conflict resolution.\n\nvs. Census/Hightouch:\nThose require a data warehouse as the source of truth. Acme syncs directly between operational systems — no warehouse needed.\n\nvs. Native CRM integrations:\nOne-directional only. Acme writes back to all connected systems, keeping everything in sync regardless of where the update originates.",
    confidence: "inferred" as const,
    sourceBlocks: ["differentiated_value", "competitive_landscape"],
    needsValidation: true,
  },
  {
    id: "proof_points",
    label: "Proof Points",
    content:
      "- One customer reduced CRM error rate from 12% to under 1% in 30 days\n- Teams report 80% reduction in weekly reconciliation time within month one\n- Average time-to-value: under 30 minutes from account creation to first sync\n- Zero data warehouse dependencies in any active customer deployment\n\n(Reference customer unattributed by request.)",
    confidence: "inferred" as const,
    sourceBlocks: ["proof_points", "metrics"],
    needsValidation: true,
  },
  {
    id: "objection_handling",
    label: "Objection Handling",
    content:
      '"We already have Zapier for this."\n→ Zapier automates one-directional triggers. Acme handles two-way conflict resolution and field-level mapping purpose-built for revenue data.\n\n"We need to involve engineering."\n→ No engineering required. Acme connects to your existing systems via OAuth. Setup takes under 30 minutes.\n\n"We\'re mid-quarter and can\'t start a new tool evaluation."\n→ Proof of concept takes one afternoon. Value is visible immediately — no migration, no downtime, no dependencies.',
    confidence: "inferred" as const,
    sourceBlocks: ["objections"],
    needsValidation: false,
  },
  {
    id: "decision_process_guide",
    label: "Decision Process Guide",
    content:
      "Typical buying process:\n1. RevOps Manager identifies the pain, runs a proof-of-concept\n2. VP RevOps validates business case and sponsors budget\n3. IT/Security reviews data handling (SOC 2 Type II available)\n4. Finance approves annual contract\n\nCommon procurement timeline: 2–4 weeks at SMB, 6–10 weeks at Enterprise.\n\nProcurement gate: security review. Prepare SOC 2 documentation early.",
    confidence: "inferred" as const,
    sourceBlocks: ["decision_process", "decision_criteria"],
    needsValidation: false,
  },
  {
    id: "champion_enablement",
    label: "Champion Enablement",
    content:
      'Internal pitch for your champion to use:\n\n"We\'re spending 5+ hours a week on manual data reconciliation that causes forecast errors. Acme RevOps Platform eliminates this with real-time bidirectional sync — no data warehouse required. One customer reduced their CRM error rate from 12% to under 1% in 30 days. At our scale, that\'s 4–6 analyst hours recovered per week and significantly better forecast reliability for QBRs."',
    confidence: "inferred" as const,
    sourceBlocks: ["champion", "proof_points"],
    needsValidation: false,
  },
];

const TABS = [
  {
    id: "buyer",
    label: "Buyer Intel",
    sectionIds: ["buyer_profile", "common_pains"],
  },
  {
    id: "discovery",
    label: "Discovery",
    sectionIds: ["discovery_questions", "solution_narrative"],
  },
  {
    id: "win",
    label: "Win the Deal",
    sectionIds: ["competitive_differentiation", "proof_points", "objection_handling"],
  },
  {
    id: "close",
    label: "Close Process",
    sectionIds: ["decision_process_guide", "champion_enablement"],
  },
];

const MOCK_VERSIONS = [
  {
    id: "av1sd",
    versionNumber: 1,
    createdAt: "Jun 15, 2026",
    promptVersion: "asset.sales_deck@1.0.0",
    foundationVersion: 2,
    isCurrent: true,
  },
];

export default function SalesEnablementPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [activeTab, setActiveTab] = useState("buyer");
  const [showHistory, setShowHistory] = useState(false);

  const activeTabDef = TABS.find((t) => t.id === activeTab)!;
  const activeSections = SECTIONS.filter((s) =>
    activeTabDef.sectionIds.includes(s.id)
  );

  const needsReviewCount = SECTIONS.filter((s) => s.needsValidation).length;

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
          <h2 className="text-sm font-semibold">Sales Enablement Deck</h2>
          <Badge variant="active">v1</Badge>
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
          <ExportScaffold assetType="sales_deck" projectId={projectId} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 overflow-x-auto border-b border-border px-4 sm:px-6">
        {TABS.map((tab) => {
          const tabSections = SECTIONS.filter((s) => tab.sectionIds.includes(s.id));
          const hasReview = tabSections.some((s) => s.needsValidation);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex h-10 shrink-0 items-center gap-1.5 px-4 text-sm transition-colors",
                activeTab === tab.id
                  ? "font-medium text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {hasReview && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {activeTabDef.label}
              </h3>
              <span className="text-xs text-muted-foreground">
                {activeSections.length} section{activeSections.length !== 1 ? "s" : ""}
              </span>
            </div>
            {activeSections.map((section) => (
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

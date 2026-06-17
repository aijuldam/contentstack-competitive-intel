import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, LayoutTemplate, Presentation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Product",
  description: "How Go-to-Market Taste structures your B2B SaaS messaging.",
};

const stages = [
  {
    stage: "Stage 1",
    title: "Intake",
    description:
      "You fill in four fields: what your product does, who buys it and uses it, what it costs buyers to do nothing, and what makes you different from alternatives. Plain language. No structured format required.",
    detail:
      "The system parses your text into structured data: explicit facts, inferred interpretations, confidence notes, and a list of gaps that matter for sales positioning. Nothing is invented. Gaps are flagged for you to fill in, not silently assumed.",
  },
  {
    stage: "Stage 2",
    title: "Core Narrative",
    description:
      "Your intake is shaped into a full MEDDIC-aligned narrative using the Command of the Message structure. Each section covers a specific element of the framework.",
    detail:
      "Every claim in the narrative is tagged: verified means you stated it in the intake, inferred means the model interpreted it from your inputs. You review each section, edit freely, accept or dismiss inferences, and lock in the version you trust before any assets are generated from it.",
  },
  {
    stage: "Stage 3",
    title: "Asset Generation",
    description:
      "Three assets are derived from your approved narrative: a pitch deck, a one-pager, and a sales enablement deck. Each maps its sections directly to narrative source elements.",
    detail:
      "Because all three assets share the same source, they stay consistent with each other. If you update the narrative and regenerate, the change propagates. You can also edit any asset directly without touching the narrative.",
  },
];

const narrativeSections = [
  { framework: "MEDDIC", element: "Identify Pain", description: "The specific problem driving urgency to buy" },
  { framework: "MEDDIC", element: "Metrics", description: "Quantified business impact of solving the problem" },
  { framework: "MEDDIC", element: "Economic Buyer", description: "Who controls budget and signs off on the purchase" },
  { framework: "MEDDIC", element: "Decision Criteria", description: "How the buyer evaluates and compares solutions" },
  { framework: "MEDDIC", element: "Champion", description: "Your internal advocate and their motivations" },
  { framework: "Command of the Message", element: "Current State", description: "Where the buyer is today and what is broken" },
  { framework: "Command of the Message", element: "Negative Consequences", description: "What staying in the current state costs the buyer" },
  { framework: "Command of the Message", element: "Required Capabilities", description: "What a solution must be able to do to qualify" },
  { framework: "Command of the Message", element: "Positive Business Outcomes", description: "What the buyer's world looks like after solving the problem" },
  { framework: "Command of the Message", element: "Proof Points", description: "Evidence that backs your claims: metrics, case studies, references" },
  { framework: "Command of the Message", element: "Differentiated Value", description: "Why you specifically, not a competitor or a workaround" },
];

const assets = [
  {
    icon: Presentation,
    name: "Pitch Deck",
    audience: "External: prospects, investors, partners",
    sections: [
      "The Problem (from Identify Pain + Current State)",
      "Cost of Inaction (from Negative Consequences + Metrics)",
      "Our Approach (from Required Capabilities)",
      "Why We Win (from Differentiated Value + Proof Points)",
      "What Success Looks Like (from Positive Business Outcomes)",
      "Next Steps",
    ],
  },
  {
    icon: FileText,
    name: "One-Pager",
    audience: "External: for champions to circulate internally",
    sections: [
      "Product headline and summary",
      "The problem and cost of doing nothing",
      "Key capabilities and outcomes",
      "Differentiation and proof",
      "Call to action",
    ],
  },
  {
    icon: LayoutTemplate,
    name: "Sales Enablement Deck",
    audience: "Internal: AEs, SEs, and sales leadership",
    sections: [
      "Discovery question bank (mapped to pain areas)",
      "Objection responses (common blockers + counters)",
      "Competitive positioning (by alternative)",
      "Champion enablement (internal personas + their motivations)",
      "Proof point library",
    ],
  },
];

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">

      {/* Header */}
      <div className="mb-16 text-center">
        <Badge variant="secondary" className="mb-4">Product</Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          A structured system, not a prompt tool
        </h1>
        <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
          Go-to-Market Taste runs a three-stage pipeline: intake, narrative, assets.
          MEDDIC and Command of the Message are baked into every stage, not applied as a label afterward.
        </p>
      </div>

      {/* Pipeline stages */}
      <div className="mb-20 space-y-0">
        {stages.map((item, i) => (
          <div
            key={item.stage}
            className={`grid gap-6 py-10 md:grid-cols-4 ${
              i < stages.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <p className="label-xs text-primary">{item.stage}</p>
            </div>
            <div className="md:col-span-3">
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Narrative structure */}
      <div className="mb-20">
        <div className="mb-8">
          <p className="label-xs mb-1">Stage 2 in detail</p>
          <h2 className="text-xl font-semibold tracking-tight">What the core narrative covers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Eleven sections. Each maps to a specific element of MEDDIC or Command of the Message.
          </p>
        </div>
        <div className="divide-y divide-border rounded-lg border border-border">
          {narrativeSections.map((s) => (
            <div key={s.element} className="grid gap-1 px-4 py-3 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                <span className="text-sm font-medium text-foreground">{s.element}</span>
              </div>
              <p className="text-sm text-muted-foreground sm:col-span-2">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Asset breakdown */}
      <div className="mb-20">
        <div className="mb-8">
          <p className="label-xs mb-1">Stage 3 in detail</p>
          <h2 className="text-xl font-semibold tracking-tight">What each asset contains</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each asset draws its content from specific narrative sections. No section is invented separately.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {assets.map((asset) => (
            <div key={asset.name} className="rounded-lg border border-border bg-background p-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <asset.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-0.5 text-sm font-semibold">{asset.name}</h3>
              <p className="mb-3 text-2xs text-muted-foreground">{asset.audience}</p>
              <ul className="space-y-1.5">
                {asset.sections.map((s) => (
                  <li key={s} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
        <h2 className="mb-2 text-lg font-semibold">Ready to see it work on your product?</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Free to start. Fill in four fields and get your core narrative in minutes.
        </p>
        <Button asChild>
          <Link href="/signup">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

    </div>
  );
}

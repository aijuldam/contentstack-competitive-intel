import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, LayoutTemplate, Presentation, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Fill in 4 intake fields",
    description:
      "Describe your product, your buyer, the cost of inaction, and your differentiation. Plain language. No formatting required.",
  },
  {
    number: "02",
    title: "Review the canonical narrative",
    description:
      "The AI produces a structured MEDDIC + Command of the Message narrative. Verified facts are separated from inferred assumptions. You edit before locking.",
  },
  {
    number: "03",
    title: "Generate all assets at once",
    description:
      "Pitch deck, one-pager, and sales enablement deck derive from the same narrative. Change the source, everything updates.",
  },
];

const assets = [
  {
    icon: Presentation,
    title: "Pitch Deck",
    description: "Structured slide narrative aligned to buyer journey — problem, cost, solution, proof, outcomes.",
  },
  {
    icon: FileText,
    title: "One-Pager",
    description: "Single-page leave-behind for champions to share internally. Skimmable and framework-native.",
  },
  {
    icon: LayoutTemplate,
    title: "Sales Enablement Deck",
    description: "AE/SE playbook with discovery questions, objection handling, competitive angles, and proof points.",
  },
];

const frameworks = [
  {
    name: "MEDDIC",
    items: ["Metrics", "Economic Buyer", "Decision Criteria", "Decision Process", "Identify Pain", "Champion"],
    color: "bg-blue-50 border-blue-200 text-blue-900",
    labelColor: "text-blue-600",
  },
  {
    name: "Command of the Message",
    items: ["Current State", "Negative Consequences", "Required Capabilities", "Positive Outcomes", "Proof Points", "Differentiated Value"],
    color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    labelColor: "text-indigo-600",
  },
];

const personas = [
  { role: "Product Marketers", use: "Build the canonical narrative once. Maintain it as the source of truth." },
  { role: "Founders", use: "Stop re-explaining your product in every pitch. Structured thinking, fast output." },
  { role: "Sales Leaders", use: "Give AEs a consistent, framework-native sales deck on day one." },
  { role: "AEs & SEs", use: "Know exactly what to say, what the buyer cares about, and how to differentiate." },
  { role: "Consultants", use: "Deliver structured messaging assets for B2B SaaS clients in hours, not weeks." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Badge variant="secondary" className="mb-6 inline-flex">
            <Sparkles className="h-3 w-3" />
            MEDDIC + Command of the Message, built in
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            One source of truth.
            <br />
            <span className="text-primary">Every asset aligned.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Turn a 10-minute intake into a canonical sales narrative, pitch deck,
            one-pager, and sales enablement deck — with verified facts
            separated from assumptions throughout.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="xl" asChild>
              <Link href="/signup">
                Create your first project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/examples">See examples</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required. Free to start.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">How it works</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Intake to assets in three steps
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-3 font-mono text-3xl font-bold text-border">
                  {step.number}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">Framework-native</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Not a prompt. A structured system.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              NarrativeKit bakes MEDDIC and Command of the Message into every
              output — not as cosmetic labels, but as structural scaffolding.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {frameworks.map((fw) => (
              <div
                key={fw.name}
                className={`rounded-lg border p-5 ${fw.color}`}
              >
                <p className={`label-xs mb-3 ${fw.labelColor}`}>{fw.name}</p>
                <ul className="space-y-1.5">
                  {fw.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assets */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">What you get</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Three assets. One narrative.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {assets.map((asset) => (
              <Card key={asset.title} hover>
                <CardHeader>
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                    <asset.icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle>{asset.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{asset.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verified vs inferred */}
      <section className="border-t border-b border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="label-xs mb-2">Epistemic clarity</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Verified facts vs. inferred assumptions — always explicit.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Every claim in your narrative and assets is tagged. Verified
                means the user provided it. Inferred means the AI derived it.
                You decide what to promote, dismiss, or fill in. No silent
                assumptions buried in a deck.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    Verified
                  </span>
                  Drawn directly from your intake
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                    Inferred
                  </span>
                  Model interpretation — review and confirm
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-background p-5 shadow-card">
              <p className="label-xs mb-3">Canonical narrative excerpt</p>
              <div className="space-y-3">
                {[
                  { label: "Identify Pain", text: "RevOps teams lose 4–6 hours per week reconciling CRM data manually across three tools.", badge: "verified" },
                  { label: "Economic Buyer", text: "VP of Revenue Operations or CRO at Series B–D SaaS companies ($10M–$100M ARR).", badge: "inferred" },
                  { label: "Metrics", text: "Time savings not yet quantified — user mentioned 'hours saved' without specifics.", badge: "inferred" },
                ].map((item) => (
                  <div key={item.label} className="rounded-md border border-border p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-2xs font-medium ring-1 ring-inset ${
                          item.badge === "verified"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">Built for</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Every role in the revenue team
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((p) => (
              <div
                key={p.role}
                className="rounded-lg border border-border bg-background p-4"
              >
                <p className="mb-1 text-sm font-medium text-foreground">{p.role}</p>
                <p className="text-sm text-muted-foreground">{p.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground sm:text-3xl">
            Stop rebuilding from scratch.
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            One canonical narrative. Every asset aligned. Start in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/signup">
                Create your project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/product">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

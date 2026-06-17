import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LayoutTemplate,
  Presentation,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Fill in four fields",
    description:
      "Describe what your product does, who buys it and uses it, what it costs buyers to do nothing, and what makes you different. Plain language. No formatting required.",
  },
  {
    number: "02",
    title: "Review the core narrative",
    description:
      "Go-to-Market Taste produces a structured narrative grounded in MEDDIC and Command of the Message. Every claim is tagged: facts you provided, or interpretations the model made.",
  },
  {
    number: "03",
    title: "Edit and confirm",
    description:
      "Accept, dismiss, or rewrite any section. Lock in the version you trust before anything is generated from it.",
  },
  {
    number: "04",
    title: "Generate all three assets",
    description:
      "Your pitch deck, one-pager, and sales enablement deck are each derived from the same approved narrative. Change the source, regenerate the asset.",
  },
];

const frameworks = [
  {
    name: "MEDDIC",
    summary: "A sales qualification framework that defines what must be true for a deal to close.",
    items: [
      { label: "Metrics", note: "Quantified business impact" },
      { label: "Economic Buyer", note: "Who controls the budget" },
      { label: "Decision Criteria", note: "How the buyer evaluates options" },
      { label: "Decision Process", note: "Steps to a signed contract" },
      { label: "Identify Pain", note: "The specific problem driving urgency" },
      { label: "Champion", note: "Your internal advocate" },
    ],
  },
  {
    name: "Command of the Message",
    summary: "A messaging framework that defines how to articulate value to any buyer.",
    items: [
      { label: "Current State", note: "Where the buyer is today" },
      { label: "Negative Consequences", note: "Cost of staying put" },
      { label: "Required Capabilities", note: "What a solution must do" },
      { label: "Positive Business Outcomes", note: "What success looks like" },
      { label: "Proof Points", note: "Evidence that backs your claims" },
      { label: "Differentiated Value", note: "Why you, not a competitor" },
    ],
  },
];

const roles = [
  {
    role: "Founders",
    use: "Stop re-explaining your product in every pitch. Four inputs, consistent messaging every time.",
  },
  {
    role: "Product Marketers",
    use: "Build the core narrative once and maintain it as the authoritative source. Every asset stays in sync.",
  },
  {
    role: "Account Executives and Sales Teams",
    use: "Know exactly what to say, what the buyer cares about, and how to differentiate. Day one.",
  },
  {
    role: "Consultants and Agencies",
    use: "Deliver structured messaging assets for B2B SaaS clients in hours instead of weeks.",
  },
];

const differentiators = [
  {
    title: "Structured inputs, not open-ended prompts",
    description:
      "Four specific fields guide what goes in. The output reflects what you actually know about your product and buyer, not a generic response to a vague query.",
  },
  {
    title: "One narrative drives every asset",
    description:
      "Your pitch deck, one-pager, and sales enablement deck all derive from the same approved source. No copy-paste drift between documents.",
  },
  {
    title: "Verified facts vs. model interpretations, always explicit",
    description:
      "Every claim is tagged. You know which statements came from your intake and which were inferred. Nothing is buried or assumed.",
  },
  {
    title: "Editable at every layer",
    description:
      "Edit the core narrative, then regenerate assets. Or edit an asset directly. The system does not lock you out of your own content.",
  },
  {
    title: "GTM rigor built in",
    description:
      "MEDDIC and Command of the Message are structural scaffolding, not decorative labels. Every output section maps to a framework element.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For founders and solo PMMs getting started.",
    features: ["3 projects", "Core narrative generation", "All 3 asset types", "Inline editing"],
    cta: "Start free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    per: "/month",
    description: "For PMMs, AEs, and consultants who ship regularly.",
    features: [
      "Unlimited projects",
      "Everything in Starter",
      "PDF export",
      "Narrative versioning",
      "Priority generation",
    ],
    cta: "Start free trial",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "Custom",
    description: "For revenue teams and agencies with shared workspaces.",
    features: ["Everything in Pro", "Team workspaces", "Shared projects", "SSO", "Dedicated support"],
    cta: "Contact us",
    href: "mailto:hello@gotomarkettaste.com",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Who is this for?",
    a: "Go-to-Market Taste is built for anyone who needs to explain a B2B SaaS product clearly and consistently: founders, product marketers, account executives, sales leaders, and consultants.",
  },
  {
    q: "Do I need to be a product marketer to use it?",
    a: "No. The intake form asks plain-language questions. If you can describe what your product does and who buys it, you can produce structured messaging from it.",
  },
  {
    q: "Can I edit the generated content?",
    a: "Yes. Every section of the core narrative and every asset is editable inline. You can revise the narrative and regenerate assets, or edit an asset directly.",
  },
  {
    q: "What kind of products does this work for?",
    a: "It works best for B2B SaaS products sold to business buyers with a defined sales process. It is not optimized for consumer apps or products without a clear commercial buyer.",
  },
  {
    q: "Why do you ask for a work email?",
    a: "Go-to-Market Taste is a tool for professional teams. Work email keeps accounts tied to the organizations they serve and makes team-level access easier to manage.",
  },
  {
    q: "Is this for internal enablement or external pitching too?",
    a: "Both. The pitch deck and one-pager are designed for external audiences (prospects, investors). The sales enablement deck is an internal playbook for AEs and SEs.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-6 inline-flex">
                MEDDIC + Command of the Message, built in
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Describe your product once.
                <br />
                <span className="text-primary">Ship your sales assets.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Fill in four fields. Go-to-Market Taste builds your core sales narrative
                and derives a pitch deck, one-pager, and sales enablement deck from it.
                All assets stay aligned to the same source.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="xl" asChild>
                  <Link href="/signup">
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/examples">View example output</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Free to start. No credit card required.
              </p>
            </div>

            {/* Narrative preview */}
            <div className="rounded-lg border border-border bg-background p-5 shadow-card">
              <p className="label-xs mb-3">Core narrative excerpt</p>
              <div className="space-y-3">
                {[
                  {
                    label: "Identify Pain",
                    text: "RevOps teams lose 4 to 6 hours per week reconciling CRM data manually across three tools.",
                    badge: "verified",
                  },
                  {
                    label: "Economic Buyer",
                    text: "VP of Revenue Operations or CRO at Series B to D SaaS companies ($10M to $100M ARR).",
                    badge: "inferred",
                  },
                  {
                    label: "Metrics",
                    text: "Time savings not yet quantified. User mentioned hours saved without specifics.",
                    badge: "inferred",
                  },
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
              <p className="mt-3 text-2xs text-muted-foreground">
                Every claim tagged. Verified means you said it. Inferred means the model interpreted it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">How it works</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Intake to assets in four steps
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
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

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <section className="border-b border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">What you get</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Three assets. One source.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Each asset is derived from your approved narrative. They stay aligned
              because they come from the same place.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">

            {/* Pitch Deck */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                <Presentation className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">Pitch Deck</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Slide narrative aligned to the buyer journey.
              </p>
              <div className="space-y-1.5 rounded-md border border-dashed border-border bg-muted/30 p-3">
                {[
                  "01 · The Problem",
                  "02 · Cost of Inaction",
                  "03 · Our Approach",
                  "04 · Key Capabilities",
                  "05 · Proof Points",
                  "06 · Call to Action",
                ].map((slide) => (
                  <div key={slide} className="text-xs text-muted-foreground">
                    {slide}
                  </div>
                ))}
              </div>
            </div>

            {/* One-Pager */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">One-Pager</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Single-page leave-behind for champions to share internally.
              </p>
              <div className="space-y-2 rounded-md border border-dashed border-border bg-muted/30 p-3">
                <div className="h-2.5 w-24 rounded bg-border" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <div className="text-2xs font-medium text-muted-foreground">THE PROBLEM</div>
                    <div className="h-1.5 w-full rounded bg-border/60" />
                    <div className="h-1.5 w-4/5 rounded bg-border/60" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xs font-medium text-muted-foreground">THE SOLUTION</div>
                    <div className="h-1.5 w-full rounded bg-border/60" />
                    <div className="h-1.5 w-3/5 rounded bg-border/60" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-2xs font-medium text-muted-foreground">WHY WE WIN</div>
                  <div className="h-1.5 w-full rounded bg-border/60" />
                  <div className="h-1.5 w-4/5 rounded bg-border/60" />
                </div>
                <div className="pt-1">
                  <div className="h-5 w-20 rounded bg-primary/20" />
                </div>
              </div>
            </div>

            {/* Sales Enablement Deck */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                <LayoutTemplate className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">Sales Enablement Deck</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Internal AE/SE playbook with discovery and objection handling.
              </p>
              <div className="space-y-2 rounded-md border border-dashed border-border bg-muted/30 p-3">
                {[
                  { label: "Discovery Questions", count: "8" },
                  { label: "Objection Responses", count: "6" },
                  { label: "Competitive Angles", count: "4" },
                  { label: "Champion Guide", count: "3 personas" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono text-2xs text-muted-foreground/60">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Frameworks ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">Framework-native</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Not a prompt. A structured system.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              MEDDIC and Command of the Message are baked into every output as structural
              scaffolding, not cosmetic labels. Together they cover both sides of the
              sales equation: qualifying the deal and articulating the value.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {frameworks.map((fw) => (
              <div key={fw.name} className="rounded-lg border border-border bg-background p-6">
                <p className="label-xs mb-1 text-primary">{fw.name}</p>
                <p className="mb-4 text-xs text-muted-foreground">{fw.summary}</p>
                <ul className="space-y-2">
                  {fw.items.map((item) => (
                    <li key={item.label} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                      <span>
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-muted-foreground"> — {item.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">Built for</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Every role in the revenue team
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {roles.map((r) => (
              <div
                key={r.role}
                className="rounded-lg border border-border bg-background p-5"
              >
                <p className="mb-1.5 text-sm font-semibold text-foreground">{r.role}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiation ──────────────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">Why Go-to-Market Taste</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Not a content generator. A GTM system.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Generic AI tools produce content. Go-to-Market Taste produces structured,
              traceable, editable sales messaging grounded in proven frameworks.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.title} className="rounded-lg border border-border bg-background p-5">
                <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">{d.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ───────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">Pricing</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Start free. Scale when you need to.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border bg-background p-6 ${
                  plan.highlighted ? "border-primary shadow-card" : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="mb-3">Most popular</Badge>
                )}
                <div className="mb-1 text-sm font-semibold text-foreground">{plan.name}</div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                  {plan.per && (
                    <span className="text-sm text-muted-foreground">{plan.per}</span>
                  )}
                </div>
                <p className="mb-4 text-xs text-muted-foreground">{plan.description}</p>
                <ul className="mb-5 space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/pricing" className="underline underline-offset-2 hover:text-foreground">
              See full pricing details
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="label-xs mb-2">FAQ</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Common questions
            </h2>
          </div>
          <dl className="divide-y divide-border">
            {faqs.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="mb-2 text-sm font-semibold text-foreground">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              View all FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-primary py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground sm:text-3xl">
            Stop rebuilding your pitch from scratch.
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            One intake. Three assets. A consistent story for every sales conversation.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/signup">
                Create account
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

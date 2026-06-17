import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PLANS } from "@/lib/billing/plans";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { TrackedCta } from "@/components/analytics/TrackedCta";
import { E } from "@/lib/analytics/events";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for Go-to-Market Taste.",
};

const FREE = PLANS.free;
const PAID = PLANS.paid_monthly;

const freeFeatures = [
  "MEDDIC framework guide",
  "Command of the Message guide",
  "Messaging templates and examples",
  "Example GTM asset outputs",
  "Framework explanations and guides",
];

const paidFeatures = [
  "Everything in Free",
  "Unlimited projects",
  "Generate your Messaging Foundation",
  "Generate pitch deck, one-pager, and sales deck",
  "Versioned workspace — edit and track changes",
  "HTML export for all asset types",
  "Verified vs. inferred provenance tagging",
];

const faqs = [
  {
    q: "What is included in the free plan?",
    a: "The free plan gives you access to the MEDDIC and Command of the Message framework guides, messaging templates, and example GTM asset outputs. It's designed to help you understand the frameworks and see what well-structured messaging looks like.",
  },
  {
    q: "What does the €5/month plan unlock?",
    a: "The paid plan unlocks the full product workflow: create projects, fill in your intake, generate a structured Messaging Foundation, and derive a pitch deck, one-pager, and sales enablement deck — all from a single approved narrative.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Cancel from the billing page at any time. Your access remains active until the end of the billing period.",
  },
  {
    q: "Is there a free trial for the paid plan?",
    a: "Start with the free plan to explore the frameworks and examples. When you're ready to generate assets, upgrade to the paid plan.",
  },
  {
    q: "Is the price in euros?",
    a: "Yes, the price is €5/month. Currency conversion is handled by Stripe at checkout based on your payment method.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">

      {/* Header */}
      <div className="mb-4 text-center">
        <Badge variant="secondary" className="mb-4">Pricing</Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Simple, honest pricing
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
          Start free with the frameworks and examples. Upgrade when you're ready
          to turn your positioning into real GTM assets.
        </p>
      </div>

      <PageViewTracker event={E.PRICING_PAGE_VIEWED} properties={{ source_page: "pricing" }} />

      {/* Repeated CTA above fold */}
      <div className="mb-12 flex justify-center">
        <TrackedCta
          label="Start for €5/month"
          href="/signup?plan=paid_monthly"
          event={E.PAID_CTA_CLICKED}
          properties={{ pricing_cta: "Start for €5/month", location: "pricing_page_top" }}
        />
      </div>

      {/* Plan cards */}
      <div className="mb-16 grid gap-6 md:grid-cols-2">

        {/* Free */}
        <Card>
          <CardHeader className="pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {FREE.displayName}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{FREE.priceDisplay}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {FREE.pricingDescription}
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <TrackedCta
              label={FREE.ctaLabel}
              href={FREE.ctaHref}
              event={E.FREE_RESOURCES_CLICKED}
              properties={{ pricing_cta: FREE.ctaLabel, location: "pricing_page_card" }}
              variant="outline"
              className="w-full"
            />
          </CardFooter>
        </Card>

        {/* Paid */}
        <Card className="border-primary shadow-card">
          <CardHeader className="pb-4">
            <Badge className="mb-1 w-fit">Full product access</Badge>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {PAID.displayName}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{PAID.priceDisplay}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {PAID.pricingDescription}
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2.5">
              {paidFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <TrackedCta
              label={PAID.ctaLabel}
              href={PAID.ctaHref}
              event={E.PAID_CTA_CLICKED}
              properties={{ pricing_cta: PAID.ctaLabel, location: "pricing_page_card" }}
              className="w-full"
            />
          </CardFooter>
        </Card>

      </div>

      {/* What the workflow looks like */}
      <div className="mb-16 rounded-lg border border-border bg-muted/20 p-6 sm:p-8">
        <h2 className="mb-1 text-sm font-semibold">The full paid workflow</h2>
        <p className="mb-5 text-xs text-muted-foreground">
          Everything the €5/month plan gives you access to, end to end.
        </p>
        <ol className="space-y-3">
          {[
            { n: "01", label: "Fill in four fields", detail: "Describe your product, buyer, problem, and differentiation in plain language." },
            { n: "02", label: "Generate your Messaging Foundation", detail: "Go-to-Market Taste produces a structured narrative grounded in MEDDIC and Command of the Message. Every claim is tagged: facts you provided or interpretations the model made." },
            { n: "03", label: "Review and approve", detail: "Edit any section. Lock in the version you trust before anything is generated from it." },
            { n: "04", label: "Generate all three assets", detail: "Your pitch deck, one-pager, and sales enablement deck are each derived from the same approved narrative." },
          ].map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="mt-0.5 font-mono text-xs font-bold text-muted-foreground/40 shrink-0 w-5">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="mb-6 text-center text-base font-semibold">Common questions</h2>
        <dl className="divide-y divide-border">
          {faqs.map((item) => (
            <div key={item.q} className="py-4">
              <dt className="mb-1.5 text-sm font-medium text-foreground">{item.q}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="mb-1 text-sm font-semibold text-foreground">Ready to generate your first GTM assets?</p>
        <p className="mb-5 text-sm text-muted-foreground">
          Start with the free plan to explore the frameworks.
          Upgrade to generate your Messaging Foundation and GTM assets.
        </p>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <TrackedCta
            label="Start for €5/month"
            href="/signup?plan=paid_monthly"
            event={E.PAID_CTA_CLICKED}
            properties={{ pricing_cta: "Start for €5/month", location: "pricing_page_bottom" }}
          />
          <TrackedCta
            label="Get free resources"
            href="/signup"
            event={E.FREE_RESOURCES_CLICKED}
            properties={{ pricing_cta: "Get free resources", location: "pricing_page_bottom" }}
            variant="outline"
          />
        </div>
      </div>

    </div>
  );
}

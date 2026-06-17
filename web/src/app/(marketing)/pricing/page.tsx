import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for Go-to-Market Taste.",
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For founders and solo PMMs getting started.",
    features: [
      "3 projects",
      "Core narrative generation",
      "All 3 asset types",
      "Inline editing",
      "Verified vs. inferred tagging",
    ],
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
      "Email support",
    ],
    cta: "Start free trial",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "Custom",
    description: "For revenue teams and agencies with shared workspaces.",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Shared projects",
      "SSO",
      "Dedicated support",
    ],
    cta: "Contact us",
    href: "mailto:hello@gotomarkettaste.com",
    highlighted: false,
  },
];

const comparisons = [
  { feature: "Projects", starter: "3", pro: "Unlimited", team: "Unlimited" },
  { feature: "Core narrative generation", starter: "Yes", pro: "Yes", team: "Yes" },
  { feature: "Asset types (pitch deck, one-pager, sales deck)", starter: "All 3", pro: "All 3", team: "All 3" },
  { feature: "Inline editing", starter: "Yes", pro: "Yes", team: "Yes" },
  { feature: "Verified vs. inferred tagging", starter: "Yes", pro: "Yes", team: "Yes" },
  { feature: "PDF export", starter: "No", pro: "Yes", team: "Yes" },
  { feature: "Narrative versioning", starter: "No", pro: "Yes", team: "Yes" },
  { feature: "Team workspaces", starter: "No", pro: "No", team: "Yes" },
  { feature: "SSO", starter: "No", pro: "No", team: "Yes" },
  { feature: "Support", starter: "Community", pro: "Email", team: "Dedicated" },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">

      {/* Header */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">Pricing</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Start free. Upgrade when you need more projects or team features.
        </p>
      </div>

      {/* Plan cards */}
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? "border-primary shadow-card" : ""}
          >
            <CardHeader>
              {plan.highlighted && (
                <Badge className="mb-2 w-fit">Most popular</Badge>
              )}
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.per && (
                  <span className="text-sm text-muted-foreground">{plan.per}</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mb-12">
        <h2 className="mb-6 text-center text-lg font-semibold">Full comparison</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-foreground">Feature</th>
                <th className="px-4 py-3 text-center font-medium text-foreground">Starter</th>
                <th className="px-4 py-3 text-center font-medium text-primary">Pro</th>
                <th className="px-4 py-3 text-center font-medium text-foreground">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparisons.map((row) => (
                <tr key={row.feature} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{row.starter}</td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">{row.pro}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ note */}
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="mb-1 text-sm font-medium text-foreground">Questions about which plan fits?</p>
        <p className="mb-4 text-sm text-muted-foreground">
          Start with the Starter plan. You can upgrade at any time without losing your work.
          Stripe billing is coming soon. Pricing shown is illustrative.
        </p>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/signup">Start free</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/faq">Read the FAQ</Link>
          </Button>
        </div>
      </div>

    </div>
  );
}

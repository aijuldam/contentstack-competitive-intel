import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing.",
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For founders and solo PMMs getting started.",
    features: [
      "3 projects",
      "Canonical narrative generation",
      "All 3 asset types",
      "Inline editing",
      "Verified vs. inferred tagging",
    ],
    cta: "Get started free",
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
    href: "mailto:hello@narrativekit.com",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">Pricing</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Start free. Upgrade when you need more.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? "border-primary shadow-card-hover" : ""}
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

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Stripe billing coming soon. Pricing is illustrative.
      </p>
    </div>
  );
}

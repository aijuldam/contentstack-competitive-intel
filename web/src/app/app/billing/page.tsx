import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { getPlanForWorkspace, PLANS } from "@/lib/billing/plans";
import { hasPlan } from "@/lib/billing/entitlements";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const { workspace } = await requireAuthAndWorkspace();
  const plan = getPlanForWorkspace(workspace);
  const isPaid = hasPlan(workspace, "paid_monthly");
  const FREE = PLANS.free;
  const PAID = PLANS.paid_monthly;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <PageHeader title="Billing" description="Manage your plan and subscription." />

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription className="mt-0.5">
                {isPaid
                  ? "Full access to the complete GTM workflow."
                  : "Frameworks and examples. Upgrade to generate assets."}
              </CardDescription>
            </div>
            <Badge variant={isPaid ? "active" : "secondary"} className="shrink-0">
              {isPaid ? "€5/month" : "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-border bg-muted/20 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {isPaid ? "What's included" : "Available on your plan"}
            </p>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {isPaid && (
            <div className="space-y-3">
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing cycle</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">€5.00 / month</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subscription status</span>
                <Badge variant="active">Active</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Manage payment, invoices, and cancellation.
                </p>
                <Button size="sm" variant="outline" disabled>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Manage subscription
                </Button>
              </div>
              <p className="text-2xs text-muted-foreground">
                Customer portal available once Stripe is connected.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade card — shown only on free plan */}
      {!isPaid && (
        <Card className="border-primary/30 bg-primary/[0.02]">
          <CardHeader>
            <CardTitle className="text-sm">Upgrade to full access</CardTitle>
            <CardDescription>
              {PAID.pricingDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border bg-background p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                What you unlock at €5/month
              </p>
              <ul className="space-y-2">
                {PAID.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="w-full sm:w-auto" disabled>
                <Sparkles className="h-3.5 w-3.5" />
                Start for €5/month
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/pricing">
                  Compare plans
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              Stripe checkout coming soon. Pricing is confirmed — billing will be activated shortly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Free plan resources reminder — shown on both plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Free resources</CardTitle>
          <CardDescription>
            {FREE.pricingDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Examples", href: "/examples" },
              { label: "FAQ", href: "/faq" },
              { label: "Pricing", href: "/pricing" },
            ].map((link) => (
              <Button key={link.label} size="sm" variant="outline" asChild>
                <Link href={link.href}>
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

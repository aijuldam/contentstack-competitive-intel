import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <PageHeader title="Billing" description="Manage your plan and payment details." />

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current plan</CardTitle>
            <Badge variant="active">Starter — Free</Badge>
          </div>
          <CardDescription>
            3 projects included. Upgrade for unlimited projects and export.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              2 of 3 projects used
            </div>
            <Button size="sm">Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>

      <EmptyState
        icon={CreditCard}
        title="Stripe billing coming soon"
        description="Payment management, invoices, and plan upgrades will be available here. Pricing is illustrative for now."
      />
    </div>
  );
}

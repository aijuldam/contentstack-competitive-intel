import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface UpgradePromptProps {
  /** What is blocked — shown as the headline. */
  feature: string;
  /** What the user gains — shown as the subtext. */
  benefit: string;
  /** Optional extra classes for the outer card. */
  className?: string;
}

export function UpgradePrompt({ feature, benefit, className }: UpgradePromptProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <p className="text-sm font-semibold text-foreground">{feature}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{benefit}</p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button size="sm" asChild>
            <Link href="/app/billing">
              <Sparkles className="h-3.5 w-3.5" />
              Start for €5/month
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/pricing">See what&apos;s included</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

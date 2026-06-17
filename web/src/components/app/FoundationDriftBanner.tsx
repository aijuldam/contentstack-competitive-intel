import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoundationDriftBannerProps {
  projectId: string;
}

export function FoundationDriftBanner({ projectId }: FoundationDriftBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Foundation updated since this asset was generated
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
          The Messaging Foundation changed after this asset was created. Regenerate to reflect the latest source of truth.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        asChild
        className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
      >
        <Link href={`/app/projects/${projectId}/narrative`}>View foundation</Link>
      </Button>
    </div>
  );
}

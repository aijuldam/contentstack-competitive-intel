import { Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export interface VersionHistoryEntry {
  id: string;
  versionNumber: number;
  createdAt: string;
  promptVersion: string;
  foundationVersion?: number;
  isCurrent: boolean;
}

interface AssetVersionHistoryProps {
  versions: VersionHistoryEntry[];
  className?: string;
}

export function AssetVersionHistory({
  versions,
  className,
}: AssetVersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <p className="py-3 text-xs text-muted-foreground">No version history yet.</p>
    );
  }

  return (
    <ol className={cn("space-y-1", className)}>
      {versions.map((v) => (
        <li
          key={v.id}
          className="flex items-start gap-2.5 rounded-md px-2 py-2 text-xs hover:bg-muted/50"
        >
          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
            {v.isCurrent ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">v{v.versionNumber}</span>
              {v.isCurrent && (
                <Badge variant="active" className="text-2xs">
                  Current
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-muted-foreground">{v.createdAt}</p>
            {v.foundationVersion && (
              <p className="text-muted-foreground">
                Foundation v{v.foundationVersion}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

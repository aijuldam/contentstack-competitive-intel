import { Badge } from "@/components/ui/badge";

type Status =
  | "draft"
  | "processing"
  | "complete"
  | "error"
  | "verified"
  | "inferred";

const statusConfig: Record<
  Status,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  draft: { label: "Draft", variant: "draft" },
  processing: { label: "Generating…", variant: "default" },
  complete: { label: "Ready", variant: "active" },
  error: { label: "Error", variant: "destructive" },
  verified: { label: "Verified", variant: "verified" },
  inferred: { label: "Inferred", variant: "inferred" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

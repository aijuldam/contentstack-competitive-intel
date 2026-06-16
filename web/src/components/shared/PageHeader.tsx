import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="label-xs mb-1">{eyebrow}</p>
        )}
        <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-3 flex shrink-0 gap-2 sm:mt-0 sm:ml-4">{actions}</div>
      )}
    </div>
  );
}

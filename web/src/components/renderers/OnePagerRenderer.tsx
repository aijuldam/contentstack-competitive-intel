import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { OnePagerRenderOutput } from "@/lib/renderers/types";

interface Props {
  output: OnePagerRenderOutput;
  className?: string;
}

export function OnePagerRenderer({ output, className }: Props) {
  return (
    <div className={cn("bg-white", className)}>
      <div className="mx-auto max-w-2xl px-10 py-14">
        <h1 className="mb-8 border-b-2 border-primary pb-6 text-3xl font-extrabold leading-tight text-foreground">
          {output.headline}
        </h1>
        <div className="space-y-7">
          {output.sections.map((s) => (
            <div key={s.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-2xs font-bold uppercase tracking-widest text-primary">
                  {s.title}
                </span>
                <Badge
                  variant={s.confidence === "verified" ? "verified" : "inferred"}
                  className="shrink-0 text-2xs"
                >
                  {s.confidence}
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {s.content}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border pt-4">
          <span className="text-2xs text-muted-foreground">
            {output.context.projectName} &middot; v{output.context.versionNumber}
          </span>
          <span className="text-2xs text-muted-foreground">
            Go-to-Market Taste &middot; {output.context.generatedAt}
          </span>
        </div>
      </div>
    </div>
  );
}

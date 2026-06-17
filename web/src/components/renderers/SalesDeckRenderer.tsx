"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { SalesDeckRenderOutput } from "@/lib/renderers/types";

interface Props {
  output: SalesDeckRenderOutput;
  className?: string;
}

export function SalesDeckRenderer({ output, className }: Props) {
  const [activeTab, setActiveTab] = useState(output.tabs[0]?.id ?? "");
  const activeGroup = output.tabs.find((t) => t.id === activeTab);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Tab bar */}
      <div className="flex shrink-0 overflow-x-auto border-b border-border bg-background px-4">
        {output.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex h-10 shrink-0 items-center whitespace-nowrap px-4 text-sm transition-colors",
              activeTab === tab.id
                ? "font-medium text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-muted/20 px-4 py-6 sm:px-8">
        {activeGroup && (
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {activeGroup.label}
            </h2>
            {activeGroup.sections.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-border bg-background px-5 py-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-2xs font-bold uppercase tracking-widest text-muted-foreground">
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
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border bg-background px-4 py-2">
        <p className="text-2xs text-muted-foreground">
          {output.context.projectName} &middot; Sales Enablement Deck &middot; v{output.context.versionNumber}
        </p>
      </div>
    </div>
  );
}

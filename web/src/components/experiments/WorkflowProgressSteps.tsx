"use client";

import { cn } from "@/lib/utils/cn";

type Step = "intake" | "foundation" | "review" | "assets";

const STEPS: { id: Step; label: string; shortLabel: string }[] = [
  { id: "intake",     label: "Fill in intake",             shortLabel: "Intake"     },
  { id: "foundation", label: "Generate Foundation",        shortLabel: "Foundation" },
  { id: "review",     label: "Review and approve",         shortLabel: "Review"     },
  { id: "assets",     label: "Generate assets",            shortLabel: "Assets"     },
];

interface WorkflowProgressStepsProps {
  currentStep: Step;
  className?: string;
}

/**
 * EXP-001 — INTAKE_PROGRESS_STEPS
 *
 * Shows a 4-step workflow progress indicator. Renders only when the experiment
 * flag is enabled. Import and place above the intake form or on project pages.
 *
 * Removal: delete this file and any import of WorkflowProgressSteps.
 */
export function WorkflowProgressSteps({ currentStep, className }: WorkflowProgressStepsProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn("flex items-center gap-0 overflow-x-auto", className)}>
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isUpcoming = i > currentIndex;

        return (
          <div key={step.id} className="flex min-w-0 items-center">
            {/* Step bubble + label */}
            <div className="flex min-w-0 items-center gap-1.5 px-1">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-2xs font-semibold",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/20",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? "✓" : i + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate text-xs sm:block",
                  isCurrent && "font-medium text-foreground",
                  isComplete && "text-muted-foreground",
                  isUpcoming && "text-muted-foreground/60"
                )}
              >
                {step.shortLabel}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 shrink-0 sm:w-10",
                  i < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Experiment flag types
//
// Minimal types for the feature-flag/experiment pattern.
// No external dependency. Swap in PostHog, LaunchDarkly, or GrowthBook later
// by replacing the resolver in flags.ts — the type surface stays the same.
// ─────────────────────────────────────────────────────────────────────────────

export type FunnelStage =
  | "acquisition"    // landing → signup
  | "onboarding"     // signup → workspace created
  | "activation"     // workspace → project → foundation → asset opened
  | "conversion"     // free → paid upgrade
  | "retention";     // post-activation engagement

export type ExperimentStatus =
  | "planned"    // defined but not started
  | "running"    // currently collecting data
  | "complete"   // concluded, decision made
  | "abandoned"; // stopped without a clear result

export type FlagValue = boolean | string;

/**
 * A named experiment with hypothesis, metrics, and status metadata.
 * Stored in the experiment registry (docs/activation/experiment-registry.md).
 * The flagKey links it to a value in FLAGS.
 */
export interface ExperimentRecord {
  id: string;           // EXP-001, EXP-002, ...
  name: string;
  flagKey: string;      // matches a key in FLAGS
  status: ExperimentStatus;
  funnelStage: FunnelStage;
  hypothesis: string;
  targetMetric: string;
  guardrailMetric?: string;
  implementationScope: "minimal" | "medium" | "large";
  priority: "high" | "medium" | "low";
  startDate?: string;
  endDate?: string;
  result?: string;
}

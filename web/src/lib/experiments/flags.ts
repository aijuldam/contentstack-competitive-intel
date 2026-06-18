// ─────────────────────────────────────────────────────────────────────────────
// Experiment flags registry
//
// All flags default to the CONTROL condition (feature off).
// To run an experiment: flip the default value OR set the env var.
//
// Environment variable override:
//   NEXT_PUBLIC_EXP_{KEY}=true|false|variant-name
//   Example: NEXT_PUBLIC_EXP_INTAKE_PROGRESS_STEPS=true
//
// NEXT_PUBLIC_ prefix is required so the value is available in both
// Server Components and Client Components (embedded at build time by Next.js).
//
// Removing an experiment: delete the flag entry, find all `isEnabled("FLAG")`
// and `getVariant("FLAG")` call sites, and clean them up.
//
// Future: replace resolveFlag() with a PostHog/LaunchDarkly/GrowthBook call
// per user — the rest of the codebase stays unchanged.
// ─────────────────────────────────────────────────────────────────────────────

// ── Flag definitions ─────────────────────────────────────────────────────────

/**
 * EXP-001 — Workflow progress indicator
 * Show a 4-step progress banner (Intake → Foundation → Review → Assets)
 * on the new project page to orient users to the full workflow.
 */
const INTAKE_PROGRESS_STEPS = resolveFlag("INTAKE_PROGRESS_STEPS", false);

/**
 * EXP-002 — Sample intake prefill
 * Prefill intake form fields with RevOps example content.
 * Reduces blank-page friction; users overwrite with their own product.
 */
const INTAKE_SAMPLE_PREFILL = resolveFlag("INTAKE_SAMPLE_PREFILL", false);

/**
 * EXP-003 — Foundation generation CTA copy
 * Variants:
 *   "control"  — "Generate Foundation" (current)
 *   "outcome"  — "Generate my sales narrative →"
 *   "timed"    — "Generate Foundation (~ 30 sec)"
 */
const FOUNDATION_CTA_COPY = resolveFlag("FOUNDATION_CTA_COPY", "control");

/**
 * EXP-004 — Inputs page outcome hint
 * Show an explanatory banner on the inputs page before generation:
 * what the output looks like, how long it takes, what happens next.
 */
const INPUTS_OUTCOME_HINT = resolveFlag("INPUTS_OUTCOME_HINT", false);

/**
 * EXP-005 — Early paywall exposure
 * Show the upgrade prompt on the projects list page with a locked "New project"
 * button, rather than only after the user navigates to /app/projects/new.
 * Tests whether earlier exposure to the paywall increases or decreases conversion.
 */
const PAYWALL_EARLY_LOCK = resolveFlag("PAYWALL_EARLY_LOCK", false);

// ── Resolved flag map ─────────────────────────────────────────────────────────

export const FLAGS = {
  INTAKE_PROGRESS_STEPS,
  INTAKE_SAMPLE_PREFILL,
  FOUNDATION_CTA_COPY,
  INPUTS_OUTCOME_HINT,
  PAYWALL_EARLY_LOCK,
} as const satisfies Record<string, boolean | string>;

export type ExperimentFlagKey = keyof typeof FLAGS;

// ── Accessors ─────────────────────────────────────────────────────────────────

/** Returns true if a boolean flag is enabled. */
export function isEnabled(key: ExperimentFlagKey): boolean {
  return FLAGS[key] === true;
}

/** Returns the string value of a variant flag. */
export function getVariant(key: ExperimentFlagKey): string {
  return String(FLAGS[key]);
}

// ── Resolution ────────────────────────────────────────────────────────────────

function resolveFlag(key: string, defaultValue: boolean): boolean;
function resolveFlag(key: string, defaultValue: string): string;
function resolveFlag(key: string, defaultValue: boolean | string): boolean | string {
  // process.env is safe to access here: Next.js embeds NEXT_PUBLIC_ at build time.
  const raw =
    typeof process !== "undefined"
      ? process.env[`NEXT_PUBLIC_EXP_${key}`]
      : undefined;

  if (raw === undefined || raw === "") return defaultValue;
  if (typeof defaultValue === "boolean") return raw === "true";
  return raw;
}

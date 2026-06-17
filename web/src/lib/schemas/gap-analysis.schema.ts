import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Gap analysis
//
// Runs between normalization and foundation generation. It identifies what is
// missing or weak in the inputs so the foundation can flag those areas honestly
// instead of inventing content to fill them.
// ─────────────────────────────────────────────────────────────────────────────

// blocking  — the foundation cannot be credible without this
// important — the foundation works but is materially weaker without it
// minor     — nice to have
export const GapSeverityEnum = z.enum(["blocking", "important", "minor"]);
export type GapSeverity = z.infer<typeof GapSeverityEnum>;

export const GapCategoryEnum = z.enum([
  "buyer",
  "pain",
  "metrics",
  "proof",
  "differentiation",
  "process",
  "other",
]);
export type GapCategory = z.infer<typeof GapCategoryEnum>;

export const GapSchema = z.object({
  field: z.string(),
  category: GapCategoryEnum,
  severity: GapSeverityEnum,
  why_it_matters: z.string(),
  suggested_question: z.string(),
});
export type Gap = z.infer<typeof GapSchema>;

export const GapAnalysisSchema = z.object({
  gaps: z.array(GapSchema).default([]),
  // 0-100 readiness of the inputs to support a credible foundation.
  readiness_score: z.number().min(0).max(100),
  summary: z.string(),
});
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;

// Convenience: are there any blocking gaps that should pause generation?
export function hasBlockingGaps(analysis: GapAnalysis): boolean {
  return analysis.gaps.some((g) => g.severity === "blocking");
}

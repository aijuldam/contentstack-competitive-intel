import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Generation metadata, validation, and run logging
//
// These schemas make every generation traceable: which prompt version produced
// it, how many attempts it took, whether the output had to be repaired, and how
// validation went. Stored alongside results so runs can be regenerated later
// with a newer prompt version.
// ─────────────────────────────────────────────────────────────────────────────

// Identifies the exact prompt that produced a result.
export const PromptRefSchema = z.object({
  id: z.string(),
  version: z.string(),
});
export type PromptRef = z.infer<typeof PromptRefSchema>;

export const TokenUsageSchema = z.object({
  input_tokens: z.number().int().nonnegative().optional(),
  output_tokens: z.number().int().nonnegative().optional(),
});
export type TokenUsage = z.infer<typeof TokenUsageSchema>;

// Captured for every structured generation call.
export const GenerationMetadataSchema = z.object({
  prompt: PromptRefSchema,
  model: z.string(),
  attempts: z.number().int().min(1),
  // true when the first response failed validation and was repaired on retry
  repaired: z.boolean(),
  input_hash: z.string(),
  usage: TokenUsageSchema.optional(),
  duration_ms: z.number().nonnegative(),
  created_at: z.string(),
});
export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;

// Result of validating a model response against its schema.
export const ValidationResultSchema = z.object({
  ok: z.boolean(),
  errors: z.array(z.string()).default([]),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// The kinds of generation steps the pipeline runs.
export const RunStepEnum = z.enum([
  "normalize",
  "enrichment",
  "gap_analysis",
  "foundation",
  "asset",
]);
export type RunStep = z.infer<typeof RunStepEnum>;

// A durable record of a single generation step, suitable for storage and debug.
export const GenerationRunLogSchema = z.object({
  run_type: RunStepEnum,
  status: z.enum(["complete", "error"]),
  prompt: PromptRefSchema,
  attempts: z.number().int().min(0),
  input_hash: z.string(),
  error_message: z.string().optional(),
  validation_errors: z.array(z.string()).default([]),
  output_ref: z.object({ table: z.string(), id: z.string() }).optional(),
  started_at: z.string(),
  completed_at: z.string(),
});
export type GenerationRunLog = z.infer<typeof GenerationRunLogSchema>;

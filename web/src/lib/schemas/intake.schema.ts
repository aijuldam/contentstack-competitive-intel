import { z } from "zod";

export const RawIntakeSchema = z.object({
  product_description: z.string().min(10).max(2000),
  buyer_and_user: z.string().min(10).max(1000),
  problem_and_cost: z.string().min(10).max(1000),
  differentiation_and_proof: z.string().min(10).max(1000),
});

export const ParsedFactsSchema = z.object({
  company_name: z.string().optional(),
  product_name: z.string().optional(),
  category: z.string().optional(),
  buyer_roles: z.array(z.string()),
  user_roles: z.array(z.string()),
  pain_points: z.array(z.string()),
  business_impacts: z.array(z.string()),
  differentiators: z.array(z.string()),
  proof_points: z.array(z.string()),
  competitors_or_alternatives: z.array(z.string()),
  metrics_mentioned: z.array(z.string()),
});

export const InferredInterpretationsSchema = z.object({
  likely_sales_motion: z.string(),
  likely_market_segment: z.string(),
  likely_status_quo: z.array(z.string()),
  likely_trigger_events: z.array(z.string()),
});

export const NormalizedIntakeSchema = z.object({
  explicit_inputs: RawIntakeSchema,
  parsed_facts: ParsedFactsSchema,
  inferred_interpretations: InferredInterpretationsSchema,
  confidence_notes: z.array(z.string()),
  missing_but_important: z.array(z.string()),
});

export type RawIntake = z.infer<typeof RawIntakeSchema>;
export type ParsedFacts = z.infer<typeof ParsedFactsSchema>;
export type NormalizedIntake = z.infer<typeof NormalizedIntakeSchema>;

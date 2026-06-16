import { z } from "zod";

const ConfidenceEnum = z.enum(["verified", "inferred"]);
const SourceEnum = z.enum(["explicit", "normalized", "model_generated"]);

const NarrativeBlockSchema = z.object({
  content: z.string(),
  confidence: ConfidenceEnum,
  source: SourceEnum,
  user_edited: z.boolean().default(false),
});

export const MEDDICSchema = z.object({
  metrics: NarrativeBlockSchema,
  economic_buyer: NarrativeBlockSchema,
  decision_criteria: NarrativeBlockSchema,
  decision_process: NarrativeBlockSchema,
  identify_pain: NarrativeBlockSchema,
  champion: NarrativeBlockSchema,
});

export const CommandOfMessageSchema = z.object({
  current_state: NarrativeBlockSchema,
  negative_consequences: NarrativeBlockSchema,
  required_capabilities: NarrativeBlockSchema,
  positive_outcomes: NarrativeBlockSchema,
  proof_points: NarrativeBlockSchema,
  differentiated_value: NarrativeBlockSchema,
});

export const CanonicalNarrativeSchema = z.object({
  meddic: MEDDICSchema,
  command_of_message: CommandOfMessageSchema,
});

export type NarrativeBlock = z.infer<typeof NarrativeBlockSchema>;
export type MEDDIC = z.infer<typeof MEDDICSchema>;
export type CommandOfMessage = z.infer<typeof CommandOfMessageSchema>;
export type CanonicalNarrative = z.infer<typeof CanonicalNarrativeSchema>;

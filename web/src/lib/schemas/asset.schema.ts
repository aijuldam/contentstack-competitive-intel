import { z } from "zod";

export const AssetTypeEnum = z.enum(["pitch_deck", "one_pager", "sales_deck"]);

export const AssetSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  source_blocks: z.array(z.string()),
  confidence: z.enum(["verified", "inferred"]),
  user_edited: z.boolean().default(false),
});

export const AssetSchema = z.object({
  asset_type: AssetTypeEnum,
  sections: z.array(AssetSectionSchema),
});

// Per-asset section templates (enforced during Stage 3 generation)
export const PITCH_DECK_SECTIONS = [
  "title",
  "problem",
  "cost_of_inaction",
  "solution",
  "differentiation",
  "proof",
  "positive_outcomes",
  "call_to_action",
] as const;

export const ONE_PAGER_SECTIONS = [
  "headline",
  "who_its_for",
  "the_problem",
  "how_it_works",
  "why_us",
  "results",
  "next_step",
] as const;

export const SALES_DECK_SECTIONS = [
  "title",
  "buyer_profile",
  "common_pains",
  "discovery_questions",
  "solution_narrative",
  "competitive_differentiation",
  "proof_points",
  "decision_process_guide",
  "champion_enablement",
  "objection_handling",
] as const;

export type AssetType = z.infer<typeof AssetTypeEnum>;
export type AssetSection = z.infer<typeof AssetSectionSchema>;
export type Asset = z.infer<typeof AssetSchema>;

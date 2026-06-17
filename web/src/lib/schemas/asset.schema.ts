import { z } from "zod";
import { ProvenanceEnum } from "./provenance";

// ─────────────────────────────────────────────────────────────────────────────
// Assets
//
// Assets are derived from an approved Messaging Foundation version. Each section
// records which foundation blocks it draws from (source_blocks) and preserves
// provenance so the UI can show that an asset never invents claims beyond the
// foundation it was built from.
// ─────────────────────────────────────────────────────────────────────────────

export const AssetTypeEnum = z.enum(["pitch_deck", "one_pager", "sales_deck"]);
export type AssetType = z.infer<typeof AssetTypeEnum>;

export const AssetSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  // Which foundation sections this content was derived from.
  source_blocks: z.array(z.string()).default([]),
  provenance: ProvenanceEnum.default("inferred"),
  confidence: z.enum(["verified", "inferred"]),
  needs_validation: z.boolean().default(false),
  user_edited: z.boolean().default(false),
});
export type AssetSection = z.infer<typeof AssetSectionSchema>;

export const AssetContentSchema = z.object({
  asset_type: AssetTypeEnum,
  sections: z.array(AssetSectionSchema),
});
export type AssetContent = z.infer<typeof AssetContentSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Per-asset section templates (the ordered section ids each asset must contain).
// Enforced during generation so output structure is predictable and renderable.
// ─────────────────────────────────────────────────────────────────────────────
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

export const ASSET_SECTION_TEMPLATES: Record<AssetType, readonly string[]> = {
  pitch_deck: PITCH_DECK_SECTIONS,
  one_pager: ONE_PAGER_SECTIONS,
  sales_deck: SALES_DECK_SECTIONS,
};

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  pitch_deck: "Pitch Deck",
  one_pager: "One-Pager",
  sales_deck: "Sales Enablement Deck",
};

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Provenance and grounding primitives
//
// Every piece of generated content carries provenance so the product can show
// where a claim came from and never assert invented certainty.
//
//   provenance       — where the content originated
//   confidence       — how strongly it is supported (drives the UI badge)
//   needs_validation — true when the content is weak or unverified and must be
//                       surfaced for the user to confirm, not presented as fact
//   source_refs      — intake fields / parsed facts the content draws from
// ─────────────────────────────────────────────────────────────────────────────

// Where a claim originated.
//   user_provided — stated directly by the user in the intake
//   inferred       — synthesized by the model from user inputs
//   unknown        — not present in the inputs; flagged as a gap, never invented
export const ProvenanceEnum = z.enum(["user_provided", "inferred", "unknown"]);
export type Provenance = z.infer<typeof ProvenanceEnum>;

// How strongly a claim is supported. Drives the verified/inferred UI badge.
export const ConfidenceEnum = z.enum(["verified", "inferred"]);
export type Confidence = z.infer<typeof ConfidenceEnum>;

// A single grounded block of prose (one foundation section).
export const GroundedBlockSchema = z.object({
  content: z.string(),
  provenance: ProvenanceEnum,
  confidence: ConfidenceEnum,
  source_refs: z.array(z.string()).default([]),
  needs_validation: z.boolean().default(false),
  user_edited: z.boolean().default(false),
});
export type GroundedBlock = z.infer<typeof GroundedBlockSchema>;

// A single grounded list item (pain point, proof point, etc.).
export const GroundedItemSchema = z.object({
  text: z.string(),
  provenance: ProvenanceEnum,
  confidence: ConfidenceEnum,
  needs_validation: z.boolean().default(false),
});
export type GroundedItem = z.infer<typeof GroundedItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// A grounded block representing "we do not know this yet". Used instead of
// fabricating content when the inputs do not support a section.
export function unknownBlock(reason: string): GroundedBlock {
  return {
    content: reason,
    provenance: "unknown",
    confidence: "inferred",
    source_refs: [],
    needs_validation: true,
    user_edited: false,
  };
}

// Counts grounded blocks/items by confidence for summary display.
export function countConfidence(
  blocks: Array<{ confidence: Confidence }>
): { verified: number; inferred: number; total: number } {
  const verified = blocks.filter((b) => b.confidence === "verified").length;
  return { verified, inferred: blocks.length - verified, total: blocks.length };
}

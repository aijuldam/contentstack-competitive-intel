import type { GroundedBlock } from "./provenance";
import type { MessagingFoundation } from "./foundation.schema";
import type {
  NarrativeBlock,
  MEDDICBlocks,
  CotMBlocks,
} from "@/lib/db/types";

// ─────────────────────────────────────────────────────────────────────────────
// Foundation mappers
//
// Bridges the rich Messaging Foundation to the existing narrative_versions
// storage shape (meddic_blocks + cotm_blocks). This lets the current narrative
// UI keep working while the full foundation is stored in its own column.
// ─────────────────────────────────────────────────────────────────────────────

function toNarrativeBlock(block: GroundedBlock): NarrativeBlock {
  const source: NarrativeBlock["source"] =
    block.provenance === "user_provided"
      ? "explicit"
      : block.provenance === "inferred"
        ? "model_generated"
        : "normalized";

  return {
    content: block.content,
    confidence: block.confidence,
    source,
    user_edited: block.user_edited,
  };
}

// Joins a list of grounded items into a single narrative block for legacy
// columns that expect one block (e.g. proof_points).
function itemsToBlock(
  items: Array<{ text: string; confidence: "verified" | "inferred" }>,
  fallback: string
): NarrativeBlock {
  if (items.length === 0) {
    return {
      content: fallback,
      confidence: "inferred",
      source: "model_generated",
      user_edited: false,
    };
  }
  const anyVerified = items.some((i) => i.confidence === "verified");
  return {
    content: items.map((i) => `• ${i.text}`).join("\n"),
    confidence: anyVerified ? "verified" : "inferred",
    source: "model_generated",
    user_edited: false,
  };
}

export function foundationToMeddicBlocks(f: MessagingFoundation): MEDDICBlocks {
  return {
    metrics: toNarrativeBlock(f.meddic.metrics),
    economic_buyer: toNarrativeBlock(f.meddic.economic_buyer),
    decision_criteria: toNarrativeBlock(f.meddic.decision_criteria),
    decision_process: toNarrativeBlock(f.meddic.decision_process),
    identify_pain: toNarrativeBlock(f.meddic.identify_pain),
    champion: toNarrativeBlock(f.meddic.champion),
  };
}

export function foundationToCotmBlocks(f: MessagingFoundation): CotMBlocks {
  return {
    current_state: toNarrativeBlock(f.current_state),
    negative_consequences: toNarrativeBlock(f.negative_consequences),
    required_capabilities: toNarrativeBlock(f.required_capabilities),
    positive_outcomes: toNarrativeBlock(f.business_outcomes),
    proof_points: itemsToBlock(f.proof_points, "No proof points provided yet."),
    differentiated_value: toNarrativeBlock(f.differentiated_value),
  };
}

// Counts verified vs inferred across every grounded element of the foundation.
export function foundationConfidenceCounts(f: MessagingFoundation): {
  verified: number;
  inferred: number;
  total: number;
} {
  const blocks: Array<{ confidence: "verified" | "inferred" }> = [
    f.product_summary,
    f.icp_target_buyer,
    f.buyer_user_distinction,
    f.current_state,
    f.negative_consequences,
    f.required_capabilities,
    f.differentiated_value,
    f.business_outcomes,
    f.positioning_summary,
    ...Object.values(f.meddic),
    ...f.pain_points,
    ...f.proof_points,
    ...f.message_pillars,
    ...f.objections_risk_areas,
  ];
  const verified = blocks.filter((b) => b.confidence === "verified").length;
  return { verified, inferred: blocks.length - verified, total: blocks.length };
}

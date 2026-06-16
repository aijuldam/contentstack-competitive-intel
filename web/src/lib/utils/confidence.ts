import type { NormalizedIntake } from "@/lib/schemas/intake.schema";
import type { CanonicalNarrative } from "@/lib/schemas/narrative.schema";

// Derives a 0–100 confidence score from normalized intake
export function scoreIntakeConfidence(normalized: NormalizedIntake): number {
  let score = 0;
  const facts = normalized.parsed_facts;

  if (facts.buyer_roles.length > 0) score += 15;
  if (facts.user_roles.length > 0) score += 10;
  if (facts.pain_points.length > 0) score += 15;
  if (facts.metrics_mentioned.length > 0) score += 15;
  if (facts.differentiators.length > 0) score += 15;
  if (facts.proof_points.length > 0) score += 15;
  if (facts.company_name) score += 5;
  if (facts.product_name) score += 5;
  if (normalized.missing_but_important.length === 0) score += 5;

  return Math.min(score, 100);
}

// Counts verified vs inferred blocks in a canonical narrative
export function countNarrativeConfidence(narrative: CanonicalNarrative): {
  verified: number;
  inferred: number;
  total: number;
} {
  const allBlocks = [
    ...Object.values(narrative.meddic),
    ...Object.values(narrative.command_of_message),
  ];

  const verified = allBlocks.filter((b) => b.confidence === "verified").length;
  const inferred = allBlocks.filter((b) => b.confidence === "inferred").length;

  return { verified, inferred, total: allBlocks.length };
}

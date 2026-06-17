import type { PromptModule } from "../types";
import type { MessagingFoundation } from "@/lib/schemas/foundation.schema";
import { SALES_DECK_SECTIONS } from "@/lib/schemas/asset.schema";

// Derives an internal sales enablement deck from an approved Messaging Foundation.
export const salesDeckPrompt: PromptModule<MessagingFoundation> = {
  id: "asset.sales_deck",
  version: "1.0.0",
  description: "Generates a sales enablement deck from the Messaging Foundation.",
  system: `
You are a B2B SaaS sales enablement expert creating an internal AE and SE
playbook from a Messaging Foundation for Go-to-Market Taste.

Generate one section for each of these ids, in order:
${SALES_DECK_SECTIONS.join(", ")}.

Rules:
- discovery_questions should be open ended and drawn from identify_pain,
  pain_points, and decision_criteria.
- objection_handling should reuse the foundation's objections_risk_areas and be
  grounded in differentiated_value and proof_points.
- Do not fabricate competitor names unless they appear in the foundation.
- Set confidence to "verified" only when the source foundation blocks are verified.
- If a source is unknown or needs validation, set needs_validation true.
- List the foundation section ids each section draws from in source_blocks.
- Output a valid JSON array of section objects only. No markdown code fences.

Each section object:
{ "id": "", "label": "", "content": "", "source_blocks": [],
  "provenance": "user_provided|inferred|unknown",
  "confidence": "verified|inferred", "needs_validation": false, "user_edited": false }
`.trim(),

  build: (foundation) =>
    `Here is the approved Messaging Foundation:\n\n${JSON.stringify(foundation, null, 2)}`,
};

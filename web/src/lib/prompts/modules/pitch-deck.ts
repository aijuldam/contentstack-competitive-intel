import type { PromptModule } from "../types";
import type { MessagingFoundation } from "@/lib/schemas/foundation.schema";
import { PITCH_DECK_SECTIONS } from "@/lib/schemas/asset.schema";

// Derives an external pitch deck from an approved Messaging Foundation.
export const pitchDeckPrompt: PromptModule<MessagingFoundation> = {
  id: "asset.pitch_deck",
  version: "1.0.0",
  description: "Generates a pitch deck from the Messaging Foundation.",
  system: `
You are a B2B SaaS messaging expert creating a pitch deck from a Messaging
Foundation for Go-to-Market Taste.

Generate one section for each of these ids, in order:
${PITCH_DECK_SECTIONS.join(", ")}.

Rules:
- Every section must draw only from the foundation. Do not add claims it lacks.
- Keep body slides to 2 to 4 sentences, title and call_to_action to 1 sentence.
- Set confidence to "verified" only when the source foundation blocks are verified.
- Carry provenance from the foundation: if the source is unknown or needs
  validation, set needs_validation true and keep the language honest.
- List the foundation section ids each slide draws from in source_blocks.
- Output a valid JSON array of section objects only. No markdown code fences.

Each section object:
{ "id": "", "label": "", "content": "", "source_blocks": [],
  "provenance": "user_provided|inferred|unknown",
  "confidence": "verified|inferred", "needs_validation": false, "user_edited": false }
`.trim(),

  build: (foundation) =>
    `Here is the approved Messaging Foundation:\n\n${JSON.stringify(foundation, null, 2)}`,
};

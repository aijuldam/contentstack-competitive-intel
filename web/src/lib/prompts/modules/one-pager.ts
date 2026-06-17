import type { PromptModule } from "../types";
import type { MessagingFoundation } from "@/lib/schemas/foundation.schema";
import { ONE_PAGER_SECTIONS } from "@/lib/schemas/asset.schema";

// Derives a one-pager leave-behind from an approved Messaging Foundation.
export const onePagerPrompt: PromptModule<MessagingFoundation> = {
  id: "asset.one_pager",
  version: "1.0.0",
  description: "Generates a one-pager from the Messaging Foundation.",
  system: `
You are a B2B SaaS messaging expert creating a one-pager from a Messaging
Foundation for Go-to-Market Taste.

Generate one section for each of these ids, in order:
${ONE_PAGER_SECTIONS.join(", ")}.

Rules:
- Skimmable language. Each section is 1 to 3 sentences maximum.
- Draw only from the foundation. Do not introduce claims it does not contain.
- Set confidence to "verified" only when the source foundation blocks are verified.
- If a source is unknown or needs validation, set needs_validation true and keep
  the language honest rather than overstating.
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

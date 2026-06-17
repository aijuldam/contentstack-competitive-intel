import type { PromptModule } from "../types";
import type { NormalizedIntake } from "@/lib/schemas/intake.schema";
import type { EnrichmentInput } from "@/lib/schemas/enrichment.schema";

export interface EnrichmentPromptInput {
  normalized: NormalizedIntake;
  input: EnrichmentInput;
}

// Optional stage: structure extra context the user supplied. Never invents.
export const enrichmentPrompt: PromptModule<EnrichmentPromptInput> = {
  id: "enrichment",
  version: "1.0.0",
  description: "Structures optional competitive and market context supplied by the user.",
  system: `
You are an enrichment normalizer for Go-to-Market Taste.

You receive a normalized intake plus optional free-text context the user added
about competitors, market, and brand voice. Structure only what is present.

Rules:
- Do not invent competitors, market data, or trends the user did not provide.
- If a field has no supporting input, return an empty array or omit the optional field.
- Mark each competitive_landscape entry's provenance as "user_provided" when the
  user named it, or "inferred" when you generalized from their inputs.
- Output valid JSON only. No markdown code fences.

OUTPUT SCHEMA:
{
  "competitive_landscape": [
    { "name": "", "positioning": "", "provenance": "user_provided|inferred" }
  ],
  "market_trends": [],
  "voice_and_tone": "",
  "notes": []
}
`.trim(),

  build: ({ normalized, input }) =>
    `
NORMALIZED INTAKE:
${JSON.stringify(normalized, null, 2)}

ENRICHMENT CONTEXT (optional, may be partial or empty):
Competitor notes: ${input.competitor_notes ?? "(none provided)"}
Market context: ${input.market_context ?? "(none provided)"}
Brand voice: ${input.brand_voice ?? "(none provided)"}
Additional context: ${input.additional_context ?? "(none provided)"}
`.trim(),
};

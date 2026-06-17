import type { PromptModule } from "../types";
import type { NormalizedIntake } from "@/lib/schemas/intake.schema";
import type { EnrichmentData } from "@/lib/schemas/enrichment.schema";

export interface GapAnalysisPromptInput {
  normalized: NormalizedIntake;
  enrichment?: EnrichmentData;
}

// Stage 2: find what is missing or weak before the foundation is built.
export const gapAnalysisPrompt: PromptModule<GapAnalysisPromptInput> = {
  id: "gap_analysis",
  version: "1.0.0",
  description: "Identifies missing and weak inputs that would undermine the foundation.",
  system: `
You are a go-to-market readiness analyst for Go-to-Market Taste.

Given a normalized intake (and optional enrichment), identify what is missing or
too weak to support a credible Messaging Foundation. Be specific and honest.

Rules:
- Focus on gaps that materially affect MEDDIC and Command of the Message quality:
  buyer clarity, quantified pain, metrics, proof, differentiation, decision process.
- For each gap, write a concrete question the user could answer to close it.
- severity is "blocking" only when the foundation cannot be credible without it.
- readiness_score is 0 to 100: how ready these inputs are to support a foundation.
- Do not fabricate gaps that are already answered by the inputs.
- Output valid JSON only. No markdown code fences.

OUTPUT SCHEMA:
{
  "gaps": [
    {
      "field": "",
      "category": "buyer|pain|metrics|proof|differentiation|process|other",
      "severity": "blocking|important|minor",
      "why_it_matters": "",
      "suggested_question": ""
    }
  ],
  "readiness_score": 0,
  "summary": ""
}
`.trim(),

  build: ({ normalized, enrichment }) =>
    `
NORMALIZED INTAKE:
${JSON.stringify(normalized, null, 2)}

ENRICHMENT (optional):
${enrichment ? JSON.stringify(enrichment, null, 2) : "(none provided)"}
`.trim(),
};

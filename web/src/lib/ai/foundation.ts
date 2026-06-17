import "@/lib/prompts";
import { getPrompt } from "@/lib/prompts/registry";
import { runStructured, type StructuredResult } from "./pipeline";
import type { LLMProvider } from "./provider";

import {
  NormalizedIntakeSchema,
  type RawIntake,
  type NormalizedIntake,
} from "@/lib/schemas/intake.schema";
import {
  EnrichmentDataSchema,
  type EnrichmentInput,
  type EnrichmentData,
} from "@/lib/schemas/enrichment.schema";
import {
  GapAnalysisSchema,
  type GapAnalysis,
} from "@/lib/schemas/gap-analysis.schema";
import {
  MessagingFoundationSchema,
  type MessagingFoundation,
} from "@/lib/schemas/foundation.schema";
import type { EnrichmentPromptInput } from "@/lib/prompts/modules/enrichment";
import type { GapAnalysisPromptInput } from "@/lib/prompts/modules/gap-analysis";
import type { FoundationPromptInput } from "@/lib/prompts/modules/foundation";

// ─────────────────────────────────────────────────────────────────────────────
// Messaging Foundation generation pipeline
//
// Stages, in order:
//   1. normalize    raw intake -> structured intake
//   2. enrichment   (optional) structure extra context the user supplied
//   3. gap_analysis identify missing / weak inputs
//   4. foundation   synthesize the Messaging Foundation
//
// Each stage runs through runStructured, so each is independently validated and
// carries its own metadata. The orchestrator returns every stage result so the
// caller can store versions and log runs.
// ─────────────────────────────────────────────────────────────────────────────

export interface FoundationGenerationResult {
  normalized: StructuredResult<NormalizedIntake>;
  enrichment?: StructuredResult<EnrichmentData>;
  gaps: StructuredResult<GapAnalysis>;
  foundation: StructuredResult<MessagingFoundation>;
}

export interface GenerateFoundationOptions {
  intake: RawIntake;
  enrichmentInput?: EnrichmentInput;
  provider?: LLMProvider;
  model?: string;
  maxAttempts?: number;
}

export async function normalizeIntake(
  intake: RawIntake,
  opts: { provider?: LLMProvider; model?: string; maxAttempts?: number } = {}
): Promise<StructuredResult<NormalizedIntake>> {
  return runStructured({
    prompt: getPrompt<RawIntake>("normalizer"),
    input: intake,
    schema: NormalizedIntakeSchema,
    maxTokens: 2000,
    ...opts,
  });
}

export async function generateMessagingFoundation(
  opts: GenerateFoundationOptions
): Promise<FoundationGenerationResult> {
  const shared = {
    provider: opts.provider,
    model: opts.model,
    maxAttempts: opts.maxAttempts,
  };

  // 1. Normalize
  const normalized = await normalizeIntake(opts.intake, shared);

  // 2. Enrichment (optional)
  let enrichment: StructuredResult<EnrichmentData> | undefined;
  if (opts.enrichmentInput && hasEnrichmentContent(opts.enrichmentInput)) {
    enrichment = await runStructured({
      prompt: getPrompt<EnrichmentPromptInput>("enrichment"),
      input: { normalized: normalized.data, input: opts.enrichmentInput },
      schema: EnrichmentDataSchema,
      maxTokens: 1500,
      ...shared,
    });
  }

  // 3. Gap analysis
  const gaps = await runStructured({
    prompt: getPrompt<GapAnalysisPromptInput>("gap_analysis"),
    input: { normalized: normalized.data, enrichment: enrichment?.data },
    schema: GapAnalysisSchema,
    maxTokens: 1500,
    ...shared,
  });

  // 4. Foundation
  const foundation = await runStructured({
    prompt: getPrompt<FoundationPromptInput>("foundation"),
    input: {
      normalized: normalized.data,
      gaps: gaps.data,
      enrichment: enrichment?.data,
    },
    schema: MessagingFoundationSchema,
    maxTokens: 4000,
    ...shared,
  });

  return { normalized, enrichment, gaps, foundation };
}

function hasEnrichmentContent(input: EnrichmentInput): boolean {
  return Boolean(
    input.competitor_notes ||
      input.market_context ||
      input.brand_voice ||
      input.additional_context
  );
}

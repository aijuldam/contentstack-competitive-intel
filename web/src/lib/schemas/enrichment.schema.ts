import { z } from "zod";
import { ProvenanceEnum } from "./provenance";

// ─────────────────────────────────────────────────────────────────────────────
// Enrichment
//
// Optional context layered on top of the normalized intake before the Messaging
// Foundation is generated. Enrichment is always optional: the pipeline runs with
// or without it. Nothing here is fabricated; the model only structures context
// the user supplied or restates known market facts at a general level.
// ─────────────────────────────────────────────────────────────────────────────

// Raw enrichment supplied by the user (or an upstream integration). All optional.
export const EnrichmentInputSchema = z.object({
  competitor_notes: z.string().max(2000).optional(),
  market_context: z.string().max(2000).optional(),
  brand_voice: z.string().max(1000).optional(),
  additional_context: z.string().max(2000).optional(),
});
export type EnrichmentInput = z.infer<typeof EnrichmentInputSchema>;

const CompetitorSchema = z.object({
  name: z.string(),
  positioning: z.string(),
  provenance: ProvenanceEnum,
});

// Structured enrichment produced by the enrichment normalizer.
export const EnrichmentDataSchema = z.object({
  competitive_landscape: z.array(CompetitorSchema).default([]),
  market_trends: z.array(z.string()).default([]),
  voice_and_tone: z.string().optional(),
  notes: z.array(z.string()).default([]),
});
export type EnrichmentData = z.infer<typeof EnrichmentDataSchema>;

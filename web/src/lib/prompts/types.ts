// ─────────────────────────────────────────────────────────────────────────────
// Prompt module contract
//
// Every prompt is a versioned module. The pipeline references a prompt by id and
// records the exact version that produced each result, so a result can later be
// regenerated with a newer prompt version.
// ─────────────────────────────────────────────────────────────────────────────

export type PromptId =
  | "normalizer"
  | "enrichment"
  | "gap_analysis"
  | "foundation"
  | "asset.pitch_deck"
  | "asset.one_pager"
  | "asset.sales_deck";

// A single versioned prompt. `build` turns typed input into the user message;
// `system` is the standing instruction. Keep system stable per version.
export interface PromptModule<I> {
  id: PromptId;
  version: string;
  description: string;
  system: string;
  build: (input: I) => string;
}

// Erased form used by the registry, which holds modules of mixed input types.
export type AnyPromptModule = PromptModule<unknown>;

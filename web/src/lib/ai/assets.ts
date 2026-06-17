import "@/lib/prompts";
import { z } from "zod";
import { getPrompt } from "@/lib/prompts/registry";
import { runStructured, type StructuredResult } from "./pipeline";
import type { LLMProvider } from "./provider";
import type { PromptId } from "@/lib/prompts/types";
import {
  AssetSectionSchema,
  type AssetType,
  type AssetSection,
} from "@/lib/schemas/asset.schema";
import type { MessagingFoundation } from "@/lib/schemas/foundation.schema";

// ─────────────────────────────────────────────────────────────────────────────
// Asset generation
//
// Assets are derived from an approved Messaging Foundation. Each asset type maps
// to a registered prompt and produces a validated array of sections.
// ─────────────────────────────────────────────────────────────────────────────

const ASSET_PROMPT_IDS: Record<AssetType, PromptId> = {
  pitch_deck: "asset.pitch_deck",
  one_pager: "asset.one_pager",
  sales_deck: "asset.sales_deck",
};

const ASSET_MAX_TOKENS: Record<AssetType, number> = {
  pitch_deck: 3000,
  one_pager: 2000,
  sales_deck: 4000,
};

export interface GenerateAssetOptions {
  provider?: LLMProvider;
  model?: string;
  maxAttempts?: number;
}

export async function generateAsset(
  assetType: AssetType,
  foundation: MessagingFoundation,
  opts: GenerateAssetOptions = {}
): Promise<StructuredResult<AssetSection[]>> {
  return runStructured({
    prompt: getPrompt<MessagingFoundation>(ASSET_PROMPT_IDS[assetType]),
    input: foundation,
    schema: z.array(AssetSectionSchema),
    maxTokens: ASSET_MAX_TOKENS[assetType],
    ...opts,
  });
}

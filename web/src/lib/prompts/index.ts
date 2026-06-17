// ─────────────────────────────────────────────────────────────────────────────
// Prompt registration
//
// Importing this module registers every prompt version. Import it once at the
// entry of the AI layer so getPrompt() can resolve ids.
// ─────────────────────────────────────────────────────────────────────────────
import { registerPrompt } from "./registry";
import { normalizerPrompt } from "./modules/normalizer";
import { enrichmentPrompt } from "./modules/enrichment";
import { gapAnalysisPrompt } from "./modules/gap-analysis";
import { foundationPrompt } from "./modules/foundation";
import { pitchDeckPrompt } from "./modules/pitch-deck";
import { onePagerPrompt } from "./modules/one-pager";
import { salesDeckPrompt } from "./modules/sales-deck";

let registered = false;

// Idempotent: safe to call from multiple entry points.
export function registerAllPrompts(): void {
  if (registered) return;
  registerPrompt(normalizerPrompt);
  registerPrompt(enrichmentPrompt);
  registerPrompt(gapAnalysisPrompt);
  registerPrompt(foundationPrompt);
  registerPrompt(pitchDeckPrompt);
  registerPrompt(onePagerPrompt);
  registerPrompt(salesDeckPrompt);
  registered = true;
}

registerAllPrompts();

export { getPrompt, listPrompts, registerPrompt } from "./registry";
export type { PromptId, PromptModule } from "./types";

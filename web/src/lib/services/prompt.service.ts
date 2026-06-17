import "@/lib/prompts";
import { getPrompt, listPrompts } from "@/lib/prompts/registry";
import type { PromptId, PromptModule } from "@/lib/prompts/types";

// ─────────────────────────────────────────────────────────────────────────────
// Prompt service
//
// Thin read API over the prompt registry, for admin tooling and for pinning a
// prompt version when regenerating an older result.
// ─────────────────────────────────────────────────────────────────────────────

export function listPromptVersions(): Array<{ id: PromptId; versions: string[] }> {
  return listPrompts();
}

export function getPromptVersion<I = unknown>(
  id: PromptId,
  version?: string
): { id: PromptId; version: string; description: string } {
  const prompt = getPrompt<I>(id, version) as PromptModule<I>;
  return { id: prompt.id, version: prompt.version, description: prompt.description };
}

import Anthropic from "@anthropic-ai/sdk";
import { CanonicalNarrativeSchema, type CanonicalNarrative } from "@/lib/schemas/narrative.schema";
import { NARRATIVE_SYSTEM_PROMPT, buildNarrativeUserPrompt } from "@/lib/prompts/narrative";
import type { NormalizedIntake } from "@/lib/schemas/intake.schema";

const client = new Anthropic();

export async function generateNarrative(normalized: NormalizedIntake): Promise<CanonicalNarrative> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: NARRATIVE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildNarrativeUserPrompt(normalized),
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  const parsed = JSON.parse(text);
  return CanonicalNarrativeSchema.parse(parsed);
}

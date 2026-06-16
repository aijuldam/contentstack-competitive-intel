import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AssetSectionSchema } from "@/lib/schemas/asset.schema";
import { getAssetSystemPrompt, buildAssetUserPrompt } from "@/lib/prompts/assets";
import type { CanonicalNarrative } from "@/lib/schemas/narrative.schema";

const client = new Anthropic();

export async function generateOnePager(
  narrative: CanonicalNarrative
): Promise<z.infer<typeof AssetSectionSchema>[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: getAssetSystemPrompt("one_pager"),
    messages: [{ role: "user", content: buildAssetUserPrompt(narrative) }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const parsed = JSON.parse(text);
  return z.array(AssetSectionSchema).parse(parsed);
}

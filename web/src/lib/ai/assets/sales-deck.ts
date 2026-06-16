import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AssetSectionSchema } from "@/lib/schemas/asset.schema";
import { getAssetSystemPrompt, buildAssetUserPrompt } from "@/lib/prompts/assets";
import type { CanonicalNarrative } from "@/lib/schemas/narrative.schema";

const client = new Anthropic();

export async function generateSalesDeck(
  narrative: CanonicalNarrative
): Promise<z.infer<typeof AssetSectionSchema>[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: getAssetSystemPrompt("sales_deck"),
    messages: [{ role: "user", content: buildAssetUserPrompt(narrative) }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const parsed = JSON.parse(text);
  return z.array(AssetSectionSchema).parse(parsed);
}

import Anthropic from "@anthropic-ai/sdk";
import { NormalizedIntakeSchema, type RawIntake, type NormalizedIntake } from "@/lib/schemas/intake.schema";
import { NORMALIZER_SYSTEM_PROMPT, buildNormalizerUserPrompt } from "@/lib/prompts/normalizer";

const client = new Anthropic();

export async function normalizeIntake(intake: RawIntake): Promise<NormalizedIntake> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: NORMALIZER_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildNormalizerUserPrompt(intake),
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  const parsed = JSON.parse(text);
  return NormalizedIntakeSchema.parse(parsed);
}

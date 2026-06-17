import { createHash } from "crypto";
import type { z } from "zod";
import type { PromptModule } from "@/lib/prompts/types";
import type {
  GenerationMetadata,
  ValidationResult,
} from "@/lib/schemas/generation.schema";
import { getProvider, type LLMProvider } from "./provider";
import { parseJsonResponse } from "./json";
import { GenerationError } from "./errors";

// ─────────────────────────────────────────────────────────────────────────────
// Structured output pipeline
//
// runStructured is the single safe path for turning a prompt + input into a
// schema-valid object. It calls the model, extracts JSON, validates against the
// zod schema, and on failure retries with a repair message that includes the
// validation errors. Malformed output is never silently accepted: if all
// attempts fail it throws a GenerationError carrying debug metadata.
// ─────────────────────────────────────────────────────────────────────────────

export interface StructuredResult<T> {
  data: T;
  metadata: GenerationMetadata;
  validation: ValidationResult;
  raw: string;
}

export interface RunStructuredOptions<I, S extends z.ZodTypeAny> {
  prompt: PromptModule<I>;
  input: I;
  schema: S;
  maxTokens: number;
  maxAttempts?: number;
  provider?: LLMProvider;
  model?: string;
}

function hashInput(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex")
    .slice(0, 16);
}

function flattenZodErrors(error: z.ZodError): string[] {
  return error.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
  );
}

// Builds the repair message sent on retry after a parse or validation failure.
function buildRepairMessage(
  originalUser: string,
  previousRaw: string,
  problems: string[]
): string {
  return `
${originalUser}

Your previous response could not be used. Problems found:
${problems.map((p) => `- ${p}`).join("\n")}

Previous response:
${previousRaw}

Return corrected output as valid JSON only. No prose, no markdown code fences.
`.trim();
}

export async function runStructured<I, S extends z.ZodTypeAny>(
  opts: RunStructuredOptions<I, S>
): Promise<StructuredResult<z.infer<S>>> {
  const provider = opts.provider ?? getProvider();
  const maxAttempts = opts.maxAttempts ?? 2;
  const system = opts.prompt.system;
  const baseUser = opts.prompt.build(opts.input);
  const inputHash = hashInput(opts.input);
  const startedAt = Date.now();

  let userMessage = baseUser;
  let lastRaw = "";
  let lastParseError: string | undefined;
  let lastValidationErrors: string[] = [];
  let usage: GenerationMetadata["usage"];
  let model = opts.model ?? "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const completion = await provider.complete({
      system,
      user: userMessage,
      maxTokens: opts.maxTokens,
      model: opts.model,
    });
    lastRaw = completion.text;
    model = completion.model;
    usage = completion.usage;

    const parsed = parseJsonResponse(completion.text);
    if (!parsed.ok) {
      lastParseError = parsed.error;
      lastValidationErrors = [];
      userMessage = buildRepairMessage(baseUser, lastRaw, [
        `Invalid JSON: ${parsed.error}`,
      ]);
      continue;
    }

    const result = opts.schema.safeParse(parsed.value);
    if (result.success) {
      return {
        data: result.data,
        metadata: {
          prompt: { id: opts.prompt.id, version: opts.prompt.version },
          model,
          attempts: attempt,
          repaired: attempt > 1,
          input_hash: inputHash,
          usage,
          duration_ms: Date.now() - startedAt,
          created_at: new Date().toISOString(),
        },
        validation: { ok: true, errors: [] },
        raw: lastRaw,
      };
    }

    lastParseError = undefined;
    lastValidationErrors = flattenZodErrors(result.error);
    userMessage = buildRepairMessage(baseUser, lastRaw, lastValidationErrors);
  }

  throw new GenerationError(
    `Generation for ${opts.prompt.id} failed schema validation after ${maxAttempts} attempts.`,
    {
      prompt_id: opts.prompt.id,
      prompt_version: opts.prompt.version,
      attempts: maxAttempts,
      parse_error: lastParseError,
      validation_errors: lastValidationErrors,
      last_raw: lastRaw,
    }
  );
}

import Anthropic from "@anthropic-ai/sdk";

// ─────────────────────────────────────────────────────────────────────────────
// LLM provider abstraction
//
// The pipeline depends only on this interface, so the model or vendor can be
// swapped without touching prompt, schema, or service code. The default
// implementation calls Anthropic; tests can inject a stub provider.
// ─────────────────────────────────────────────────────────────────────────────

export interface CompletionParams {
  system: string;
  user: string;
  maxTokens: number;
  model?: string;
  temperature?: number;
}

export interface CompletionResult {
  text: string;
  model: string;
  usage?: { input_tokens?: number; output_tokens?: number };
}

export interface LLMProvider {
  complete(params: CompletionParams): Promise<CompletionResult>;
}

export const DEFAULT_MODEL = "claude-sonnet-4-6";

// Anthropic-backed provider. Reads ANTHROPIC_API_KEY from the environment.
export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private defaultModel: string;

  constructor(opts: { apiKey?: string; model?: string } = {}) {
    this.client = new Anthropic(opts.apiKey ? { apiKey: opts.apiKey } : {});
    this.defaultModel = opts.model ?? DEFAULT_MODEL;
  }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const model = params.model ?? this.defaultModel;
    const message = await this.client.messages.create({
      model,
      max_tokens: params.maxTokens,
      temperature: params.temperature ?? 0.2,
      system: params.system,
      messages: [{ role: "user", content: params.user }],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    return {
      text,
      model,
      usage: {
        input_tokens: message.usage?.input_tokens,
        output_tokens: message.usage?.output_tokens,
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Default provider singleton, swappable for tests or alternate vendors.
// ─────────────────────────────────────────────────────────────────────────────
let activeProvider: LLMProvider | null = null;

export function getProvider(): LLMProvider {
  if (!activeProvider) {
    activeProvider = new AnthropicProvider();
  }
  return activeProvider;
}

export function setProvider(provider: LLMProvider): void {
  activeProvider = provider;
}

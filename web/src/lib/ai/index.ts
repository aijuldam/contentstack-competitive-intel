// Public surface of the AI layer. Services and routes import from here.
export {
  generateMessagingFoundation,
  normalizeIntake,
  type FoundationGenerationResult,
  type GenerateFoundationOptions,
} from "./foundation";
export { generateAsset, type GenerateAssetOptions } from "./assets";
export { runStructured, type StructuredResult } from "./pipeline";
export {
  getProvider,
  setProvider,
  AnthropicProvider,
  DEFAULT_MODEL,
  type LLMProvider,
  type CompletionParams,
  type CompletionResult,
} from "./provider";
export { GenerationError, type GenerationErrorDebug } from "./errors";
export { parseJsonResponse } from "./json";

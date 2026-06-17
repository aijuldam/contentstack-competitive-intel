// Debug payload attached to a failed generation, useful for logging and admin
// inspection without leaking raw model output to end users.
export interface GenerationErrorDebug {
  prompt_id: string;
  prompt_version: string;
  attempts: number;
  parse_error?: string;
  validation_errors?: string[];
  last_raw?: string;
}

// Thrown when a structured generation cannot produce schema-valid output within
// the allowed attempts. Carries structured debug data; callers should surface a
// product-friendly message and store the debug payload.
export class GenerationError extends Error {
  readonly debug: GenerationErrorDebug;

  constructor(message: string, debug: GenerationErrorDebug) {
    super(message);
    this.name = "GenerationError";
    this.debug = debug;
  }
}

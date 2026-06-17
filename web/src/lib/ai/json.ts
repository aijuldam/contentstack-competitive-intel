// ─────────────────────────────────────────────────────────────────────────────
// Robust JSON extraction
//
// Models occasionally wrap JSON in prose or code fences despite instructions.
// These helpers extract the first balanced JSON value from a response and parse
// it, so a stray sentence does not fail an otherwise valid generation. They do
// not repair malformed JSON; that is handled by the pipeline's retry loop.
// ─────────────────────────────────────────────────────────────────────────────

// Strips ```json ... ``` fences if present.
function stripCodeFences(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fence ? fence[1].trim() : text.trim();
}

// Returns the substring spanning the first balanced { } or [ ] block, honoring
// strings and escapes so braces inside string literals do not throw off depth.
function extractBalanced(text: string): string | null {
  const start = text.search(/[[{]/);
  if (start === -1) return null;

  const open = text[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export interface JsonParseResult {
  ok: boolean;
  value?: unknown;
  error?: string;
}

// Extracts and parses JSON from a raw model response. Never throws.
export function parseJsonResponse(raw: string): JsonParseResult {
  const cleaned = stripCodeFences(raw);
  const candidate = extractBalanced(cleaned) ?? cleaned;
  try {
    return { ok: true, value: JSON.parse(candidate) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown JSON parse error",
    };
  }
}

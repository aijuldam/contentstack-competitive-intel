import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, RunType } from "@/lib/db/types";
import type { StructuredResult } from "@/lib/ai/pipeline";

type Client = SupabaseClient<Database>;

// ─────────────────────────────────────────────────────────────────────────────
// Generation run logging
//
// Every generation step writes a row to generation_runs: which prompt version
// ran, how many attempts it took, where the output landed, and any debug data
// on failure. This is the audit trail for regeneration and troubleshooting.
// ─────────────────────────────────────────────────────────────────────────────

export interface LogRunParams {
  projectId: string;
  runType: RunType;
  status: "complete" | "error";
  inputHash?: string | null;
  promptVersion?: string | null;
  attempts?: number;
  outputRef?: { table: string; id: string } | null;
  debug?: Record<string, unknown> | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

export async function logGenerationRun(
  client: Client,
  params: LogRunParams
): Promise<void> {
  await client.from("generation_runs").insert({
    project_id: params.projectId,
    run_type: params.runType,
    status: params.status,
    input_hash: params.inputHash ?? null,
    prompt_version: params.promptVersion ?? null,
    attempts: params.attempts ?? 0,
    output_ref: params.outputRef ?? null,
    debug: params.debug ?? null,
    error_message: params.errorMessage ?? null,
    started_at: params.startedAt ?? null,
    completed_at: params.completedAt ?? new Date().toISOString(),
  });
}

// Builds a success log entry from a structured generation result.
export function successLogFromResult(
  projectId: string,
  runType: RunType,
  result: StructuredResult<unknown>,
  outputRef?: { table: string; id: string }
): LogRunParams {
  return {
    projectId,
    runType,
    status: "complete",
    inputHash: result.metadata.input_hash,
    promptVersion: `${result.metadata.prompt.id}@${result.metadata.prompt.version}`,
    attempts: result.metadata.attempts,
    outputRef: outputRef ?? null,
    completedAt: result.metadata.created_at,
  };
}

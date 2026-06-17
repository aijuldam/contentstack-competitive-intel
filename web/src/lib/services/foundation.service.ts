import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  NarrativeVersion,
  FoundationJson,
  GenerationMetadataJson,
  NormalizedJson,
} from "@/lib/db/types";
import type { RunType } from "@/lib/db/types";
import {
  generateMessagingFoundation,
  type FoundationGenerationResult,
} from "@/lib/ai";
import { GenerationError } from "@/lib/ai/errors";
import {
  MessagingFoundationSchema,
  type MessagingFoundation,
} from "@/lib/schemas/foundation.schema";
import {
  foundationToMeddicBlocks,
  foundationToCotmBlocks,
} from "@/lib/schemas/foundation.map";
import type { RawIntake } from "@/lib/schemas/intake.schema";
import type { EnrichmentInput } from "@/lib/schemas/enrichment.schema";
import type { ValidationResult } from "@/lib/schemas/generation.schema";
import { scoreIntakeConfidence } from "@/lib/utils/confidence";
import { logGenerationRun, successLogFromResult } from "./generation-log.service";

type Client = SupabaseClient<Database>;

// ─────────────────────────────────────────────────────────────────────────────
// Foundation service
//
// Owns the storage side of the Messaging Foundation: running the AI pipeline,
// persisting normalized intake, creating foundation versions, logging runs, and
// gating assets behind an approved version.
// ─────────────────────────────────────────────────────────────────────────────

export interface GenerateFoundationForProjectParams {
  projectId: string;
  userId: string;
  // If omitted, the latest project_sources.raw_input for the project is used.
  intake?: RawIntake;
  enrichmentInput?: EnrichmentInput;
  model?: string;
  maxAttempts?: number;
}

export interface FoundationVersionResult {
  version: NarrativeVersion;
  foundation: MessagingFoundation;
  pipeline: FoundationGenerationResult;
}

// Validates an untrusted foundation document (e.g. read from storage).
export function validateFoundation(value: unknown): ValidationResult {
  const result = MessagingFoundationSchema.safeParse(value);
  if (result.success) return { ok: true, errors: [] };
  return {
    ok: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
    ),
  };
}

// Reads the most recent project source row for a project (or null).
async function getLatestSource(client: Client, projectId: string) {
  const { data, error } = await client
    .from("project_sources")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Generates a Messaging Foundation for a project and stores it as a new version.
// On generation failure, logs an error run and rethrows a product-friendly error.
export async function generateFoundationForProject(
  client: Client,
  params: GenerateFoundationForProjectParams
): Promise<FoundationVersionResult> {
  const source = await getLatestSource(client, params.projectId);
  const intake = params.intake ?? (source?.raw_input as RawIntake | undefined);

  if (!intake) {
    throw new Error(
      "This project has no intake yet. Add product inputs before generating a foundation."
    );
  }

  let pipeline: FoundationGenerationResult;
  try {
    pipeline = await generateMessagingFoundation({
      intake,
      enrichmentInput: params.enrichmentInput,
      model: params.model,
      maxAttempts: params.maxAttempts,
    });
  } catch (err) {
    if (err instanceof GenerationError) {
      await logGenerationRun(client, {
        projectId: params.projectId,
        runType: promptIdToRunType(err.debug.prompt_id),
        status: "error",
        promptVersion: `${err.debug.prompt_id}@${err.debug.prompt_version}`,
        attempts: err.debug.attempts,
        debug: { ...err.debug },
        errorMessage: err.message,
      });
      throw new Error(
        "We could not generate a valid Messaging Foundation from these inputs. Try adding more detail and regenerate."
      );
    }
    throw err;
  }

  const foundation = pipeline.foundation.data;

  // Persist normalized intake + readiness back to the source row.
  await persistNormalizedSource(client, params.projectId, source?.id, intake, pipeline);

  // Store the foundation as a new current version.
  const version = await createFoundationVersion(client, {
    projectId: params.projectId,
    userId: params.userId,
    foundation,
    metadata: pipeline.foundation.metadata as unknown as GenerationMetadataJson,
    promptVersion: `${pipeline.foundation.metadata.prompt.id}@${pipeline.foundation.metadata.prompt.version}`,
  });

  // Log each pipeline step.
  await logGenerationRun(
    client,
    successLogFromResult(params.projectId, "normalize", pipeline.normalized)
  );
  if (pipeline.enrichment) {
    await logGenerationRun(
      client,
      successLogFromResult(params.projectId, "enrichment", pipeline.enrichment)
    );
  }
  await logGenerationRun(
    client,
    successLogFromResult(params.projectId, "gap_analysis", pipeline.gaps)
  );
  await logGenerationRun(
    client,
    successLogFromResult(params.projectId, "foundation", pipeline.foundation, {
      table: "narrative_versions",
      id: version.id,
    })
  );

  return { version, foundation, pipeline };
}

async function persistNormalizedSource(
  client: Client,
  projectId: string,
  sourceId: string | undefined,
  intake: RawIntake,
  pipeline: FoundationGenerationResult
): Promise<void> {
  const normalized = pipeline.normalized.data;
  const confidence = scoreIntakeConfidence(normalized);

  const normalizedJson = normalized as unknown as NormalizedJson;

  if (sourceId) {
    await client
      .from("project_sources")
      .update({
        normalized_json: normalizedJson,
        confidence_score: confidence,
        normalization_status: "complete",
      })
      .eq("id", sourceId);
    return;
  }

  await client.from("project_sources").insert({
    project_id: projectId,
    raw_input: intake,
    normalized_json: normalizedJson,
    confidence_score: confidence,
    normalization_status: "complete",
  });
}

// Maps an internal prompt id to the stored run_type for logging.
function promptIdToRunType(promptId: string): RunType {
  if (promptId.startsWith("asset")) return "asset";
  if (promptId === "normalizer") return "normalize";
  if (promptId === "enrichment") return "enrichment";
  if (promptId === "gap_analysis") return "gap_analysis";
  return "foundation";
}

// Creates a new current foundation version, demoting the previous current one.
export async function createFoundationVersion(
  client: Client,
  params: {
    projectId: string;
    userId: string;
    foundation: MessagingFoundation;
    metadata: GenerationMetadataJson;
    promptVersion: string;
  }
): Promise<NarrativeVersion> {
  const { data: existing } = await client
    .from("narrative_versions")
    .select("version_number")
    .eq("project_id", params.projectId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (existing?.version_number ?? 0) + 1;

  await client
    .from("narrative_versions")
    .update({ is_current: false })
    .eq("project_id", params.projectId)
    .eq("is_current", true);

  const { data, error } = await client
    .from("narrative_versions")
    .insert({
      project_id: params.projectId,
      version_number: nextVersion,
      foundation: params.foundation as unknown as FoundationJson,
      meddic_blocks: foundationToMeddicBlocks(params.foundation),
      cotm_blocks: foundationToCotmBlocks(params.foundation),
      prompt_version: params.promptVersion,
      generation_metadata: params.metadata,
      generation_status: "complete" as const,
      is_current: true,
      created_by: params.userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as NarrativeVersion;
}

// Returns the current foundation version and its parsed foundation, or null.
export async function getCurrentFoundation(
  client: Client,
  projectId: string
): Promise<{ version: NarrativeVersion; foundation: MessagingFoundation } | null> {
  const { data, error } = await client
    .from("narrative_versions")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_current", true)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.foundation) return null;

  const parsed = MessagingFoundationSchema.safeParse(data.foundation);
  if (!parsed.success) return null;
  return { version: data as NarrativeVersion, foundation: parsed.data };
}

// Marks a foundation version approved so assets may be derived from it.
export async function approveFoundationVersion(
  client: Client,
  narrativeVersionId: string,
  userId: string
): Promise<void> {
  const { error } = await client
    .from("narrative_versions")
    .update({
      approved_at: new Date().toISOString(),
      approved_by: userId,
    })
    .eq("id", narrativeVersionId);
  if (error) throw error;
}

// Returns the current foundation only if it has been approved.
export async function getApprovedFoundation(
  client: Client,
  projectId: string
): Promise<{ version: NarrativeVersion; foundation: MessagingFoundation } | null> {
  const current = await getCurrentFoundation(client, projectId);
  if (!current || !current.version.approved_at) return null;
  return current;
}

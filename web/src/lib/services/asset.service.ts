import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Asset,
  AssetVersion,
  GenerationMetadataJson,
  AssetSection as DbAssetSection,
} from "@/lib/db/types";
import { generateAsset } from "@/lib/ai";
import { GenerationError } from "@/lib/ai/errors";
import type { AssetType } from "@/lib/schemas/asset.schema";
import { getApprovedFoundation } from "./foundation.service";
import { logGenerationRun, successLogFromResult } from "./generation-log.service";

type Client = SupabaseClient<Database>;

// ─────────────────────────────────────────────────────────────────────────────
// Asset service
//
// Generates an asset from the project's approved Messaging Foundation version.
// Assets cannot be generated until a foundation version is approved, which keeps
// every asset traceable to a reviewed source of truth.
// ─────────────────────────────────────────────────────────────────────────────

export interface GenerateAssetForProjectParams {
  projectId: string;
  userId: string;
  assetType: AssetType;
  model?: string;
  maxAttempts?: number;
}

export interface AssetVersionResult {
  asset: Asset;
  version: AssetVersion;
}

export async function generateAssetForProject(
  client: Client,
  params: GenerateAssetForProjectParams
): Promise<AssetVersionResult> {
  const approved = await getApprovedFoundation(client, params.projectId);
  if (!approved) {
    throw new Error(
      "Approve a Messaging Foundation version before generating assets."
    );
  }

  let result;
  try {
    result = await generateAsset(params.assetType, approved.foundation, {
      model: params.model,
      maxAttempts: params.maxAttempts,
    });
  } catch (err) {
    if (err instanceof GenerationError) {
      await logGenerationRun(client, {
        projectId: params.projectId,
        runType: "asset",
        status: "error",
        promptVersion: `${err.debug.prompt_id}@${err.debug.prompt_version}`,
        attempts: err.debug.attempts,
        debug: { ...err.debug },
        errorMessage: err.message,
      });
      throw new Error(
        `We could not generate a valid ${params.assetType.replace("_", " ")}. Try regenerating.`
      );
    }
    throw err;
  }

  const asset = await ensureAsset(client, params.projectId, params.assetType);
  const version = await createAssetVersion(client, {
    assetId: asset.id,
    narrativeVersionId: approved.version.id,
    sections: result.data as unknown as DbAssetSection[],
    metadata: result.metadata as unknown as GenerationMetadataJson,
    promptVersion: `${result.metadata.prompt.id}@${result.metadata.prompt.version}`,
    userId: params.userId,
  });

  await logGenerationRun(
    client,
    successLogFromResult(params.projectId, "asset", result, {
      table: "asset_versions",
      id: version.id,
    })
  );

  return { asset, version };
}

// Returns the asset row for (project, type), creating it if needed.
async function ensureAsset(
  client: Client,
  projectId: string,
  assetType: AssetType
): Promise<Asset> {
  const { data: existing, error } = await client
    .from("assets")
    .select("*")
    .eq("project_id", projectId)
    .eq("asset_type", assetType)
    .maybeSingle();
  if (error) throw error;
  if (existing) return existing as Asset;

  const { data, error: insertError } = await client
    .from("assets")
    .insert({
      project_id: projectId,
      asset_type: assetType,
      generation_status: "complete" as const,
    })
    .select()
    .single();
  if (insertError) throw insertError;
  return data as Asset;
}

// Creates a new current asset version, demoting the previous current one.
async function createAssetVersion(
  client: Client,
  params: {
    assetId: string;
    narrativeVersionId: string;
    sections: DbAssetSection[];
    metadata: GenerationMetadataJson;
    promptVersion: string;
    userId: string;
  }
): Promise<AssetVersion> {
  const { data: existing } = await client
    .from("asset_versions")
    .select("version_number")
    .eq("asset_id", params.assetId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (existing?.version_number ?? 0) + 1;

  await client
    .from("asset_versions")
    .update({ is_current: false })
    .eq("asset_id", params.assetId)
    .eq("is_current", true);

  const { data, error } = await client
    .from("asset_versions")
    .insert({
      asset_id: params.assetId,
      narrative_version_id: params.narrativeVersionId,
      version_number: nextVersion,
      sections: params.sections,
      prompt_version: params.promptVersion,
      generation_metadata: params.metadata,
      generation_status: "complete" as const,
      is_current: true,
      created_by: params.userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as AssetVersion;
}

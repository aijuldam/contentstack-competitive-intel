import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";
import type { ExportFormat, ExportJobView } from "@/lib/export/types";
import { fromDbStatus, toDbStatus } from "@/lib/export/types";
import { processExport, emitExportEvent } from "@/lib/export";
import type { AssetSection, AssetType } from "@/lib/schemas/asset.schema";
import type { RenderContext } from "@/lib/renderers/types";

type Client = SupabaseClient<Database>;

// ─────────────────────────────────────────────────────────────────────────────
// Export service
//
// Manages export_job records and orchestrates the export pipeline.
// For the MVP, processExport() runs synchronously in the server action.
// To move to async: pull processExport() out of requestExport(), enqueue a
// background job (Inngest / BullMQ / Supabase Edge Functions), and poll status.
// ─────────────────────────────────────────────────────────────────────────────

// Returns export jobs for all asset versions of a project's assets.
export async function listExportJobsForProject(
  client: Client,
  projectId: string
): Promise<ExportJobView[]> {
  const { data: assets, error: ae } = await client
    .from("assets")
    .select("id, asset_type")
    .eq("project_id", projectId);
  if (ae) throw ae;
  if (!assets?.length) return [];

  const assetTypeMap = new Map(
    assets.map((a) => [a.id, a.asset_type as AssetType])
  );

  const { data: versions, error: ve } = await client
    .from("asset_versions")
    .select("id, asset_id")
    .in("asset_id", assets.map((a) => a.id));
  if (ve) throw ve;
  if (!versions?.length) return [];

  const versionToAsset = new Map(versions.map((v) => [v.id, v.asset_id]));

  const { data: jobs, error: je } = await client
    .from("export_jobs")
    .select("*")
    .in("asset_version_id", versions.map((v) => v.id))
    .order("created_at", { ascending: false });
  if (je) throw je;

  return (jobs ?? []).map((row) => {
    const assetId = versionToAsset.get(row.asset_version_id) ?? "";
    return {
      id: row.id,
      projectId,
      assetId,
      assetVersionId: row.asset_version_id,
      assetType: assetTypeMap.get(assetId) ?? "pitch_deck",
      format: row.format as ExportFormat,
      status: fromDbStatus(row.status),
      storagePath: row.storage_path,
      downloadUrl: null,
      errorMessage: row.error_message,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    } satisfies ExportJobView;
  });
}

export interface RequestExportParams {
  projectId: string;
  assetId: string;
  assetVersionId: string;
  assetType: AssetType;
  sections: AssetSection[];
  projectName: string;
  versionNumber: number;
  generatedAt: string;
  format: ExportFormat;
  requestedBy: string;
}

// Creates a job, runs the export pipeline, updates the record, and returns the view.
export async function requestExport(
  client: Client,
  params: RequestExportParams
): Promise<ExportJobView> {
  // 1. Create job in pending state
  const { data: jobRow, error: ce } = await client
    .from("export_jobs")
    .insert({
      asset_version_id: params.assetVersionId,
      format: params.format as "pdf" | "markdown" | "pptx",
      status: "pending" as const,
    })
    .select()
    .single();
  if (ce) throw ce;

  const jobId = (jobRow as { id: string }).id;

  emitExportEvent({
    type: "export_requested",
    jobId,
    assetType: params.assetType,
    format: params.format,
    projectId: params.projectId,
  });

  // 2. Mark processing
  await client
    .from("export_jobs")
    .update({ status: toDbStatus("processing") as "pending" | "processing" | "complete" | "error" })
    .eq("id", jobId);

  const context: RenderContext = {
    projectName: params.projectName,
    assetVersionId: params.assetVersionId,
    versionNumber: params.versionNumber,
    generatedAt: params.generatedAt,
  };

  // 3. Run export (inline for MVP — move to queue for production)
  try {
    const { storagePath, downloadUrl } = await processExport({
      jobId,
      assetType: params.assetType,
      sections: params.sections,
      context,
      format: params.format,
      projectId: params.projectId,
    });

    await client
      .from("export_jobs")
      .update({
        status: toDbStatus("completed") as "pending" | "processing" | "complete" | "error",
        storage_path: storagePath,
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return {
      id: jobId,
      projectId: params.projectId,
      assetId: params.assetId,
      assetVersionId: params.assetVersionId,
      assetType: params.assetType,
      format: params.format,
      status: "completed",
      storagePath,
      downloadUrl,
      errorMessage: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown export error";

    emitExportEvent({
      type: "export_failed",
      jobId,
      assetType: params.assetType,
      format: params.format,
      error: message,
    });

    await client
      .from("export_jobs")
      .update({
        status: toDbStatus("failed") as "pending" | "processing" | "complete" | "error",
        error_message: message,
      })
      .eq("id", jobId);

    throw new Error(message);
  }
}

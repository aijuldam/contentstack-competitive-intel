export type { ExportFormat, ExportStatus, ExportJobView } from "./types";
export { fromDbStatus, toDbStatus } from "./types";
export { emitExportEvent } from "./events";
export type { ExportEvent } from "./events";
export { buildStoragePath, SupabaseExportStorage } from "./storage";
export { generateHtml } from "./html";

import type { AssetType, AssetSection } from "@/lib/schemas/asset.schema";
import type { RenderContext } from "@/lib/renderers/types";
import type { ExportFormat } from "./types";
import { generateHtml } from "./html";
import { generatePdf } from "./pdf";
import { generatePptx } from "./pptx";
import { SupabaseExportStorage, buildStoragePath } from "./storage";
import { emitExportEvent } from "./events";

const storage = new SupabaseExportStorage();

export async function processExport(params: {
  jobId: string;
  assetType: AssetType;
  sections: AssetSection[];
  context: RenderContext;
  format: ExportFormat;
  projectId: string;
}): Promise<{ storagePath: string; downloadUrl: string }> {
  const startedAt = Date.now();

  emitExportEvent({
    type: "export_started",
    jobId: params.jobId,
    assetType: params.assetType,
    format: params.format,
  });

  let content: string | Buffer;
  let contentType: string;

  switch (params.format) {
    case "html": {
      content = generateHtml(params.assetType, params.sections, params.context);
      contentType = "text/html;charset=utf-8";
      break;
    }
    case "pdf": {
      content = await generatePdf(params.assetType, params.sections, params.context);
      contentType = "application/pdf";
      break;
    }
    case "pptx": {
      content = await generatePptx(params.assetType, params.sections, params.context);
      contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      break;
    }
  }

  const path = buildStoragePath({
    projectId: params.projectId,
    assetVersionId: params.context.assetVersionId,
    jobId: params.jobId,
    format: params.format,
  });

  const { storagePath } = await storage.upload({ path, content, contentType });
  const downloadUrl = await storage.getSignedUrl(storagePath);

  emitExportEvent({
    type: "export_completed",
    jobId: params.jobId,
    assetType: params.assetType,
    format: params.format,
    durationMs: Date.now() - startedAt,
  });

  return { storagePath, downloadUrl };
}

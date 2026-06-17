import type { AssetType } from "@/lib/schemas/asset.schema";

export type ExportFormat = "html" | "pdf" | "pptx";

// UI-facing statuses. DB stores "pending"|"processing"|"complete"|"error".
export type ExportStatus = "queued" | "processing" | "completed" | "failed";

export function toDbStatus(s: ExportStatus): string {
  switch (s) {
    case "queued":     return "pending";
    case "processing": return "processing";
    case "completed":  return "complete";
    case "failed":     return "error";
  }
}

export function fromDbStatus(s: string): ExportStatus {
  switch (s) {
    case "pending":    return "queued";
    case "processing": return "processing";
    case "complete":   return "completed";
    case "error":      return "failed";
    default:           return "queued";
  }
}

export interface ExportJobView {
  id: string;
  projectId: string;
  assetId: string;
  assetVersionId: string;
  assetType: AssetType;
  format: ExportFormat;
  status: ExportStatus;
  storagePath: string | null;
  downloadUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

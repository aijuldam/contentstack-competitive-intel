// ─────────────────────────────────────────────────────────────────────────────
// Export instrumentation hooks
//
// Bridges export lifecycle events to the unified analytics layer.
// ─────────────────────────────────────────────────────────────────────────────

import { track } from "@/lib/analytics/server";
import { E } from "@/lib/analytics/events";

export type ExportEvent =
  | { type: "export_requested"; jobId: string; assetType: string; format: string; projectId: string }
  | { type: "export_started";   jobId: string; assetType: string; format: string }
  | { type: "export_completed"; jobId: string; assetType: string; format: string; durationMs: number }
  | { type: "export_failed";    jobId: string; assetType: string; format: string; error: string }
  | { type: "export_downloaded"; jobId: string; format: string };

export function emitExportEvent(event: ExportEvent): void {
  switch (event.type) {
    case "export_requested":
      track(E.EXPORT_REQUESTED, {
        job_id: event.jobId,
        asset_type: event.assetType,
        export_format: event.format,
        project_id: event.projectId,
      });
      break;

    case "export_completed":
      track(E.EXPORT_COMPLETED, {
        job_id: event.jobId,
        asset_type: event.assetType,
        export_format: event.format,
        duration_ms: event.durationMs,
      });
      break;

    default:
      if (process.env.NODE_ENV === "development") {
        console.log("[export:event]", event.type, event);
      }
  }
}

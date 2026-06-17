export type ExportEvent =
  | { type: "export_requested"; jobId: string; assetType: string; format: string; projectId: string }
  | { type: "export_started";   jobId: string; assetType: string; format: string }
  | { type: "export_completed"; jobId: string; assetType: string; format: string; durationMs: number }
  | { type: "export_failed";    jobId: string; assetType: string; format: string; error: string }
  | { type: "export_downloaded"; jobId: string; format: string };

// Replace with an analytics provider (Posthog, Segment, etc.) in production.
export function emitExportEvent(event: ExportEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[export-event]", event.type, event);
  }
}

export interface ExportStorage {
  upload(params: {
    path: string;
    content: string | Buffer;
    contentType: string;
  }): Promise<{ storagePath: string }>;

  getSignedUrl(storagePath: string, expiresInSeconds?: number): Promise<string>;
}

// Stub — wire a real Supabase client in production:
//   const { error } = await supabase.storage.from("exports").upload(path, content, { contentType })
//   const { data }  = await supabase.storage.from("exports").createSignedUrl(path, 3600)
export class SupabaseExportStorage implements ExportStorage {
  async upload(params: {
    path: string;
    content: string | Buffer;
    contentType: string;
  }): Promise<{ storagePath: string }> {
    void params;
    return { storagePath: `exports/${params.path}` };
  }

  async getSignedUrl(storagePath: string): Promise<string> {
    return `#stub-download-${storagePath}`;
  }
}

// Path convention: {projectId}/{assetVersionId}/{jobId}.{ext}
export function buildStoragePath(params: {
  projectId: string;
  assetVersionId: string;
  jobId: string;
  format: string;
}): string {
  const ext = params.format === "pptx" ? "pptx" : params.format === "pdf" ? "pdf" : "html";
  return `${params.projectId}/${params.assetVersionId}/${params.jobId}.${ext}`;
}

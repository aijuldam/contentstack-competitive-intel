// Asset renderer stubs — Phase 2 will implement PDF/HTML rendering
import type { Asset, AssetSection } from "@/types/asset";

export type RenderFormat = "html" | "pdf" | "markdown";

// Placeholder: renders asset sections to markdown
export function renderAssetToMarkdown(asset: Asset): string {
  return asset.sections
    .map((section: AssetSection) => `## ${section.label}\n\n${section.content}`)
    .join("\n\n---\n\n");
}

// TODO Phase 2: implement PDF export via puppeteer or react-pdf
export async function renderAssetToPDF(_asset: Asset): Promise<Buffer> {
  throw new Error("PDF export not yet implemented — coming in Phase 2.");
}

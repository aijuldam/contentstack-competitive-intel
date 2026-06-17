import type { AssetType, AssetSection } from "@/lib/schemas/asset.schema";
import type { RenderContext } from "@/lib/renderers/types";
import { generateHtml } from "../html";

// PDF generation is not yet implemented.
// Integration path: generate print-optimized HTML (already has @media print CSS),
// then pass to Puppeteer (self-hosted) or Browserless.io (managed).
//
//   const html = generateHtml(assetType, sections, context);
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: "networkidle0" });
//   const pdf = await page.pdf({ format: "A4", printBackground: true });
//   await browser.close();
//   return pdf;
export async function generatePdf(
  assetType: AssetType,
  sections: AssetSection[],
  context: RenderContext
): Promise<Buffer> {
  void generateHtml(assetType, sections, context); // referenced when wired up
  throw new Error("PDF export is not yet available. Check back soon.");
}

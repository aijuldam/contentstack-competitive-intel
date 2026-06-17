import type { AssetType, AssetSection } from "@/lib/schemas/asset.schema";
import type { RenderContext } from "@/lib/renderers/types";
import { renderPitchDeck, renderSalesDeck } from "@/lib/renderers";

// PPTX generation is not yet implemented.
// Integration path: use PptxGenJS (npm install pptxgenjs) or a slide API.
// pitch_deck and sales_deck are the natural PPTX candidates.
//
//   import PptxGenJS from "pptxgenjs";
//   const pptx = new PptxGenJS();
//   for (const slide of output.slides) {
//     const s = pptx.addSlide();
//     s.addText(slide.title, { x: 0.5, y: 0.5, fontSize: 12, color: "888888" });
//     s.addText(slide.content, { x: 0.5, y: 1.5, fontSize: 18, color: "FFFFFF" });
//   }
//   return Buffer.from(await pptx.stream() as ArrayBuffer);
export async function generatePptx(
  assetType: AssetType,
  sections: AssetSection[],
  context: RenderContext
): Promise<Buffer> {
  if (assetType === "pitch_deck") {
    void renderPitchDeck(sections, context); // referenced when wired up
  } else if (assetType === "sales_deck") {
    void renderSalesDeck(sections, context);
  }
  throw new Error("PPTX export is not yet available. Check back soon.");
}

import type { AssetType, AssetSection } from "@/lib/schemas/asset.schema";
import type { RenderContext } from "@/lib/renderers/types";
import { render } from "@/lib/renderers";
import { generatePitchDeckHtml } from "./pitch-deck";
import { generateOnePagerHtml } from "./one-pager";
import { generateSalesDeckHtml } from "./sales-deck";

export { generatePitchDeckHtml } from "./pitch-deck";
export { generateOnePagerHtml } from "./one-pager";
export { generateSalesDeckHtml } from "./sales-deck";

export function generateHtml(
  assetType: AssetType,
  sections: AssetSection[],
  context: RenderContext
): string {
  const output = render(assetType, sections, context);
  switch (output.type) {
    case "pitch_deck":  return generatePitchDeckHtml(output);
    case "one_pager":   return generateOnePagerHtml(output);
    case "sales_deck":  return generateSalesDeckHtml(output);
  }
}

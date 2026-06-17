export { renderPitchDeck } from "./pitch-deck.renderer";
export { renderOnePager } from "./one-pager.renderer";
export { renderSalesDeck } from "./sales-deck.renderer";
export type {
  RenderContext,
  RenderOutput,
  PitchDeckRenderOutput,
  OnePagerRenderOutput,
  SalesDeckRenderOutput,
  SlideData,
  SectionData,
  TabGroupData,
  RendererFn,
} from "./types";

import type { AssetSection, AssetType } from "@/lib/schemas/asset.schema";
import type { RenderContext, RenderOutput } from "./types";
import { renderPitchDeck } from "./pitch-deck.renderer";
import { renderOnePager } from "./one-pager.renderer";
import { renderSalesDeck } from "./sales-deck.renderer";

export function render(
  assetType: AssetType,
  sections: AssetSection[],
  context: RenderContext
): RenderOutput {
  switch (assetType) {
    case "pitch_deck":
      return renderPitchDeck(sections, context);
    case "one_pager":
      return renderOnePager(sections, context);
    case "sales_deck":
      return renderSalesDeck(sections, context);
  }
}

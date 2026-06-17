import type { AssetSection, AssetType } from "@/lib/schemas/asset.schema";

export interface RenderContext {
  projectName: string;
  assetVersionId: string;
  versionNumber: number;
  generatedAt: string;
}

export interface SlideData {
  slideNumber: number;
  id: string;
  title: string;
  content: string;
  confidence: "verified" | "inferred";
}

export interface SectionData {
  id: string;
  title: string;
  content: string;
  confidence: "verified" | "inferred";
}

export interface TabGroupData {
  id: string;
  label: string;
  sections: SectionData[];
}

export interface PitchDeckRenderOutput {
  type: "pitch_deck";
  slides: SlideData[];
  context: RenderContext;
}

export interface OnePagerRenderOutput {
  type: "one_pager";
  headline: string;
  sections: SectionData[];
  context: RenderContext;
}

export interface SalesDeckRenderOutput {
  type: "sales_deck";
  tabs: TabGroupData[];
  context: RenderContext;
}

export type RenderOutput =
  | PitchDeckRenderOutput
  | OnePagerRenderOutput
  | SalesDeckRenderOutput;

export type RendererFn<T extends RenderOutput = RenderOutput> = (
  sections: AssetSection[],
  context: RenderContext
) => T;

import type { AssetSection } from "@/lib/schemas/asset.schema";
import type { PitchDeckRenderOutput, RenderContext, SlideData } from "./types";

const SLIDE_TITLES: Record<string, string> = {
  title: "Cover",
  problem: "The Problem",
  cost_of_inaction: "Cost of Inaction",
  solution: "Our Solution",
  differentiation: "Why Us",
  proof: "Proof Points",
  positive_outcomes: "Positive Outcomes",
  call_to_action: "Next Steps",
};

export function renderPitchDeck(
  sections: AssetSection[],
  context: RenderContext
): PitchDeckRenderOutput {
  const slides: SlideData[] = sections.map((s, i) => ({
    slideNumber: i + 1,
    id: s.id,
    title: SLIDE_TITLES[s.id] ?? s.label,
    content: s.content,
    confidence: s.confidence,
  }));
  return { type: "pitch_deck", slides, context };
}

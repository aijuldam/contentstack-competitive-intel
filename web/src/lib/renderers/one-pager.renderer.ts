import type { AssetSection } from "@/lib/schemas/asset.schema";
import type { OnePagerRenderOutput, RenderContext, SectionData } from "./types";

const SECTION_TITLES: Record<string, string> = {
  headline: "Headline",
  who_its_for: "Who It's For",
  the_problem: "The Problem",
  how_it_works: "How It Works",
  why_us: "Why Us",
  results: "Results",
  next_step: "Next Step",
};

export function renderOnePager(
  sections: AssetSection[],
  context: RenderContext
): OnePagerRenderOutput {
  const headline =
    sections.find((s) => s.id === "headline")?.content ?? context.projectName;

  const bodySections: SectionData[] = sections
    .filter((s) => s.id !== "headline")
    .map((s) => ({
      id: s.id,
      title: SECTION_TITLES[s.id] ?? s.label,
      content: s.content,
      confidence: s.confidence,
    }));

  return { type: "one_pager", headline, sections: bodySections, context };
}

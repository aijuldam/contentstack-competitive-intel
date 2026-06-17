import type { AssetSection } from "@/lib/schemas/asset.schema";
import type {
  SalesDeckRenderOutput,
  RenderContext,
  TabGroupData,
  SectionData,
} from "./types";

const SECTION_TITLES: Record<string, string> = {
  buyer_profile: "Buyer Profile",
  common_pains: "Common Pains",
  discovery_questions: "Discovery Questions",
  solution_narrative: "Solution Narrative",
  competitive_differentiation: "Competitive Angles",
  proof_points: "Proof Points",
  objection_handling: "Objection Handling",
  decision_process_guide: "Decision Process",
  champion_enablement: "Champion Enablement",
};

const TAB_GROUPS: Array<{ id: string; label: string; sectionIds: string[] }> = [
  {
    id: "buyer",
    label: "Buyer Intelligence",
    sectionIds: ["buyer_profile", "common_pains"],
  },
  {
    id: "discovery",
    label: "Discovery",
    sectionIds: ["discovery_questions", "solution_narrative"],
  },
  {
    id: "win",
    label: "Win the Deal",
    sectionIds: ["competitive_differentiation", "proof_points", "objection_handling"],
  },
  {
    id: "close",
    label: "Close Process",
    sectionIds: ["decision_process_guide", "champion_enablement"],
  },
];

export function renderSalesDeck(
  sections: AssetSection[],
  context: RenderContext
): SalesDeckRenderOutput {
  const sectionMap = new Map(sections.map((s) => [s.id, s]));

  const tabs: TabGroupData[] = TAB_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    sections: group.sectionIds
      .map((sid): SectionData | null => {
        const s = sectionMap.get(sid);
        if (!s) return null;
        return {
          id: s.id,
          title: SECTION_TITLES[s.id] ?? s.label,
          content: s.content,
          confidence: s.confidence,
        };
      })
      .filter((s): s is SectionData => s !== null),
  })).filter((t) => t.sections.length > 0);

  return { type: "sales_deck", tabs, context };
}

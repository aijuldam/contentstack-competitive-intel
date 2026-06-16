export type AssetType = "pitch_deck" | "one_pager" | "sales_deck";
export type GenerationStatus = "pending" | "complete" | "error";

export interface AssetSection {
  id: string;
  label: string;
  content: string;
  source_blocks: string[];
  confidence: "verified" | "inferred";
  user_edited: boolean;
}

export interface Asset {
  id: string;
  project_id: string;
  narrative_id: string;
  asset_type: AssetType;
  sections: AssetSection[];
  generation_status: GenerationStatus;
  first_opened_at: string | null;
  created_at: string;
  updated_at: string;
}

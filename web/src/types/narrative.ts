export type Confidence = "verified" | "inferred";
export type BlockSource = "explicit" | "normalized" | "model_generated";

export interface NarrativeBlock {
  content: string;
  confidence: Confidence;
  source: BlockSource;
  user_edited: boolean;
}

export interface CanonicalNarrative {
  id: string;
  project_id: string;
  meddic: {
    metrics: NarrativeBlock;
    economic_buyer: NarrativeBlock;
    decision_criteria: NarrativeBlock;
    decision_process: NarrativeBlock;
    identify_pain: NarrativeBlock;
    champion: NarrativeBlock;
  };
  command_of_message: {
    current_state: NarrativeBlock;
    negative_consequences: NarrativeBlock;
    required_capabilities: NarrativeBlock;
    positive_outcomes: NarrativeBlock;
    proof_points: NarrativeBlock;
    differentiated_value: NarrativeBlock;
  };
  generation_status: "pending" | "complete" | "error";
  last_edited_at: string;
  created_at: string;
}

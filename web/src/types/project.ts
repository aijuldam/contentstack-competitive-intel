export type ProjectStatus = "draft" | "active" | "archived";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectIntake {
  id: string;
  project_id: string;
  raw_input: {
    product_description: string;
    buyer_and_user: string;
    problem_and_cost: string;
    differentiation_and_proof: string;
  };
  normalized_json: Record<string, unknown> | null;
  confidence_score: number | null;
  normalization_status: "pending" | "complete" | "error";
  created_at: string;
}

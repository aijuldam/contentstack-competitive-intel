// Hand-written DB types matching 001_init.sql.
// In production, replace with: supabase gen types typescript --project-id <id>

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────
export type WorkspaceRole       = "owner" | "admin" | "member";
export type ProjectStatus       = "draft" | "active" | "archived";
export type NormalizationStatus = "pending" | "complete" | "error";
export type GenerationStatus    = "pending" | "running" | "complete" | "error";
export type AssetType           = "pitch_deck" | "one_pager" | "sales_deck";
export type RunType             = "normalize" | "narrative" | "asset";
export type ExportFormat        = "pdf" | "markdown" | "pptx";
export type ExportStatus        = "pending" | "processing" | "complete" | "error";
export type ActivationEventType =
  | "project_created"
  | "narrative_generated"
  | "asset_opened";

// ─────────────────────────────────────────────────────────────────────────────
// Row types (SELECT results)
// ─────────────────────────────────────────────────────────────────────────────
export interface Workspace {
  id:         string;
  name:       string;
  slug:       string;
  owner_id:   string;
  plan:       string;
  metadata:   Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id:           string;
  workspace_id: string;
  user_id:      string;
  role:         WorkspaceRole;
  invited_by:   string | null;
  joined_at:    string;
}

export interface Project {
  id:           string;
  workspace_id: string;
  created_by:   string | null;
  name:         string;
  status:       ProjectStatus;
  created_at:   string;
  updated_at:   string;
}

export interface ProjectSource {
  id:                   string;
  project_id:           string;
  raw_input:            RawInput;
  normalized_json:      NormalizedJson | null;
  confidence_score:     number | null;
  normalization_status: NormalizationStatus;
  created_at:           string;
  updated_at:           string;
}

export interface BrandProfile {
  id:           string;
  workspace_id: string;
  name:         string;
  description:  string | null;
  voice_notes:  string | null;
  metadata:     Record<string, unknown>;
  created_at:   string;
  updated_at:   string;
}

export interface NarrativeVersion {
  id:                string;
  project_id:        string;
  version_number:    number;
  meddic_blocks:     MEDDICBlocks | null;
  cotm_blocks:       CotMBlocks | null;
  generation_status: GenerationStatus;
  is_current:        boolean;
  created_by:        string | null;
  created_at:        string;
}

export interface Asset {
  id:                string;
  project_id:        string;
  asset_type:        AssetType;
  generation_status: GenerationStatus;
  first_opened_at:   string | null;
  created_at:        string;
  updated_at:        string;
}

export interface AssetVersion {
  id:                    string;
  asset_id:              string;
  narrative_version_id:  string | null;
  version_number:        number;
  sections:              AssetSection[] | null;
  generation_status:     GenerationStatus;
  is_current:            boolean;
  created_by:            string | null;
  created_at:            string;
}

export interface GenerationRun {
  id:            string;
  project_id:    string;
  run_type:      RunType;
  status:        GenerationStatus;
  input_hash:    string | null;
  output_ref:    { table: string; id: string } | null;
  error_message: string | null;
  started_at:    string | null;
  completed_at:  string | null;
  created_at:    string;
}

export interface ExportJob {
  id:                 string;
  asset_version_id:   string;
  format:             ExportFormat;
  status:             ExportStatus;
  storage_path:       string | null;
  error_message:      string | null;
  created_at:         string;
  completed_at:       string | null;
}

export interface ActivationEvent {
  id:           string;
  user_id:      string;
  workspace_id: string;
  project_id:   string | null;
  event_type:   ActivationEventType;
  asset_type:   string | null;
  metadata:     Record<string, unknown>;
  created_at:   string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Insert types (omit server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────
export type WorkspaceInsert = Omit<Workspace, "id" | "created_at" | "updated_at">;
export type ProjectInsert   = Omit<Project,   "id" | "created_at" | "updated_at">;
export type ProjectSourceInsert = Omit<ProjectSource, "id" | "created_at" | "updated_at">;
export type NarrativeVersionInsert = Omit<NarrativeVersion, "id" | "created_at">;
export type AssetInsert = Omit<Asset, "id" | "created_at" | "updated_at">;
export type AssetVersionInsert = Omit<AssetVersion, "id" | "created_at">;
export type GenerationRunInsert = Omit<GenerationRun, "id" | "created_at">;

// ─────────────────────────────────────────────────────────────────────────────
// Nested JSON shapes stored in jsonb columns
// ─────────────────────────────────────────────────────────────────────────────
export interface RawInput {
  product_description:      string;
  buyer_and_user:           string;
  problem_and_cost:         string;
  differentiation_and_proof: string;
}

export interface NormalizedJson {
  explicit_inputs:          RawInput;
  parsed_facts:             Record<string, unknown>;
  inferred_interpretations: Record<string, unknown>;
  confidence_notes:         string[];
  missing_but_important:    string[];
}

export interface NarrativeBlock {
  content:     string;
  confidence:  "verified" | "inferred";
  source:      "explicit" | "normalized" | "model_generated";
  user_edited: boolean;
}

export interface MEDDICBlocks {
  metrics:          NarrativeBlock;
  economic_buyer:   NarrativeBlock;
  decision_criteria: NarrativeBlock;
  decision_process: NarrativeBlock;
  identify_pain:    NarrativeBlock;
  champion:         NarrativeBlock;
}

export interface CotMBlocks {
  current_state:         NarrativeBlock;
  negative_consequences: NarrativeBlock;
  required_capabilities: NarrativeBlock;
  positive_outcomes:     NarrativeBlock;
  proof_points:          NarrativeBlock;
  differentiated_value:  NarrativeBlock;
}

export interface AssetSection {
  id:            string;
  label:         string;
  content:       string;
  source_blocks: string[];
  confidence:    "verified" | "inferred";
  user_edited:   boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Database type map for Supabase client generics
// ─────────────────────────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      workspaces:          { Row: Workspace;          Insert: WorkspaceInsert;          Update: Partial<WorkspaceInsert> };
      workspace_members:   { Row: WorkspaceMember;    Insert: Omit<WorkspaceMember, "id" | "joined_at">; Update: Partial<WorkspaceMember> };
      projects:            { Row: Project;            Insert: ProjectInsert;            Update: Partial<ProjectInsert> };
      project_sources:     { Row: ProjectSource;      Insert: ProjectSourceInsert;      Update: Partial<ProjectSourceInsert> };
      brand_profiles:      { Row: BrandProfile;       Insert: Omit<BrandProfile, "id" | "created_at" | "updated_at">; Update: Partial<BrandProfile> };
      narrative_versions:  { Row: NarrativeVersion;   Insert: NarrativeVersionInsert;   Update: Partial<NarrativeVersionInsert> };
      assets:              { Row: Asset;               Insert: AssetInsert;              Update: Partial<AssetInsert> };
      asset_versions:      { Row: AssetVersion;        Insert: AssetVersionInsert;       Update: Partial<AssetVersionInsert> };
      generation_runs:     { Row: GenerationRun;       Insert: GenerationRunInsert;      Update: Partial<GenerationRunInsert> };
      export_jobs:         { Row: ExportJob;           Insert: Omit<ExportJob, "id" | "created_at">; Update: Partial<ExportJob> };
      activation_events:   { Row: ActivationEvent;     Insert: Omit<ActivationEvent, "id" | "created_at">; Update: never };
    };
    Enums: {
      workspace_role:       WorkspaceRole;
      project_status:       ProjectStatus;
      normalization_status: NormalizationStatus;
      generation_status:    GenerationStatus;
      asset_type:           AssetType;
      run_type:             RunType;
      export_format:        ExportFormat;
      export_status:        ExportStatus;
    };
  };
}

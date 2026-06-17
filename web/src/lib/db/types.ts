// Hand-written DB types matching 001_init.sql + 002_profiles.sql.
// In production, replace with: supabase gen types typescript --project-id <id>

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────
export type WorkspaceRole       = "owner" | "admin" | "member";
export type ProjectStatus       = "draft" | "active" | "archived";
export type NormalizationStatus = "pending" | "complete" | "error";
export type GenerationStatus    = "pending" | "running" | "complete" | "error";
export type AssetType           = "pitch_deck" | "one_pager" | "sales_deck";
export type RunType             =
  | "normalize"
  | "enrichment"
  | "gap_analysis"
  | "foundation"
  | "narrative"
  | "asset";
export type ExportFormat        = "html" | "pdf" | "markdown" | "pptx";
export type ExportStatus        = "pending" | "processing" | "complete" | "error";
export type ActivationEventType =
  | "project_created"
  | "narrative_generated"
  | "asset_opened";

// ─────────────────────────────────────────────────────────────────────────────
// Row types (SELECT results)
// ─────────────────────────────────────────────────────────────────────────────
export interface Profile {
  id:         string;
  first_name: string;
  last_name:  string;
  company:    string;
  created_at: string;
  updated_at: string;
}

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
  id:                  string;
  project_id:          string;
  version_number:      number;
  meddic_blocks:       MEDDICBlocks | null;
  cotm_blocks:         CotMBlocks | null;
  // Full Messaging Foundation document (superset of the legacy blocks above).
  foundation:          FoundationJson | null;
  prompt_version:      string | null;
  generation_metadata: GenerationMetadataJson | null;
  // Set when a user approves this version; assets may only derive from approved versions.
  approved_at:         string | null;
  approved_by:         string | null;
  generation_status:   GenerationStatus;
  is_current:          boolean;
  created_by:          string | null;
  created_at:          string;
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
  prompt_version:        string | null;
  generation_metadata:   GenerationMetadataJson | null;
  generation_status:     GenerationStatus;
  is_current:            boolean;
  created_by:            string | null;
  created_at:            string;
}

export interface GenerationRun {
  id:             string;
  project_id:     string;
  run_type:       RunType;
  status:         GenerationStatus;
  input_hash:     string | null;
  output_ref:     { table: string; id: string } | null;
  prompt_version: string | null;
  attempts:       number;
  debug:          Record<string, unknown> | null;
  error_message:  string | null;
  started_at:     string | null;
  completed_at:   string | null;
  created_at:     string;
}

export interface ExportJob {
  id:                 string;
  project_id:         string | null;  // added in migration 004
  asset_id:           string | null;  // added in migration 004
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
// Insert types — nullable and DB-defaulted fields are optional
// ─────────────────────────────────────────────────────────────────────────────
export interface ProfileInsert {
  id:         string;
  first_name: string;
  last_name:  string;
  company:    string;
}

export interface WorkspaceInsert {
  name:      string;
  slug:      string;
  owner_id:  string;
  plan:      string;
  metadata?: Record<string, unknown>;
}

export interface ProjectInsert {
  workspace_id: string;
  name:         string;
  status:       ProjectStatus;
  created_by?:  string | null;
}

export interface ProjectSourceInsert {
  project_id:           string;
  raw_input:            RawInput;
  normalized_json?:     NormalizedJson | null;
  confidence_score?:    number | null;
  normalization_status: NormalizationStatus;
}

export interface NarrativeVersionInsert {
  project_id:           string;
  version_number:       number;
  meddic_blocks?:       MEDDICBlocks | null;
  cotm_blocks?:         CotMBlocks | null;
  foundation?:          FoundationJson | null;
  prompt_version?:      string | null;
  generation_metadata?: GenerationMetadataJson | null;
  approved_at?:         string | null;
  approved_by?:         string | null;
  generation_status:    GenerationStatus;
  is_current:           boolean;
  created_by?:          string | null;
}

export interface AssetInsert {
  project_id:        string;
  asset_type:        AssetType;
  generation_status: GenerationStatus;
  first_opened_at?:  string | null;
}

export interface AssetVersionInsert {
  asset_id:              string;
  narrative_version_id?: string | null;
  version_number:        number;
  sections?:             AssetSection[] | null;
  prompt_version?:       string | null;
  generation_metadata?:  GenerationMetadataJson | null;
  generation_status:     GenerationStatus;
  is_current:            boolean;
  created_by?:           string | null;
}

export interface GenerationRunInsert {
  project_id:      string;
  run_type:        RunType;
  status:          GenerationStatus;
  input_hash?:     string | null;
  output_ref?:     { table: string; id: string } | null;
  prompt_version?: string | null;
  attempts?:       number;
  debug?:          Record<string, unknown> | null;
  error_message?:  string | null;
  started_at?:     string | null;
  completed_at?:   string | null;
}

export interface WorkspaceMemberInsert {
  workspace_id: string;
  user_id:      string;
  role:         WorkspaceRole;
  invited_by?:  string | null;
}

export interface ActivationEventInsert {
  user_id:      string;
  workspace_id: string;
  project_id?:  string | null;
  event_type:   ActivationEventType;
  asset_type?:  string | null;
  metadata?:    Record<string, unknown>;
}

export interface ExportJobInsert {
  project_id?:      string | null;
  asset_id?:        string | null;
  asset_version_id: string;
  format:           ExportFormat;
  status:           ExportStatus;
  storage_path?:    string | null;
  error_message?:   string | null;
  completed_at?:    string | null;
}

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
  provenance?:   "user_provided" | "inferred" | "unknown";
  confidence:    "verified" | "inferred";
  needs_validation?: boolean;
  user_edited:   boolean;
}

// The full Messaging Foundation document, stored as jsonb. Kept structurally
// opaque here so the db layer stays decoupled from the zod schema; the service
// layer validates and casts it to MessagingFoundation on read/write.
export type FoundationJson = Record<string, unknown>;

// Generation metadata (prompt ref, model, attempts, usage), stored as jsonb.
export type GenerationMetadataJson = Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Makes Row/Insert/Update satisfy GenericTable's Record<string, unknown> constraint.
// supabase-js v2.108+ conditional type check requires an explicit index signature.
type WithIndex<T> = T & Record<string, unknown>;
type TD<R, I, U = I> = {
  Row:          WithIndex<R>;
  Insert:       WithIndex<I>;
  Update:       WithIndex<U>;
  Relationships: never[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Database type map for Supabase client generics
// ─────────────────────────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles:            TD<Profile,             ProfileInsert,            Partial<ProfileInsert>>;
      workspaces:          TD<Workspace,          WorkspaceInsert,          Partial<WorkspaceInsert>>;
      workspace_members:   TD<WorkspaceMember,    WorkspaceMemberInsert,     Partial<WorkspaceMemberInsert>>;
      projects:            TD<Project,            ProjectInsert,             Partial<ProjectInsert>>;
      project_sources:     TD<ProjectSource,      ProjectSourceInsert,      Partial<ProjectSourceInsert>>;
      brand_profiles:      TD<BrandProfile,       Omit<BrandProfile, "id" | "created_at" | "updated_at">, Partial<BrandProfile>>;
      narrative_versions:  TD<NarrativeVersion,   NarrativeVersionInsert,   Partial<NarrativeVersionInsert>>;
      assets:              TD<Asset,              AssetInsert,              Partial<AssetInsert>>;
      asset_versions:      TD<AssetVersion,       AssetVersionInsert,       Partial<AssetVersionInsert>>;
      generation_runs:     TD<GenerationRun,      GenerationRunInsert,      Partial<GenerationRunInsert>>;
      export_jobs:         TD<ExportJob,          ExportJobInsert,          Partial<ExportJobInsert>>;
      activation_events:   TD<ActivationEvent,    ActivationEventInsert,    never>;
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
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

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Project, ProjectInsert, ProjectStatus } from "../types";

type Client = SupabaseClient<Database>;

// Returns all projects in a workspace, newest first.
export async function getProjectsByWorkspace(
  client: Client,
  workspaceId: string
): Promise<Project[]> {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Returns a single project by ID (RLS ensures membership).
export async function getProjectById(
  client: Client,
  projectId: string
): Promise<Project | null> {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Creates a new project in the given workspace.
export async function createProject(
  client: Client,
  input: Omit<ProjectInsert, "status">
): Promise<Project> {
  const { data, error } = await client
    .from("projects")
    .insert({ ...input, status: "draft" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Updates project name.
export async function updateProjectName(
  client: Client,
  projectId: string,
  name: string
): Promise<void> {
  const { error } = await client
    .from("projects")
    .update({ name })
    .eq("id", projectId);

  if (error) throw error;
}

// Updates project status (draft → active → archived).
export async function updateProjectStatus(
  client: Client,
  projectId: string,
  status: ProjectStatus
): Promise<void> {
  const { error } = await client
    .from("projects")
    .update({ status })
    .eq("id", projectId);

  if (error) throw error;
}

// Returns a project with its current narrative version and asset statuses.
export async function getProjectWithNarrativeAndAssets(
  client: Client,
  projectId: string
) {
  const [projectResult, narrativeResult, assetsResult] = await Promise.all([
    client.from("projects").select("*").eq("id", projectId).maybeSingle(),
    client
      .from("narrative_versions")
      .select("*")
      .eq("project_id", projectId)
      .eq("is_current", true)
      .maybeSingle(),
    client
      .from("assets")
      .select("*, asset_versions(id, version_number, is_current, generation_status)")
      .eq("project_id", projectId),
  ]);

  if (projectResult.error) throw projectResult.error;
  if (narrativeResult.error) throw narrativeResult.error;
  if (assetsResult.error) throw assetsResult.error;

  return {
    project:   projectResult.data,
    narrative: narrativeResult.data,
    assets:    assetsResult.data ?? [],
  };
}

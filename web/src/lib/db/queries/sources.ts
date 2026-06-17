import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ProjectSource, ProjectSourceInsert } from "../types";

type Client = SupabaseClient<Database>;

export async function getLatestProjectSource(
  client: Client,
  projectId: string
): Promise<ProjectSource | null> {
  const { data, error } = await client
    .from("project_sources")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProjectSource(
  client: Client,
  input: ProjectSourceInsert
): Promise<ProjectSource> {
  const { data, error } = await client
    .from("project_sources")
    .insert(input as ProjectSourceInsert & Record<string, unknown>)
    .select()
    .single();
  if (error) throw error;
  return data;
}

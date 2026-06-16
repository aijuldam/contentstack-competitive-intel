import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Workspace, WorkspaceMember } from "../types";

type Client = SupabaseClient<Database>;

// Returns all workspaces the authenticated user is a member of.
export async function getUserWorkspaces(client: Client): Promise<Workspace[]> {
  const { data, error } = await client
    .from("workspace_members")
    .select("workspace:workspaces(*)")
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => row.workspace as unknown as Workspace);
}

// Returns the first (oldest) workspace for the user — used as the default.
export async function getDefaultWorkspace(
  client: Client
): Promise<Workspace | null> {
  const workspaces = await getUserWorkspaces(client);
  return workspaces[0] ?? null;
}

// Returns workspace by ID if the caller is a member.
export async function getWorkspaceById(
  client: Client,
  workspaceId: string
): Promise<Workspace | null> {
  const { data, error } = await client
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Returns all members of a workspace.
export async function getWorkspaceMembers(
  client: Client,
  workspaceId: string
): Promise<WorkspaceMember[]> {
  const { data, error } = await client
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Creates workspace + owner membership atomically.
// Must be called with the service-role client to bypass RLS on first insert.
export async function createWorkspaceWithOwner(
  client: Client,
  {
    name,
    slug,
    ownerId,
  }: { name: string; slug: string; ownerId: string }
): Promise<Workspace> {
  const { data: workspace, error: wsError } = await client
    .from("workspaces")
    .insert({ name, slug, owner_id: ownerId, plan: "free" })
    .select()
    .single();

  if (wsError) throw wsError;

  const { error: memberError } = await client
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: ownerId,
      role: "owner",
    });

  if (memberError) throw memberError;

  return workspace;
}

// Generates a unique slug from a display name.
// Appends a short random suffix only if the base slug is taken.
export async function generateUniqueSlug(
  client: Client,
  name: string
): Promise<string> {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const { data } = await client
    .from("workspaces")
    .select("slug")
    .eq("slug", base)
    .maybeSingle();

  if (!data) return base;

  // Collision — append a 4-char random suffix
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

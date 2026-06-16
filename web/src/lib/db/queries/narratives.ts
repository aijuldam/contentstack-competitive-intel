import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  NarrativeVersion,
  NarrativeVersionInsert,
  MEDDICBlocks,
  CotMBlocks,
} from "../types";

type Client = SupabaseClient<Database>;

// Returns the current narrative version for a project, or null.
export async function getCurrentNarrative(
  client: Client,
  projectId: string
): Promise<NarrativeVersion | null> {
  const { data, error } = await client
    .from("narrative_versions")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_current", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Returns all narrative versions for a project, newest first.
export async function getNarrativeHistory(
  client: Client,
  projectId: string
): Promise<NarrativeVersion[]> {
  const { data, error } = await client
    .from("narrative_versions")
    .select("*")
    .eq("project_id", projectId)
    .order("version_number", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Creates a new narrative version and demotes the previous current version.
// Returns the newly created version.
export async function createNarrativeVersion(
  client: Client,
  projectId: string,
  {
    meddic_blocks,
    cotm_blocks,
    created_by,
  }: {
    meddic_blocks?: MEDDICBlocks;
    cotm_blocks?: CotMBlocks;
    created_by?: string;
  }
): Promise<NarrativeVersion> {
  // Get current max version number
  const { data: existing } = await client
    .from("narrative_versions")
    .select("version_number")
    .eq("project_id", projectId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (existing?.version_number ?? 0) + 1;

  // Demote the previous current version
  await client
    .from("narrative_versions")
    .update({ is_current: false })
    .eq("project_id", projectId)
    .eq("is_current", true);

  // Insert the new current version
  const insert: NarrativeVersionInsert = {
    project_id:        projectId,
    version_number:    nextVersion,
    meddic_blocks:     meddic_blocks ?? null,
    cotm_blocks:       cotm_blocks ?? null,
    generation_status: "pending",
    is_current:        true,
    created_by:        created_by ?? null,
  };

  const { data, error } = await client
    .from("narrative_versions")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Patches a narrative block (after inline edit). Creates a new version.
export async function saveNarrativeEdit(
  client: Client,
  projectId: string,
  updates: { meddic_blocks?: MEDDICBlocks; cotm_blocks?: CotMBlocks },
  userId: string
): Promise<NarrativeVersion> {
  const current = await getCurrentNarrative(client, projectId);
  if (!current) throw new Error("No current narrative to edit");

  return createNarrativeVersion(client, projectId, {
    meddic_blocks: updates.meddic_blocks ?? (current.meddic_blocks ?? undefined),
    cotm_blocks:   updates.cotm_blocks   ?? (current.cotm_blocks   ?? undefined),
    created_by:    userId,
  });
}

// Marks a narrative version's generation_status as complete.
export async function markNarrativeComplete(
  client: Client,
  narrativeId: string,
  blocks: { meddic_blocks: MEDDICBlocks; cotm_blocks: CotMBlocks }
): Promise<void> {
  const { error } = await client
    .from("narrative_versions")
    .update({
      generation_status: "complete",
      meddic_blocks: blocks.meddic_blocks,
      cotm_blocks:   blocks.cotm_blocks,
    })
    .eq("id", narrativeId);

  if (error) throw error;
}

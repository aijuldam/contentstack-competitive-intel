import { createClient } from "@/lib/db/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Workspace } from "@/lib/db/types";
import { getDefaultWorkspace } from "@/lib/db/queries/workspaces";

// Returns the authenticated user or null. Does not redirect.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Returns the authenticated user. Redirects to /login if not authenticated.
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Returns the user's default workspace, or null if they have none.
export async function getUserWorkspace(): Promise<Workspace | null> {
  const supabase = createClient();
  return getDefaultWorkspace(supabase);
}

// Returns the user + their workspace.
// Redirects to /app/onboarding if the user has no workspace yet.
// Do NOT call this from the onboarding page itself (creates a loop).
export async function requireAuthAndWorkspace(): Promise<{
  user: User;
  workspace: Workspace;
}> {
  const user = await requireAuth();

  const supabase = createClient();
  const workspace = await getDefaultWorkspace(supabase);

  if (!workspace) {
    redirect("/onboarding");
  }

  return { user, workspace };
}

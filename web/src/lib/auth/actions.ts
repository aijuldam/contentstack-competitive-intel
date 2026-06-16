"use server";

import { createClient, createServiceClient } from "@/lib/db/server";
import {
  createWorkspaceWithOwner,
  generateUniqueSlug,
} from "@/lib/db/queries/workspaces";
import { redirect } from "next/navigation";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Input schemas
// ─────────────────────────────────────────────────────────────────────────────
const SignUpSchema = z.object({
  name:     z.string().min(1, "Name is required").max(100),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignInSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const WorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(80),
});

// ─────────────────────────────────────────────────────────────────────────────
// Auth state shape returned by useFormState
// ─────────────────────────────────────────────────────────────────────────────
export interface AuthState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// ─────────────────────────────────────────────────────────────────────────────
// signUp
// ─────────────────────────────────────────────────────────────────────────────
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    name:     formData.get("name"),
    email:    formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If Supabase email confirmation is OFF, the user is immediately signed in.
  // Redirect to onboarding to create their first workspace.
  redirect("/onboarding");
}

// ─────────────────────────────────────────────────────────────────────────────
// signIn
// ─────────────────────────────────────────────────────────────────────────────
export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email:    formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = SignInSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/app/projects");
}

// ─────────────────────────────────────────────────────────────────────────────
// signOut
// ─────────────────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ─────────────────────────────────────────────────────────────────────────────
// createWorkspace  (called from onboarding)
// Uses the service-role client to bypass RLS — the user has no membership yet,
// so the regular client can't INSERT into workspaces.
// ─────────────────────────────────────────────────────────────────────────────
export async function createWorkspace(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = { name: formData.get("name") };

  const parsed = WorkspaceSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Verify the session via the regular (anon) client first
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Use service client for the actual inserts (bypasses RLS)
  const service = await createServiceClient();
  const slug = await generateUniqueSlug(service, parsed.data.name);

  try {
    await createWorkspaceWithOwner(service, {
      name:    parsed.data.name,
      slug,
      ownerId: user.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create workspace.";
    return { error: message };
  }

  redirect("/app/projects");
}

// ─────────────────────────────────────────────────────────────────────────────
// signInWithGoogle  (OAuth — redirects, no FormData)
// ─────────────────────────────────────────────────────────────────────────────
export async function signInWithGoogle(): Promise<never> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  });

  if (error) throw error;
  redirect(data.url);
}

"use server";

import { createClient, createServiceClient } from "@/lib/db/server";
import { createWorkspaceWithOwner, generateUniqueSlug } from "@/lib/db/queries/workspaces";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isWorkEmail } from "@/lib/utils/email";

// ─────────────────────────────────────────────────────────────────────────────
// Shared validators
// ─────────────────────────────────────────────────────────────────────────────
const workEmailField = z
  .string()
  .email("Invalid email address")
  .refine(isWorkEmail, "Please use your work email address.");

// ─────────────────────────────────────────────────────────────────────────────
// Input schemas
// ─────────────────────────────────────────────────────────────────────────────
const SignUpSchema = z
  .object({
    first_name:       z.string().min(1, "First name is required").max(50),
    last_name:        z.string().min(1, "Last name is required").max(50),
    email:            workEmailField,
    company_name:     z.string().min(1, "Company name is required").max(100),
    password:         z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

const SignInSchema = z.object({
  email:    workEmailField,
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
  success?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// signUp
// Creates the auth user, profile, and workspace in one shot so the user lands
// directly in the app without a separate onboarding step.
// ─────────────────────────────────────────────────────────────────────────────
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    first_name:       formData.get("first_name"),
    last_name:        formData.get("last_name"),
    email:            formData.get("email"),
    company_name:     formData.get("company_name"),
    password:         formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { first_name, last_name, email, company_name, password } = parsed.data;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        company:   company_name,
        full_name: `${first_name} ${last_name}`,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/app/projects`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  const user = authData.user;
  if (!user) {
    return { error: "Signup failed. Please try again." };
  }

  // Use service-role client for profile + workspace — user has no RLS access yet.
  const service = await createServiceClient();

  try {
    const { error: profileError } = await service
      .from("profiles")
      .insert({ id: user.id, first_name, last_name, company: company_name });
    if (profileError) throw profileError;

    const slug = await generateUniqueSlug(service, company_name);
    await createWorkspaceWithOwner(service, {
      name:    company_name,
      slug,
      ownerId: user.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Account created but setup failed. Please contact support.";
    return { error: message };
  }

  // Email confirmation is required — no session yet.
  if (!authData.session) {
    return {
      success: `We sent a confirmation link to ${email}. Check your inbox and click the link to activate your account.`,
    };
  }

  redirect("/app/projects");
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
// createWorkspace — fallback for users without a workspace (edge cases)
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

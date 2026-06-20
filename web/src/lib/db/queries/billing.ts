import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, WorkspaceBilling, WorkspaceBillingInsert, SubscriptionStatus } from "../types";

type Client = SupabaseClient<Database>;

export async function getWorkspaceBilling(
  client: Client,
  workspaceId: string
): Promise<WorkspaceBilling | null> {
  const { data, error } = await client
    .from("workspace_billing")
    .select("*")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) throw error;
  return data as WorkspaceBilling | null;
}

export async function upsertWorkspaceBilling(
  client: Client,
  input: {
    workspace_id: string;
    plan_key: string;
    stripe_customer_id: string;
    stripe_subscription_id: string;
    subscription_status: string;
    current_period_end: string;
  }
): Promise<void> {
  const row: WorkspaceBillingInsert & Record<string, unknown> = {
    workspace_id: input.workspace_id,
    plan_key: input.plan_key,
    stripe_customer_id: input.stripe_customer_id,
    stripe_subscription_id: input.stripe_subscription_id,
    subscription_status: input.subscription_status as SubscriptionStatus,
    current_period_end: input.current_period_end,
  };
  const { error } = await client
    .from("workspace_billing")
    .upsert(row, { onConflict: "workspace_id" });

  if (error) throw error;
}

export async function updateWorkspacePlan(
  client: Client,
  workspaceId: string,
  plan: "free" | "paid_monthly"
): Promise<void> {
  const { error } = await client
    .from("workspaces")
    .update({ plan, updated_at: new Date().toISOString() })
    .eq("id", workspaceId);

  if (error) throw error;
}

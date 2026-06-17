-- Migration 005: workspace billing table
-- Stores Stripe subscription metadata per workspace.
-- workspace.plan remains the runtime access control field (updated by webhook).
-- This table is the durable billing record, not the gating source.

CREATE TABLE IF NOT EXISTS workspace_billing (
  id                     uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id           uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_key               text NOT NULL DEFAULT 'free',
  stripe_customer_id     text,
  stripe_subscription_id text,
  subscription_status    text NOT NULL DEFAULT 'inactive',
  -- 'inactive' | 'active' | 'past_due' | 'canceled'
  current_period_end     timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- One billing record per workspace.
CREATE UNIQUE INDEX IF NOT EXISTS workspace_billing_workspace_id_idx
  ON workspace_billing(workspace_id);

-- Stripe lookup (used by webhook handler to identify the workspace).
CREATE INDEX IF NOT EXISTS workspace_billing_stripe_customer_id_idx
  ON workspace_billing(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- RLS: workspace members can read their own billing record; only service role writes.
ALTER TABLE workspace_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members can read own billing"
  ON workspace_billing FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Seed: create a free billing record for every existing workspace that lacks one.
INSERT INTO workspace_billing (workspace_id, plan_key, subscription_status)
SELECT id, 'free', 'inactive'
FROM workspaces
WHERE id NOT IN (SELECT workspace_id FROM workspace_billing)
ON CONFLICT DO NOTHING;

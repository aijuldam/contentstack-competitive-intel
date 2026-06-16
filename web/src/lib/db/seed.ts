// Seed helpers for local development and testing.
// Run with: npx ts-node -e "require('./src/lib/db/seed').seedDemoProject()"
// or call from a one-off API route.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { createWorkspaceWithOwner, generateUniqueSlug } from "./queries/workspaces";
import { createProject } from "./queries/projects";
import { createNarrativeVersion, markNarrativeComplete } from "./queries/narratives";
import type { MEDDICBlocks, CotMBlocks } from "./types";

type Client = SupabaseClient<Database>;

const DEMO_MEDDIC: MEDDICBlocks = {
  metrics: {
    content: "RevOps teams save 4–6 hours per week on manual reconciliation. Target 80% reduction in CRM error rate.",
    confidence: "inferred",
    source: "normalized",
    user_edited: false,
  },
  economic_buyer: {
    content: "VP of Revenue Operations at Series B–D SaaS companies ($10M–$100M ARR). Budget authority over ops tooling.",
    confidence: "inferred",
    source: "model_generated",
    user_edited: false,
  },
  decision_criteria: {
    content: "Not yet specified. Add what the buyer evaluates vendors on (e.g., ease of integration, time-to-value, no data warehouse requirement).",
    confidence: "inferred",
    source: "model_generated",
    user_edited: false,
  },
  decision_process: {
    content: "Not yet specified. Add typical procurement timeline and stakeholders.",
    confidence: "inferred",
    source: "model_generated",
    user_edited: false,
  },
  identify_pain: {
    content: "RevOps teams spend 4–6 hours every week manually reconciling data across CRM, billing, and support tools. Errors compound and affect forecast accuracy.",
    confidence: "verified",
    source: "explicit",
    user_edited: false,
  },
  champion: {
    content: "Likely a RevOps Analyst or Senior RevOps Manager who owns the reconciliation workflow and will sponsor the purchase internally.",
    confidence: "inferred",
    source: "model_generated",
    user_edited: false,
  },
};

const DEMO_COTM: CotMBlocks = {
  current_state: {
    content: "RevOps teams export data manually from three systems every Monday morning. Errors are caught days later, if at all.",
    confidence: "verified",
    source: "explicit",
    user_edited: false,
  },
  negative_consequences: {
    content: "Forecast errors persist into QBRs. Deals slip because CRM gaps go unnoticed. Analysts spend capacity on data hygiene instead of strategic work.",
    confidence: "verified",
    source: "explicit",
    user_edited: false,
  },
  required_capabilities: {
    content: "Bidirectional sync across CRM, billing, and support. No data warehouse required. Real-time or near-real-time updates.",
    confidence: "verified",
    source: "explicit",
    user_edited: false,
  },
  positive_outcomes: {
    content: "80% reduction in reconciliation time. Improved forecast accuracy. Analysts shift from data hygiene to strategic analysis.",
    confidence: "inferred",
    source: "normalized",
    user_edited: false,
  },
  proof_points: {
    content: "One customer reduced CRM error rate from ~12% to under 1% in 30 days. Attribution unverified — confirm with customer success before using in a deck.",
    confidence: "inferred",
    source: "normalized",
    user_edited: false,
  },
  differentiated_value: {
    content: "The only tool that syncs bidirectionally without requiring a data warehouse. Competitors require ETL setup or a separate data integration layer.",
    confidence: "inferred",
    source: "model_generated",
    user_edited: false,
  },
};

// Creates a full demo workspace + project + narrative for a given user.
export async function seedDemoProject(
  client: Client,
  userId: string
): Promise<{ workspaceId: string; projectId: string; narrativeId: string }> {
  const slug = await generateUniqueSlug(client, "Acme RevOps Demo");

  const workspace = await createWorkspaceWithOwner(client, {
    name: "Acme RevOps Demo",
    slug,
    ownerId: userId,
  });

  const project = await createProject(client, {
    workspace_id: workspace.id,
    created_by: userId,
    name: "Acme RevOps Platform",
  });

  // Seed project_sources (intake)
  await client.from("project_sources").insert({
    project_id: project.id,
    raw_input: {
      product_description:
        "We help RevOps teams at mid-market SaaS sync CRM, billing, and support data automatically.",
      buyer_and_user:
        "Buyer: VP RevOps at Series B–D SaaS. Users: RevOps analysts and CRO admin teams.",
      problem_and_cost:
        "Manual exports every Monday. Forecast errors. Deals slip because CRM gaps aren't caught in time.",
      differentiation_and_proof:
        "Only tool that syncs bidirectionally without a data warehouse. 80% reconciliation time reduction.",
    },
    normalization_status: "complete",
    confidence_score: 72,
  });

  const narrative = await createNarrativeVersion(client, project.id, {
    created_by: userId,
  });

  await markNarrativeComplete(client, narrative.id, {
    meddic_blocks: DEMO_MEDDIC,
    cotm_blocks: DEMO_COTM,
  });

  // Seed one asset (pitch_deck)
  const { data: asset } = await client
    .from("assets")
    .insert({
      project_id: project.id,
      asset_type: "pitch_deck",
      generation_status: "pending",
    })
    .select()
    .single();

  if (asset) {
    await client.from("activation_events").insert([
      { user_id: userId, workspace_id: workspace.id, project_id: project.id, event_type: "project_created" },
      { user_id: userId, workspace_id: workspace.id, project_id: project.id, event_type: "narrative_generated" },
    ]);
  }

  return { workspaceId: workspace.id, projectId: project.id, narrativeId: narrative.id };
}

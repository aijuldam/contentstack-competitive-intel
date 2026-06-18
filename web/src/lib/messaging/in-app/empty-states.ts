// ─────────────────────────────────────────────────────────────────────────────
// Empty-state copy
//
// One entry per meaningful empty state in the app. Each includes a next action
// that guides the user toward the activation milestone.
// ─────────────────────────────────────────────────────────────────────────────

import type { InAppPrompt } from "../types";

export type EmptyStateContext =
  | "projects_list_paid"
  | "projects_list_free"
  | "inputs_no_source"
  | "narrative_no_foundation"
  | "assets_no_foundation"
  | "assets_foundation_not_approved"
  | "exports_no_exports"
  | "versions_no_versions";

export const EMPTY_STATE_COPY: Record<EmptyStateContext, InAppPrompt> = {
  projects_list_paid: {
    id: "empty_projects_paid",
    title: "No projects yet",
    body: "Create your first project to generate a canonical narrative and all your GTM assets. Takes about 10 minutes from blank to first draft.",
    cta: { label: "Create your first project", href: "/app/projects/new" },
  },

  projects_list_free: {
    id: "empty_projects_free",
    title: "Explore the frameworks first",
    body: "The free plan includes the MEDDIC guide, Command of the Message framework, messaging templates, and example outputs. To create projects and generate your own assets, upgrade to the full plan.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },

  inputs_no_source: {
    id: "empty_inputs",
    title: "No intake yet",
    body: "Describe your product in four fields — what it does, who buys it, what it costs buyers to do nothing, and what makes you different. Plain language. No structured format needed.",
    cta: { label: "Fill in your intake", href: "#intake-form" },
  },

  narrative_no_foundation: {
    id: "empty_narrative",
    title: "No Messaging Foundation yet",
    body: "Generate a Messaging Foundation from your intake to see the structured MEDDIC and Command of the Message narrative here. Go to Inputs to start.",
    cta: { label: "Go to Inputs", href: "../inputs" },
  },

  assets_no_foundation: {
    id: "empty_assets_no_foundation",
    title: "Generate your Messaging Foundation first",
    body: "All assets — pitch deck, one-pager, and sales enablement deck — derive from an approved Messaging Foundation. Fill in your intake and generate the foundation to unlock asset generation.",
    cta: { label: "Go to Inputs", href: "../inputs" },
  },

  assets_foundation_not_approved: {
    id: "empty_assets_not_approved",
    title: "Approve your Messaging Foundation to unlock assets",
    body: "Your Messaging Foundation is ready for review. Once you approve it, you can generate your pitch deck, one-pager, and sales enablement deck.",
    cta: { label: "Review foundation", href: "../narrative" },
  },

  exports_no_exports: {
    id: "empty_exports",
    title: "No exports yet",
    body: "Export any asset as HTML once your assets are generated. PDF and PPTX exports are coming soon.",
    cta: { label: "Go to Assets", href: "../assets" },
  },

  versions_no_versions: {
    id: "empty_versions",
    title: "Version history is coming in Phase 2",
    body: "Once live, you'll be able to track changes across Messaging Foundation versions and regenerate assets from any approved version.",
    cta: undefined,
  },
};

export function getEmptyStateCopy(context: EmptyStateContext): InAppPrompt {
  return EMPTY_STATE_COPY[context];
}

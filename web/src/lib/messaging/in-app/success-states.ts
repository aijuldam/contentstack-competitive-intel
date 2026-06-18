// ─────────────────────────────────────────────────────────────────────────────
// Success-state and next-best-action copy
//
// Shown after the user completes a key workflow step.
// Each surfaces the logical next action — never a dead end.
// ─────────────────────────────────────────────────────────────────────────────

import type { InAppPrompt } from "../types";

export type SuccessContext =
  | "onboarding_completed"
  | "project_created"
  | "foundation_generated"
  | "foundation_approved"
  | "asset_opened_first"
  | "asset_exported";

export const SUCCESS_COPY: Record<SuccessContext, InAppPrompt> = {
  onboarding_completed: {
    id: "success_onboarding",
    title: "Workspace created",
    body: "You're in. Create your first project to start turning your product positioning into GTM assets.",
    cta: { label: "Create your first project", href: "/app/projects/new" },
  },

  project_created: {
    id: "success_project_created",
    title: "Project created",
    body: "Your intake is saved. The next step is generating your Messaging Foundation — a structured MEDDIC and Command of the Message narrative grounded in what you wrote.",
    cta: { label: "Generate Messaging Foundation", href: "#" },
  },

  foundation_generated: {
    id: "success_foundation_generated",
    title: "Messaging Foundation generated",
    body: "Review each section. Verified claims came from your intake. Inferred claims were derived by the model — confirm or rewrite them before approving.",
    cta: { label: "Review and approve", href: "#narrative" },
  },

  foundation_approved: {
    id: "success_foundation_approved",
    title: "Foundation approved",
    body: "Your Messaging Foundation is locked as the source of truth. Open any asset to see what was generated from it.",
    cta: { label: "Open your assets", href: "../assets" },
  },

  asset_opened_first: {
    id: "success_first_asset",
    title: "Your first asset is ready",
    body: "Edit any section inline. When you're happy with the content, export it as HTML or share it directly.",
    cta: { label: "Export as HTML", href: "#export" },
  },

  asset_exported: {
    id: "success_asset_exported",
    title: "Export complete",
    body: "Your asset is downloaded. If you update your Messaging Foundation, you can regenerate this asset from the new approved version.",
    cta: undefined,
  },
};

export function getSuccessCopy(context: SuccessContext): InAppPrompt {
  return SUCCESS_COPY[context];
}

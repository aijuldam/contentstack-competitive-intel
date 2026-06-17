// ─────────────────────────────────────────────────────────────────────────────
// Entitlement helpers
//
// Centralised gating logic. Use these in both server components/actions and
// client components. Never duplicate entitlement checks in call sites.
// Stripe is not called at runtime — checks are derived from workspace.plan.
// ─────────────────────────────────────────────────────────────────────────────

import type { PlanKey, EntitlementFlags } from "./plans";
import { getPlanForWorkspace } from "./plans";

type WorkspaceRef = { plan: string };

export function getPlanKey(workspace: WorkspaceRef): PlanKey {
  return getPlanForWorkspace(workspace).key;
}

export function hasPlan(workspace: WorkspaceRef, planKey: PlanKey): boolean {
  return getPlanKey(workspace) === planKey;
}

export function getEntitlements(workspace: WorkspaceRef): EntitlementFlags {
  return getPlanForWorkspace(workspace).entitlements;
}

export function canAccessFreeResources(workspace: WorkspaceRef): boolean {
  return getEntitlements(workspace).canAccessFreeResources;
}

export function canCreateProject(workspace: WorkspaceRef): boolean {
  return getEntitlements(workspace).canCreateProject;
}

export function canGenerateMessagingFoundation(workspace: WorkspaceRef): boolean {
  return getEntitlements(workspace).canGenerateMessagingFoundation;
}

export function canGenerateAssets(workspace: WorkspaceRef): boolean {
  return getEntitlements(workspace).canGenerateAssets;
}

export function canAccessPaidWorkspace(workspace: WorkspaceRef): boolean {
  return getEntitlements(workspace).canCreateProject;
}

export function canAccessVersionedWorkspace(workspace: WorkspaceRef): boolean {
  return getEntitlements(workspace).canAccessVersionedWorkspace;
}

export function canExportFormat(
  workspace: WorkspaceRef,
  format: "html" | "markdown" | "pdf" | "pptx"
): boolean {
  const e = getEntitlements(workspace);
  if (format === "html" || format === "markdown") return e.canExportHtml;
  if (format === "pdf") return e.canExportPdf;
  if (format === "pptx") return e.canExportPptx;
  return false;
}

export function getMaxProjects(workspace: WorkspaceRef): number | null {
  return getEntitlements(workspace).maxProjects;
}

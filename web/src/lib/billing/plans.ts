// ─────────────────────────────────────────────────────────────────────────────
// Plan configuration
//
// Single source of truth for plan keys, entitlements, pricing copy, and CTAs.
// Used in UI (pricing page, billing page, upgrade prompts) and server-side
// gating (server actions, API routes). Stripe is NOT the runtime source of
// access control — this config is.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanKey = "free" | "paid_monthly";

export interface EntitlementFlags {
  canAccessFreeResources: boolean;
  canCreateProject: boolean;
  canGenerateMessagingFoundation: boolean;
  canGenerateAssets: boolean;
  canAccessVersionedWorkspace: boolean;
  canExportHtml: boolean;
  canExportPdf: boolean;
  canExportPptx: boolean;
  maxProjects: number | null; // null = unlimited
}

export interface PlanConfig {
  key: PlanKey;
  displayName: string;
  priceDisplay: string;
  priceMonthly: number; // in cents
  pricingDescription: string;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  entitlements: EntitlementFlags;
}

export const PLANS: Record<PlanKey, PlanConfig> = {
  free: {
    key: "free",
    displayName: "Free",
    priceDisplay: "Free",
    priceMonthly: 0,
    pricingDescription:
      "Get the frameworks, templates, and examples to sharpen your message.",
    ctaLabel: "Get free resources",
    ctaHref: "/signup",
    features: [
      "MEDDIC framework guide",
      "Command of the Message guide",
      "Messaging templates and examples",
      "Example GTM asset outputs",
      "Framework explanations and guides",
    ],
    entitlements: {
      canAccessFreeResources: true,
      canCreateProject: false,
      canGenerateMessagingFoundation: false,
      canGenerateAssets: false,
      canAccessVersionedWorkspace: false,
      canExportHtml: false,
      canExportPdf: false,
      canExportPptx: false,
      maxProjects: 0,
    },
  },

  paid_monthly: {
    key: "paid_monthly",
    displayName: "Go-to-Market Taste",
    priceDisplay: "€5",
    priceMonthly: 500, // EUR cents
    pricingDescription:
      "Turn your company positioning into ready-to-use GTM assets aligning your entire company to drive growth.",
    ctaLabel: "Start for €5/month",
    ctaHref: "/signup?plan=paid_monthly",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Generate your Messaging Foundation",
      "Generate pitch deck, one-pager, and sales deck",
      "Versioned workspace — edit and track changes",
      "HTML export for all asset types",
      "Verified vs. inferred provenance tagging",
    ],
    entitlements: {
      canAccessFreeResources: true,
      canCreateProject: true,
      canGenerateMessagingFoundation: true,
      canGenerateAssets: true,
      canAccessVersionedWorkspace: true,
      canExportHtml: true,
      canExportPdf: false, // not yet implemented
      canExportPptx: false, // not yet implemented
      maxProjects: null,
    },
  },
};

// Maps raw workspace.plan values → PlanKey.
// Handles legacy "pro"/"team" values from the old three-tier model.
export function normalizePlanKey(rawPlan: string): PlanKey {
  if (rawPlan === "paid_monthly" || rawPlan === "pro" || rawPlan === "team") {
    return "paid_monthly";
  }
  return "free";
}

export function getPlanConfig(planKey: PlanKey): PlanConfig {
  return PLANS[planKey];
}

export function getPlanForWorkspace(workspace: { plan: string }): PlanConfig {
  return PLANS[normalizePlanKey(workspace.plan)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Paywall and upgrade prompt copy
//
// Used in UpgradePrompt component and inline paywall states.
// Keep each entry tied to a specific workflow context.
// ─────────────────────────────────────────────────────────────────────────────

import type { InAppPrompt } from "../types";

export type PaywallContext =
  | "create_project"
  | "generate_foundation"
  | "generate_assets"
  | "export_html"
  | "export_pdf"
  | "export_pptx"
  | "version_history"
  | "generic";

export const PAYWALL_COPY: Record<PaywallContext, InAppPrompt> = {
  create_project: {
    id: "paywall_create_project",
    title: "Creating projects requires the full plan",
    body: "The free plan gives you frameworks, templates, and examples. To create a project, generate a Messaging Foundation, and derive ready-to-use assets, upgrade to Go-to-Market Taste at €5/month.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },

  generate_foundation: {
    id: "paywall_generate_foundation",
    title: "Generating a Messaging Foundation requires the full plan",
    body: "The Messaging Foundation is the step that turns your intake into a structured MEDDIC-aligned narrative. It's available on the paid plan at €5/month.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },

  generate_assets: {
    id: "paywall_generate_assets",
    title: "Asset generation requires the full plan",
    body: "Generating your pitch deck, one-pager, and sales enablement deck from an approved Messaging Foundation is available on the paid plan at €5/month.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },

  export_html: {
    id: "paywall_export_html",
    title: "HTML export requires the full plan",
    body: "Download any asset as a standalone HTML file. Available on the paid plan at €5/month.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },

  export_pdf: {
    id: "paywall_export_pdf",
    title: "PDF export is coming soon",
    body: "PDF export will be available on the paid plan. HTML export is available now.",
    cta: { label: "Export as HTML instead", href: "#" },
  },

  export_pptx: {
    id: "paywall_export_pptx",
    title: "PPTX export is coming soon",
    body: "PowerPoint export will be available in a future update. HTML export is available now.",
    cta: { label: "Export as HTML instead", href: "#" },
  },

  version_history: {
    id: "paywall_version_history",
    title: "Version history requires the full plan",
    body: "Track changes across Messaging Foundation versions and asset generations. Available on the paid plan at €5/month.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },

  generic: {
    id: "paywall_generic",
    title: "This feature requires the full plan",
    body: "Upgrade to Go-to-Market Taste at €5/month to access the complete workflow — project creation, Messaging Foundation generation, GTM assets, and HTML export.",
    cta: { label: "Start for €5/month", href: "/app/billing" },
  },
};

export function getPaywallCopy(context: PaywallContext): InAppPrompt {
  return PAYWALL_COPY[context] ?? PAYWALL_COPY.generic;
}

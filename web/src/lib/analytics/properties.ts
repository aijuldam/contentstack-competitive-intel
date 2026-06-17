// ─────────────────────────────────────────────────────────────────────────────
// Shared analytics property types
//
// Keep properties consistent across events. Never duplicate.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanKey = "free" | "paid_monthly";
export type AssetTypeKey = "pitch_deck" | "one_pager" | "sales_deck";
export type ExportFormatKey = "html" | "pdf" | "pptx";

/** Generic bag — all property values must be serialisable. */
export type EventProperties = Record<string, string | number | boolean | null | undefined>;

/** Common properties included on most events. */
export interface BaseProperties {
  plan?: PlanKey;
  workspace_id?: string;
  source_page?: string;
}

/** User traits sent on identify() calls. */
export interface UserTraits extends BaseProperties {
  plan: PlanKey;
  workspace_id: string;
  company_name?: string;
}

export interface ProjectProperties extends BaseProperties {
  project_id: string;
}

export interface FoundationProperties extends ProjectProperties {
  foundation_version?: number;
}

export interface AssetProperties extends ProjectProperties {
  asset_type: AssetTypeKey;
  asset_version?: number;
}

export interface ExportProperties extends AssetProperties {
  export_format: ExportFormatKey;
}

export interface PaywallProperties extends BaseProperties {
  /** Which feature triggered the paywall. */
  paywall_context: string;
}

export interface CtaProperties extends BaseProperties {
  /** Display label of the button. */
  pricing_cta: string;
  /** Where on the product the CTA lives. */
  location: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics event name constants
//
// Use these instead of string literals everywhere. Changing a name here
// changes it across the entire codebase.
// ─────────────────────────────────────────────────────────────────────────────

export const E = {
  // ── Auth & acquisition ──────────────────────────────────────────────────
  LANDING_PAGE_VIEWED:            "landing_page_viewed",
  PRICING_PAGE_VIEWED:            "pricing_page_viewed",
  FREE_RESOURCES_CLICKED:         "free_resources_clicked",
  PAID_CTA_CLICKED:               "paid_cta_clicked",
  SIGNUP_STARTED:                 "signup_started",
  SIGNUP_COMPLETED:               "signup_completed",
  LOGIN_COMPLETED:                "login_completed",

  // ── Onboarding & activation funnel ──────────────────────────────────────
  ONBOARDING_STARTED:             "onboarding_started",
  ONBOARDING_COMPLETED:           "onboarding_completed",
  PROJECT_CREATED:                "project_created",
  INTAKE_STARTED:                 "intake_started",
  INTAKE_COMPLETED:               "intake_completed",
  MESSAGING_FOUNDATION_GENERATED: "messaging_foundation_generated",
  MESSAGING_FOUNDATION_REVIEWED:  "messaging_foundation_reviewed",
  MESSAGING_FOUNDATION_APPROVED:  "messaging_foundation_approved",
  FIRST_ASSET_GENERATED:          "first_asset_generated",
  ASSET_GENERATED:                "asset_generated",
  ASSET_OPENED:                   "asset_opened",

  // ── Pricing & monetization ───────────────────────────────────────────────
  PAYWALL_VIEWED:                 "paywall_viewed",
  UPGRADE_CLICKED:                "upgrade_clicked",
  CHECKOUT_STARTED:               "checkout_started",
  CHECKOUT_COMPLETED:             "checkout_completed",
  BILLING_PAGE_VIEWED:            "billing_page_viewed",

  // ── Workflow usage ───────────────────────────────────────────────────────
  EXPORT_REQUESTED:               "export_requested",
  EXPORT_COMPLETED:               "export_completed",
  ASSET_EDITED:                   "asset_edited",
  ASSET_REGENERATED:              "asset_regenerated",
} as const;

export type AnalyticsEvent = (typeof E)[keyof typeof E];

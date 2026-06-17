// Analytics layer — server and client exports are intentionally split.
// Import from the correct module for your context:
//
//   Server Components / Actions / API Routes → "@/lib/analytics/server"
//   Client Components                        → "@/lib/analytics/client"
//
// This barrel only exports the shared constants and types.

export { E, type AnalyticsEvent } from "./events";
export type {
  EventProperties,
  BaseProperties,
  UserTraits,
  ProjectProperties,
  FoundationProperties,
  AssetProperties,
  ExportProperties,
  PaywallProperties,
  CtaProperties,
  PlanKey,
  AssetTypeKey,
  ExportFormatKey,
} from "./properties";

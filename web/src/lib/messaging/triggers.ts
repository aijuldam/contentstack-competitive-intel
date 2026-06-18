// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle trigger map
//
// Defines when each lifecycle message fires, what audience it targets,
// and what suppresses it. Matches the event taxonomy in lib/analytics/events.ts.
//
// Implementation notes:
//   - Event-triggered messages should fire as soon as the triggering event lands.
//   - Time-based fallbacks are secondary: fire only if the primary action has
//     NOT occurred within the fallback window.
//   - Suppression is evaluated before any message is queued.
//   - Once a user crosses the activation milestone (project_created +
//     messaging_foundation_generated + asset_opened), suppress all onboarding
//     nudges for that user.
// ─────────────────────────────────────────────────────────────────────────────

import type { LifecycleMessage } from "./types";

export const ACTIVATION_MILESTONE_EVENTS = [
  "project_created",
  "messaging_foundation_generated",
  "asset_opened",
] as const;

export const LIFECYCLE_MESSAGES: LifecycleMessage[] = [
  {
    id: "welcome",
    channel: ["email"],
    triggerDescription: "User completes signup.",
    triggerType: "event",
    triggerEvent: "signup_completed",
    audience: "All new signups.",
    goal: "Get the user to complete workspace setup and understand the product.",
    suppressionRules: [
      "Already received welcome email (idempotent — send once per user).",
    ],
  },

  {
    id: "onboarding_reminder",
    channel: ["email"],
    triggerDescription: "24 hours after signup with no workspace created.",
    triggerType: "time_fallback",
    triggerEvent: "signup_completed",
    fallbackDelayHours: 24,
    audience: "Signed up but onboarding_completed not yet fired.",
    goal: "Complete workspace creation to unblock the product workflow.",
    suppressionRules: [
      "onboarding_completed has fired.",
      "User has already received onboarding_reminder.",
      "More than 72 hours since signup (window closed — too late).",
    ],
  },

  {
    id: "project_nudge",
    channel: ["email"],
    triggerDescription: "24 hours after onboarding_completed with no project created.",
    triggerType: "time_fallback",
    triggerEvent: "onboarding_completed",
    fallbackDelayHours: 24,
    audience: "Workspace created but project_created not yet fired. Paid users only.",
    goal: "Create a first project to begin the core workflow.",
    suppressionRules: [
      "project_created has fired.",
      "User is on free plan (no project creation entitlement — send upgrade email instead).",
      "More than 7 days since onboarding_completed.",
    ],
  },

  {
    id: "foundation_nudge",
    channel: ["email"],
    triggerDescription: "24 hours after project_created with no foundation generated.",
    triggerType: "time_fallback",
    triggerEvent: "project_created",
    fallbackDelayHours: 24,
    audience: "Has at least one project but messaging_foundation_generated not yet fired.",
    goal: "Generate the Messaging Foundation to unlock assets.",
    suppressionRules: [
      "messaging_foundation_generated has fired.",
      "More than 7 days since project_created.",
      "User has been sent foundation_nudge before (send once).",
    ],
  },

  {
    id: "asset_nudge",
    channel: ["email"],
    triggerDescription: "24 hours after messaging_foundation_generated with no asset opened.",
    triggerType: "time_fallback",
    triggerEvent: "messaging_foundation_generated",
    fallbackDelayHours: 24,
    audience: "Has approved foundation but asset_opened not yet fired.",
    goal: "Open the first asset to complete the activation milestone.",
    suppressionRules: [
      "asset_opened has fired.",
      "More than 7 days since messaging_foundation_generated.",
      "User has been sent asset_nudge before (send once).",
    ],
  },

  {
    id: "upgrade_paywall_hit",
    channel: ["email"],
    triggerDescription: "Free user fires paywall_viewed event.",
    triggerType: "event",
    triggerEvent: "paywall_viewed",
    audience: "Free plan users who just hit a feature gate.",
    goal: "Convert to paid plan by showing what unlocks.",
    suppressionRules: [
      "User is already on paid plan.",
      "upgrade_paywall_hit has been sent within the last 7 days (cooldown).",
      "checkout_completed has fired (already converted).",
    ],
  },

  {
    id: "upgrade_engaged_free",
    channel: ["email"],
    triggerDescription:
      "Free user, 7 days post signup, has viewed resources at least twice but has not upgraded.",
    triggerType: "time_fallback",
    fallbackDelayHours: 168, // 7 days
    audience:
      "Free plan users who have engaged with the product (pricing_page_viewed or free_resources_clicked ≥2) but checkout_completed has not fired.",
    goal: "Convert engaged free users to the paid plan.",
    suppressionRules: [
      "User is already on paid plan.",
      "checkout_completed has fired.",
      "upgrade_engaged_free has been sent before (send once per user).",
      "User has never logged in after signup (no meaningful engagement).",
    ],
  },

  {
    id: "activation_success",
    channel: ["email"],
    triggerDescription: "User fires asset_opened for the first time ever.",
    triggerType: "event",
    triggerEvent: "asset_opened",
    audience: "Paid users who just opened their first generated asset.",
    goal: "Reinforce the value delivered, encourage export and sharing.",
    suppressionRules: [
      "activation_success has been sent before (send once — first asset open only).",
      "User is on free plan (they cannot have generated assets).",
    ],
  },

  {
    id: "re_engagement",
    channel: ["email"],
    triggerDescription: "14 days since the user's last recorded activity.",
    triggerType: "time_fallback",
    fallbackDelayHours: 336, // 14 days
    audience:
      "All users who signed up but have not had any tracked event in 14 days. Paid users are prioritized.",
    goal: "Bring the user back to their most recent unfinished step.",
    suppressionRules: [
      "Any event has fired in the past 14 days.",
      "re_engagement has been sent within the past 30 days.",
      "User has unsubscribed from lifecycle emails.",
    ],
  },
];

export function getMessageById(id: LifecycleMessage["id"]): LifecycleMessage | undefined {
  return LIFECYCLE_MESSAGES.find((m) => m.id === id);
}

export function getMessagesByTriggerEvent(eventName: string): LifecycleMessage[] {
  return LIFECYCLE_MESSAGES.filter((m) => m.triggerEvent === eventName);
}

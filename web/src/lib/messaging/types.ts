// ─────────────────────────────────────────────────────────────────────────────
// Messaging types
//
// Shared interfaces for lifecycle email templates and in-app copy.
// Provider-agnostic. Sending is handled in providers/.
// ─────────────────────────────────────────────────────────────────────────────

export type LifecycleMessageId =
  | "welcome"
  | "onboarding_reminder"
  | "project_nudge"
  | "foundation_nudge"
  | "asset_nudge"
  | "upgrade_paywall_hit"
  | "upgrade_engaged_free"
  | "activation_success"
  | "re_engagement";

export type MessageChannel = "email" | "in_app";

export type TriggerType = "event" | "time_fallback";

export interface Cta {
  label: string;
  /** Relative path or absolute URL. Relative paths are resolved against APP_URL. */
  href: string;
}

export interface EmailTemplate {
  id: LifecycleMessageId;
  subject: string;
  preheader: string;
  /** Plain-text body. Use {variable} for interpolation. Markdown-friendly. */
  body: string;
  cta: Cta;
}

export interface InAppPrompt {
  id: string;
  title: string;
  body: string;
  cta?: Cta;
  /** If true, prompt should not show again after the user dismisses. */
  dismissable?: boolean;
}

export interface LifecycleMessage {
  id: LifecycleMessageId;
  channel: MessageChannel[];
  /** Human description of what triggers this message. */
  triggerDescription: string;
  triggerType: TriggerType;
  /** Analytics event that triggers this, if event-based. */
  triggerEvent?: string;
  /** Time delay in hours from the anchor event, for time-based fallback. */
  fallbackDelayHours?: number;
  /** Conditions that must be true for this message to send. */
  audience: string;
  /** What we want the recipient to do. */
  goal: string;
  /** Conditions under which this message is skipped. */
  suppressionRules: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Messaging service
//
// The single call-site for lifecycle messaging in server actions and API routes.
// Handles template interpolation, provider delegation, and dev-mode logging.
//
// Usage in a server action:
//   import { sendLifecycleEmail, identifyUser } from "@/lib/messaging/service";
//   await sendLifecycleEmail("welcome", { to: email, variables: { first_name } });
//   await identifyUser({ userId, email, plan, workspaceId, companyName });
//
// Note: Do NOT call this from client components. Server-only.
// ─────────────────────────────────────────────────────────────────────────────

import { messagingProvider } from "./providers";
import { EMAIL_TEMPLATES } from "./templates";
import type { LifecycleMessageId } from "./types";
import type { IdentifyContactParams } from "./providers";

interface SendLifecycleEmailParams {
  to: string;
  variables?: Record<string, string>;
}

/**
 * Sends a lifecycle email using the configured provider.
 * Falls back silently in production if the provider is a stub.
 */
export async function sendLifecycleEmail(
  id: LifecycleMessageId,
  params: SendLifecycleEmailParams
): Promise<void> {
  const template = EMAIL_TEMPLATES[id];
  if (!template) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[messaging] No template found for id: ${id}`);
    }
    return;
  }

  try {
    await messagingProvider.sendEmail({
      to: params.to,
      templateId: id,
      subject: template.subject,
      body: interpolate(template.body, params.variables ?? {}),
      variables: params.variables,
    });
  } catch (err) {
    // Messaging failures should never crash a user-facing action.
    if (process.env.NODE_ENV === "development") {
      console.error(`[messaging] Failed to send ${id} to ${params.to}:`, err);
    }
  }
}

/**
 * Upserts a contact in the messaging provider.
 * Call after signup_completed and onboarding_completed.
 */
export async function identifyUser(params: IdentifyContactParams): Promise<void> {
  try {
    await messagingProvider.identifyContact(params);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[messaging] identifyContact failed:", err);
    }
  }
}

/**
 * Fires a behavioral event to the messaging provider so it can
 * trigger sequences (e.g. time-based nudges after project_created).
 *
 * Connect this to analytics server actions that already track the same events —
 * do not call this from client components.
 */
export async function trackMessagingEvent(
  userId: string,
  email: string,
  eventName: string,
  properties?: Record<string, string | number | boolean | null>
): Promise<void> {
  try {
    await messagingProvider.trackEvent({ userId, email, eventName, properties });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[messaging] trackEvent failed for ${eventName}:`, err);
    }
  }
}

// Simple {variable} interpolation
function interpolate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
}

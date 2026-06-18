// ─────────────────────────────────────────────────────────────────────────────
// Messaging provider interface
//
// Any email/lifecycle provider must implement this interface.
// Swap providers by changing MESSAGING_PROVIDER in this file.
//
// Current provider: stub (logs in dev, no-ops in production)
//
// Recommended providers for Go-to-Market Taste:
//   - Resend       — transactional email, simple API, Next.js friendly
//   - Loops        — lifecycle sequences designed for SaaS, event-based
//   - Customer.io  — full lifecycle automation, requires more setup
//   - PostHog      — can trigger emails via feature flag groups + sequences
//
// Integration steps (for whichever provider you choose):
//   1. Install the provider SDK (see provider-specific files in this directory)
//   2. Set the required env var (e.g. RESEND_API_KEY, LOOPS_API_KEY)
//   3. Implement MessagingProvider in the corresponding stub file
//   4. Change MESSAGING_PROVIDER to point to the real implementation
// ─────────────────────────────────────────────────────────────────────────────

export interface SendEmailParams {
  to: string;
  templateId: string;
  subject: string;
  /** Plain-text body for simple providers. */
  body?: string;
  /** Variables for template interpolation: {first_name}, {project_id}, etc. */
  variables?: Record<string, string>;
}

export interface IdentifyContactParams {
  userId: string;
  email: string;
  firstName?: string;
  plan?: string;
  workspaceId?: string;
  companyName?: string;
  createdAt?: string;
}

export interface TrackProviderEventParams {
  userId: string;
  email: string;
  eventName: string;
  properties?: Record<string, string | number | boolean | null>;
}

export interface SubscribeParams {
  userId: string;
  email: string;
  firstName?: string;
  /** Used by providers that organize contacts into lists/audiences. */
  listId?: string;
}

export interface MessagingProvider {
  /** Send a single transactional email. */
  sendEmail(params: SendEmailParams): Promise<void>;
  /** Upsert a contact record so lifecycle sequences can target them. */
  identifyContact(params: IdentifyContactParams): Promise<void>;
  /** Fire a behavioral event so providers can trigger sequences. */
  trackEvent(params: TrackProviderEventParams): Promise<void>;
  /** Opt a contact into a specific list or sequence. */
  subscribe(params: SubscribeParams): Promise<void>;
}

// ── Stub provider ─────────────────────────────────────────────────────────────

class StubMessagingProvider implements MessagingProvider {
  private log(method: string, params: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.log(`[messaging:stub:${method}]`, params);
    }
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    this.log("sendEmail", { to: params.to, subject: params.subject, templateId: params.templateId });
  }

  async identifyContact(params: IdentifyContactParams): Promise<void> {
    this.log("identifyContact", params);
  }

  async trackEvent(params: TrackProviderEventParams): Promise<void> {
    this.log("trackEvent", { userId: params.userId, event: params.eventName });
  }

  async subscribe(params: SubscribeParams): Promise<void> {
    this.log("subscribe", params);
  }
}

// ── Active provider ───────────────────────────────────────────────────────────
// Replace StubMessagingProvider with your chosen implementation when ready.

export const messagingProvider: MessagingProvider = new StubMessagingProvider();

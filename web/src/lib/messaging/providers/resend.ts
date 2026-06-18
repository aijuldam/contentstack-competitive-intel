// ─────────────────────────────────────────────────────────────────────────────
// Resend provider stub
//
// Resend is recommended for transactional email (welcome, nudges, activation).
// It has a simple REST API, a Next.js SDK, and supports React Email templates.
//
// To activate:
//   1. npm install resend
//   2. Set RESEND_API_KEY in your environment
//   3. Set RESEND_FROM_ADDRESS (e.g. "Go-to-Market Taste <hello@yourdomain.com>")
//   4. Implement the methods below using the Resend SDK
//   5. Replace StubMessagingProvider with ResendProvider in providers/index.ts
//
// Resend docs: https://resend.com/docs
// Resend Next.js SDK: https://resend.com/docs/send-with-nextjs
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MessagingProvider,
  SendEmailParams,
  IdentifyContactParams,
  TrackProviderEventParams,
  SubscribeParams,
} from "./index";

export class ResendProvider implements MessagingProvider {
  // private resend: Resend;

  constructor() {
    // const apiKey = process.env.RESEND_API_KEY;
    // if (!apiKey) throw new Error("RESEND_API_KEY is not set");
    // this.resend = new Resend(apiKey);
    throw new Error("ResendProvider is not yet implemented. See comments in this file.");
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    // const from = process.env.RESEND_FROM_ADDRESS ?? "Go-to-Market Taste <hello@gotastegtm.com>";
    // await this.resend.emails.send({
    //   from,
    //   to: params.to,
    //   subject: params.subject,
    //   text: interpolate(params.body ?? "", params.variables ?? {}),
    // });
    void params;
    throw new Error("Not implemented");
  }

  async identifyContact(_params: IdentifyContactParams): Promise<void> {
    // Resend does not natively support contact upserts for lifecycle use.
    // For lifecycle sequencing, pair Resend with Loops or Customer.io.
  }

  async trackEvent(_params: TrackProviderEventParams): Promise<void> {
    // Resend is transactional only. Use Loops or Customer.io for event-triggered sequences.
  }

  async subscribe(_params: SubscribeParams): Promise<void> {
    // Resend Audiences can be used for list management.
    // await this.resend.contacts.create({ audienceId: "...", email: params.email, firstName: params.firstName });
  }
}

// Simple {variable} interpolation for plain-text emails
function interpolate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
}

void interpolate; // prevent unused warning until implemented

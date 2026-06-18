// ─────────────────────────────────────────────────────────────────────────────
// Loops provider stub
//
// Loops is recommended for lifecycle email sequences (onboarding nudges,
// upgrade flows, re-engagement). It is designed for SaaS and supports
// event-triggered sequences natively.
//
// To activate:
//   1. npm install loops
//   2. Set LOOPS_API_KEY in your environment
//   3. Create contact properties in Loops dashboard:
//      - plan (string: "free" | "paid_monthly")
//      - workspace_id (string)
//      - company_name (string)
//      - onboarding_completed (boolean)
//      - project_created (boolean)
//      - foundation_generated (boolean)
//      - asset_opened (boolean)
//      - activated (boolean — true when all three activation milestones fired)
//   4. Create transactional emails in Loops for each template in templates/
//   5. Create event-triggered loops for time-based nudges (e.g. "24h after
//      project_created if foundation_generated is false")
//   6. Implement the methods below and replace StubMessagingProvider in index.ts
//
// Loops docs: https://loops.so/docs
// Loops API ref: https://loops.so/docs/api-reference
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MessagingProvider,
  SendEmailParams,
  IdentifyContactParams,
  TrackProviderEventParams,
  SubscribeParams,
} from "./index";

export class LoopsProvider implements MessagingProvider {
  // private loops: LoopsClient;

  constructor() {
    // const apiKey = process.env.LOOPS_API_KEY;
    // if (!apiKey) throw new Error("LOOPS_API_KEY is not set");
    // this.loops = new LoopsClient(apiKey);
    throw new Error("LoopsProvider is not yet implemented. See comments in this file.");
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    // Send a transactional email using a Loops template.
    // await this.loops.sendTransactionalEmail({
    //   transactionalId: params.templateId,  // Loops template ID from dashboard
    //   email: params.to,
    //   dataVariables: params.variables ?? {},
    // });
    void params;
    throw new Error("Not implemented");
  }

  async identifyContact(params: IdentifyContactParams): Promise<void> {
    // Upsert a contact. Loops uses email as the unique identifier.
    // await this.loops.updateContact(params.email, {
    //   userId: params.userId,
    //   firstName: params.firstName,
    //   plan: params.plan,
    //   workspaceId: params.workspaceId,
    //   companyName: params.companyName,
    // });
    void params;
    throw new Error("Not implemented");
  }

  async trackEvent(params: TrackProviderEventParams): Promise<void> {
    // Fire a behavioral event that can trigger automated sequences in Loops.
    // await this.loops.sendEvent({
    //   email: params.email,
    //   eventName: params.eventName,
    //   eventProperties: params.properties ?? {},
    // });
    void params;
    throw new Error("Not implemented");
  }

  async subscribe(params: SubscribeParams): Promise<void> {
    // Subscribe a contact to a specific mailing list.
    // await this.loops.updateContact(params.email, {
    //   userId: params.userId,
    //   firstName: params.firstName,
    //   mailingLists: { [params.listId ?? "onboarding"]: true },
    // });
    void params;
    throw new Error("Not implemented");
  }
}

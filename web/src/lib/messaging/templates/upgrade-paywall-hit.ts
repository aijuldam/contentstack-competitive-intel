import type { EmailTemplate } from "../types";

export const upgradePaywallHit: EmailTemplate = {
  id: "upgrade_paywall_hit",
  subject: "You tried to access a paid feature",
  preheader: "€5/month unlocks the full product workflow.",
  body: `Hi {first_name},

You tried to create a project in Go-to-Market Taste and were blocked by the free plan.

Here's what €5/month unlocks:

- Create unlimited projects
- Generate a Messaging Foundation from your product intake
- Derive a pitch deck, one-pager, and sales enablement deck from a single approved narrative
- Edit any section, track versions, and export as HTML
- See which claims are verified vs. inferred — and correct them before assets are finalized

The free plan is designed for exploring the frameworks — MEDDIC, Command of the Message, messaging templates, and example outputs. The full workflow requires a subscription.

One project. One intake. Three assets in under 10 minutes.`,
  cta: {
    label: "Start for €5/month",
    href: "/app/billing",
  },
};

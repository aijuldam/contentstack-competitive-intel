import type { EmailTemplate } from "../types";

export const assetNudge: EmailTemplate = {
  id: "asset_nudge",
  subject: "Your Messaging Foundation is ready — open your pitch deck",
  preheader: "Your assets are generated. Review the first one.",
  body: `Hi {first_name},

Your Messaging Foundation is generated and approved. That means your assets are ready.

Go-to-Market Taste derives three assets from the foundation you approved:

- Pitch deck: 8 slides covering the problem, cost of inaction, solution, differentiation, proof, outcomes, and next steps. Built for a 15-minute executive conversation.
- One-pager: A single-page leave-behind for champions to share internally. Skimmable, framework-aligned, and built from your narrative.
- Sales enablement deck: An AE playbook with discovery questions mapped to your buyer's pain, objection responses grounded in your differentiation, and competitive angles.

Each section is editable. You can revise any claim, swap out an inferred statement for something verified, or adjust the tone. Changes to individual assets don't affect the foundation — unless you want to regenerate from a new approved version.

Open your pitch deck and see what the model produced from your inputs.`,
  cta: {
    label: "Open your pitch deck",
    href: "/app/projects/{project_id}/assets/pitch-deck",
  },
};

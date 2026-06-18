import type { EmailTemplate } from "../types";

export const foundationNudge: EmailTemplate = {
  id: "foundation_nudge",
  subject: "Your intake is saved — generate your Messaging Foundation",
  preheader: "One click turns your inputs into a structured sales narrative.",
  body: `Hi {first_name},

You created a project in Go-to-Market Taste and saved your intake. The next step is generating your Messaging Foundation.

The Messaging Foundation is a structured narrative that covers:

- Metrics: what your buyers are trying to move
- Economic buyer: who controls the budget and what they care about
- Decision criteria: how they evaluate options
- Identify pain: the specific problem your product solves
- Champion: the person who will advocate for you internally
- Current state and negative consequences
- Required capabilities, differentiated value, and business outcomes
- Proof points and competitive differentiation

Every section is tagged verified (you stated it) or inferred (derived from your input — needs your review). You review and approve the foundation before any assets are generated from it.

This is the step that makes the pitch deck, one-pager, and sales deck coherent — they all derive from the same approved source.`,
  cta: {
    label: "Generate your Messaging Foundation",
    href: "/app/projects/{project_id}/inputs",
  },
};

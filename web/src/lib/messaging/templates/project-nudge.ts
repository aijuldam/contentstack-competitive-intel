import type { EmailTemplate } from "../types";

export const projectNudge: EmailTemplate = {
  id: "project_nudge",
  subject: "Your workspace is ready — add your first product",
  preheader: "Four fields. One structured narrative. Three assets.",
  body: `Hi {first_name},

Your workspace is set up. The next step is creating a project.

Each project in Go-to-Market Taste represents a product you're positioning. You fill in four fields:

- What your product does
- Who buys it and who uses it
- What it costs buyers to do nothing about the problem
- What makes you different, with any proof you can provide

From there, Go-to-Market Taste generates a Messaging Foundation — a structured narrative aligned to MEDDIC and Command of the Message. Every claim is traceable: verified means you said it, inferred means the model derived it and you need to confirm it.

Once you approve the foundation, you generate your pitch deck, one-pager, and sales enablement deck from a single source of truth.

This takes less than 10 minutes from blank to first draft.`,
  cta: {
    label: "Create your first project",
    href: "/app/projects/new",
  },
};

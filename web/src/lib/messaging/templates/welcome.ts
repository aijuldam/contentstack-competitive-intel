import type { EmailTemplate } from "../types";

export const welcome: EmailTemplate = {
  id: "welcome",
  subject: "Your Go-to-Market Taste account is ready",
  preheader: "One workspace, one intake, three ready-to-use assets.",
  body: `Hi {first_name},

Your account is set up. Here's what to do next.

Go-to-Market Taste turns a short product description into three sales assets — a pitch deck, a one-pager, and a sales enablement deck — all grounded in MEDDIC and Command of the Message.

The workflow is four steps:

1. Create a workspace and a project.
2. Fill in four fields: what you do, who buys it, the cost of doing nothing, and your differentiation.
3. Review and approve your Messaging Foundation — the structured narrative that every asset derives from.
4. Generate your assets. Edit any section. Export when ready.

Everything in Go-to-Market Taste comes from what you put in. If you don't provide a specific metric or customer name, the output notes it as missing and flags it for you to fill in. Nothing is invented.

Start by setting up your workspace:`,
  cta: {
    label: "Set up your workspace",
    href: "/onboarding",
  },
};

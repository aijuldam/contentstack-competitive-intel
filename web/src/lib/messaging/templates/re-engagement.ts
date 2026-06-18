import type { EmailTemplate } from "../types";

export const reEngagement: EmailTemplate = {
  id: "re_engagement",
  subject: "Your project is still here",
  preheader: "Pick up where you left off — your draft is saved.",
  body: `Hi {first_name},

It's been a couple of weeks since you were last in Go-to-Market Taste.

If you got busy or weren't sure what to do next, here's where you likely left off:

- If you haven't created a project yet: Start by describing your product in four plain-language fields. It takes about 5 minutes.
- If you have a project but no Messaging Foundation: The foundation is the one step that makes everything else work. Generate it from your intake.
- If you have a foundation but haven't opened your assets: Your pitch deck, one-pager, and sales enablement deck are ready when you are.

Nothing has been deleted. Your workspace and any drafts are exactly where you left them.`,
  cta: {
    label: "Pick up where you left off",
    href: "/app/projects",
  },
};

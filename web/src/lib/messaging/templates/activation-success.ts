import type { EmailTemplate } from "../types";

export const activationSuccess: EmailTemplate = {
  id: "activation_success",
  subject: "You've got your first GTM assets",
  preheader: "Your pitch deck, one-pager, and sales deck are ready.",
  body: `Hi {first_name},

You've completed the core workflow in Go-to-Market Taste.

You described your product. The system produced a structured Messaging Foundation — a MEDDIC-aligned narrative covering your buyer's pain, the cost of inaction, your required capabilities, your differentiated value, and your business outcomes. You reviewed it, approved it, and generated assets from it.

That's the workflow. From four fields to a pitch deck, a one-pager, and a sales enablement deck — all traceable to a single approved source.

A few things worth doing now:

- Review each section of your pitch deck. Edit anything that reads too generic — the system works from what you gave it, and more specific inputs produce more specific outputs.
- Export your pitch deck as HTML to share it or use it outside the app.
- If you update your intake with new metrics or proof points, you can regenerate the foundation and refresh your assets from the new version.

If you have feedback on what the system produced — what was useful, what missed the mark — reply to this email. This is early and your input directly shapes what gets built next.`,
  cta: {
    label: "Review your pitch deck",
    href: "/app/projects/{project_id}/assets/pitch-deck",
  },
};

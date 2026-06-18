import type { EmailTemplate } from "../types";

export const onboardingReminder: EmailTemplate = {
  id: "onboarding_reminder",
  subject: "One step left to start using Go-to-Market Taste",
  preheader: "Your workspace isn't set up yet — takes less than a minute.",
  body: `Hi {first_name},

You signed up but haven't created a workspace yet. That's the one step between your account and the product.

A workspace holds your projects, your Messaging Foundation, and all your generated assets. It takes about 30 seconds to name it and move on.

Once it's set up, you can create a project, fill in your product intake, and generate a structured sales narrative — pitch deck, one-pager, and sales enablement deck included.`,
  cta: {
    label: "Create your workspace",
    href: "/onboarding",
  },
};

import type { EmailTemplate } from "../types";

export const upgradeEngagedFree: EmailTemplate = {
  id: "upgrade_engaged_free",
  subject: "The frameworks are just the starting point",
  preheader: "You've explored the guides. Here's what's next.",
  body: `Hi {first_name},

You've been using the free resources in Go-to-Market Taste — the MEDDIC guide, the Command of the Message framework, the messaging templates.

Those frameworks describe how good messaging is structured. The product lets you apply them to your own company.

Here's what the full workflow looks like:

You fill in four plain-language fields about your product: what it does, who buys it, what they lose by doing nothing, and what makes you different. Go-to-Market Taste produces a structured Messaging Foundation — a narrative that maps every claim to MEDDIC and Command of the Message elements. Each claim is tagged verified (you stated it) or inferred (the model derived it, you confirm it).

You approve the foundation. Then you generate your pitch deck, one-pager, and sales enablement deck from that single approved source. Every asset is editable, versionable, and exportable as HTML.

The price is €5/month. No trial needed — you've already seen the frameworks. The question is whether you want to apply them to your own positioning.`,
  cta: {
    label: "Start for €5/month",
    href: "/app/billing",
  },
};

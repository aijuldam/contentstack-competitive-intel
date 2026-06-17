import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Go-to-Market Taste.",
};

const faqGroups = [
  {
    group: "About the product",
    faqs: [
      {
        q: "What does Go-to-Market Taste do?",
        a: "It turns a short product description into three sales assets: a pitch deck, a one-pager, and a sales enablement deck. You fill in four fields about your product, your buyer, the cost of doing nothing, and your differentiation. The system produces a structured sales narrative grounded in MEDDIC and Command of the Message, and derives all three assets from that source.",
      },
      {
        q: "Who is this for?",
        a: "Founders who need consistent pitch messaging, product marketers building a messaging foundation, account executives who want a framework-aligned sales deck, and consultants or agencies producing GTM assets for clients. It is designed for B2B SaaS products with a defined commercial buyer.",
      },
      {
        q: "What are MEDDIC and Command of the Message?",
        a: "MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion) is a sales qualification framework used to assess whether a deal is real and closeable. Command of the Message is a structured messaging framework that defines how to communicate value: current state, consequences of inaction, required capabilities, positive outcomes, proof points, and differentiation. Go-to-Market Taste uses both as structural scaffolding, not as labels applied after the fact.",
      },
      {
        q: "Is this a B2C tool?",
        a: "No. It is built for B2B products with a defined sales process, clear buyer personas, and measurable business outcomes. Consumer apps, marketplace products, and products without a commercial buyer are not a good fit.",
      },
    ],
  },
  {
    group: "Inputs and outputs",
    faqs: [
      {
        q: "What does the intake form ask for?",
        a: "Four fields: (1) what your product does, (2) who buys it and who uses it, (3) what it costs buyers to do nothing about the problem, and (4) what makes you different from alternatives and any proof you have. Plain language. No structured format needed.",
      },
      {
        q: "What outputs do I get?",
        a: "A core narrative structured around MEDDIC and Command of the Message elements, a pitch deck with slides aligned to the buyer journey, a one-pager for champions to share internally, and a sales enablement deck with discovery questions, objection responses, and competitive positioning.",
      },
      {
        q: "Does Go-to-Market Taste invent metrics or customer names?",
        a: "No. If you do not provide specific metrics or customer names, the output notes them as missing and flags them for you to fill in. Nothing is fabricated. Every claim is traceable to what you said in the intake, or explicitly labeled as a model interpretation for you to confirm or dismiss.",
      },
      {
        q: "What is the difference between verified and inferred?",
        a: "Verified means the claim came directly from what you wrote in the intake. Inferred means the model derived or interpreted something from your inputs. Both are shown clearly in the core narrative so you can review, accept, rewrite, or dismiss each one before generating assets.",
      },
    ],
  },
  {
    group: "Editing and control",
    faqs: [
      {
        q: "Can I edit the generated content?",
        a: "Yes. Every section of the core narrative is editable inline. You can revise it, accept or dismiss inferred claims, and lock in the version you want before assets are generated from it. You can also edit any asset directly without changing the narrative.",
      },
      {
        q: "If I change the narrative, do the assets update?",
        a: "Yes. You can regenerate any or all assets from an updated narrative. The assets draw from the narrative source, so changes propagate when you choose to regenerate.",
      },
      {
        q: "Can I export the content?",
        a: "HTML export is available now for paid plan users — download any asset as a standalone HTML file. PDF and PPTX exports are coming in a future update.",
      },
    ],
  },
  {
    group: "Pricing and access",
    faqs: [
      {
        q: "Is there a free plan?",
        a: "Yes. The free plan gives you access to the MEDDIC and Command of the Message framework guides, messaging templates, and example GTM asset outputs. No credit card required. To create projects and generate real assets from your own intake, upgrade to the paid plan at €5/month.",
      },
      {
        q: "Why do you ask for a work email?",
        a: "Go-to-Market Taste is a professional tool for revenue teams. Work email keeps accounts tied to the organizations they serve and makes team access and billing cleaner when those features roll out.",
      },
      {
        q: "When is billing available?",
        a: "The paid plan is priced at €5/month. Stripe checkout is being activated shortly — the pricing is confirmed and billing will go live soon.",
      },
    ],
  },
  {
    group: "Data and privacy",
    faqs: [
      {
        q: "Is my intake data used to train AI models?",
        a: "No. Your intake and generated content are never used to train AI models. All data is stored in your private account.",
      },
      {
        q: "Who can see my projects?",
        a: "Only you and members of your workspace. Projects are private by default. There is no public sharing of content.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">

      {/* Header */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">FAQ</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Frequently asked questions</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about Go-to-Market Taste, the output, and how it works.
        </p>
      </div>

      {/* FAQ groups */}
      <div className="space-y-10">
        {faqGroups.map((group) => (
          <div key={group.group}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group.group}
            </h2>
            <dl className="divide-y divide-border rounded-lg border border-border">
              {group.faqs.map((item) => (
                <div key={item.q} className="px-5 py-5">
                  <dt className="mb-2 text-sm font-semibold text-foreground">{item.q}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-border bg-muted/30 p-8 text-center">
        <p className="mb-1 text-sm font-semibold text-foreground">Still have a question?</p>
        <p className="mb-5 text-sm text-muted-foreground">
          Or just ready to see what it produces?
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/signup">Create account</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/examples">View example output</Link>
          </Button>
        </div>
      </div>

    </div>
  );
}

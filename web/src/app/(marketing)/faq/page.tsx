import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about NarrativeKit.",
};

const faqs = [
  {
    q: "What are MEDDIC and Command of the Message?",
    a: "MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion) is a B2B sales qualification framework used to assess deal quality. Command of the Message is a structured messaging framework that defines how to articulate value to buyers — current state, consequences, capabilities, outcomes, proof, and differentiation. NarrativeKit bakes both into every output.",
  },
  {
    q: "How does NarrativeKit distinguish verified facts from inferred assumptions?",
    a: "Every claim in your canonical narrative is tagged at the source. If you stated it explicitly in your intake, it's marked 'verified.' If the AI derived or inferred it from your inputs, it's marked 'inferred.' You review and confirm or dismiss inferences before generating assets.",
  },
  {
    q: "Can I edit the generated content?",
    a: "Yes. Every section of the canonical narrative and every asset is editable inline. You can edit the narrative first, then re-derive assets, or edit assets directly.",
  },
  {
    q: "What does the intake form ask for?",
    a: "Four fields: (1) what your product does, (2) who buys it and who uses it, (3) the cost of not solving the problem, and (4) what makes you different and any proof you have. Plain language, no formatting needed.",
  },
  {
    q: "Does NarrativeKit invent metrics or customer names?",
    a: "No. If you don't provide specific metrics or customer names, the output will note them as missing and flag them for you to fill in. We never fabricate proof.",
  },
  {
    q: "What formats can I export to?",
    a: "PDF export is coming in Phase 2. Currently, all assets are editable in-app and can be copied to any tool.",
  },
  {
    q: "Is my data used to train models?",
    a: "No. Your intake and generated content are never used to train AI models. All data is stored in your private Supabase project.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">FAQ</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Frequently asked questions</h1>
      </div>

      <dl className="space-y-1 divide-y divide-border">
        {faqs.map((item) => (
          <div key={item.q} className="py-6">
            <dt className="mb-2 text-sm font-semibold text-foreground">{item.q}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

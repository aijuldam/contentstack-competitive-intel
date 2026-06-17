import type { AssetSection } from "@/lib/schemas/asset.schema";
import type { RenderContext } from "./types";

export const MOCK_RENDER_CONTEXT: RenderContext = {
  projectName: "Acme RevOps Platform",
  assetVersionId: "mock-asset-version-id-001",
  versionNumber: 2,
  generatedAt: "Jun 14, 2026",
};

export const MOCK_PITCH_DECK_SECTIONS: AssetSection[] = [
  {
    id: "title", label: "Cover",
    content: "Acme RevOps Platform\n\nAI-powered revenue data sync for B2B SaaS teams.\n\nStop reconciling. Start growing.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "problem", label: "The Problem",
    content: "RevOps teams at Series B–D SaaS companies spend 4–6 hours every week manually reconciling data across CRM, billing, and support tools.\n\nErrors go undetected for days. Forecast accuracy suffers. Analysts spend capacity on data hygiene instead of strategic work.",
    source_blocks: ["identify_pain"], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "cost_of_inaction", label: "Cost of Inaction",
    content: "Every week of delay costs an average of 4–6 analyst hours in manual work.\n\nCRM error rates of 12%+ compound into forecast misses, deal slippage, and QBR embarrassments that erode executive confidence in the RevOps function.",
    source_blocks: ["negative_consequences"], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "solution", label: "Our Solution",
    content: "Acme RevOps Platform syncs data bidirectionally across CRM, billing, and support — in real time, with no data warehouse required.\n\nSet up in under 30 minutes. Clean, consistent data across all your systems from day one.",
    source_blocks: ["required_capabilities"], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "differentiation", label: "Why Us",
    content: "The only RevOps sync tool that works bidirectionally without requiring a data warehouse or ETL pipeline.\n\nCompetitors require additional data infrastructure that adds weeks of setup and ongoing maintenance.",
    source_blocks: ["differentiated_value"], provenance: "inferred", confidence: "inferred", needs_validation: true, user_edited: false,
  },
  {
    id: "proof", label: "Proof Points",
    content: "One reference customer reduced CRM error rate from 12% to under 1% in 30 days.\n\nTeams report 80% reduction in weekly reconciliation time within the first month of use.",
    source_blocks: ["proof_points"], provenance: "inferred", confidence: "inferred", needs_validation: true, user_edited: false,
  },
  {
    id: "positive_outcomes", label: "Positive Outcomes",
    content: "80% reduction in reconciliation time.\n\nCRM error rate below 1%.\n\nAnalysts shift from data hygiene to high-value strategic work.",
    source_blocks: ["positive_outcomes"], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
  {
    id: "call_to_action", label: "Next Steps",
    content: "Start a 14-day free trial. No credit card required.\n\nBook a 30-minute live walkthrough with a RevOps specialist.",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
];

export const MOCK_ONE_PAGER_SECTIONS: AssetSection[] = [
  {
    id: "headline", label: "Headline",
    content: "Stop reconciling your RevOps data. Start trusting your forecast.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "who_its_for", label: "Who It's For",
    content: "Revenue Operations teams at Series B–D SaaS companies who manage CRM, billing, and support data manually.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "the_problem", label: "The Problem",
    content: "RevOps teams spend 4–6 hours every week manually reconciling data. Errors go undetected for days. Forecasts miss. Deals slip.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "how_it_works", label: "How It Works",
    content: "1. Connect your CRM, billing system, and support tool via OAuth in under 30 minutes.\n2. Acme maps fields across systems automatically.\n3. Changes sync bidirectionally in real time — no data warehouse, no ETL.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "why_us", label: "Why Us",
    content: "The only RevOps sync tool that works bidirectionally without requiring a data warehouse. Acme connects directly to the source systems your team already uses.",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: true, user_edited: false,
  },
  {
    id: "results", label: "Results",
    content: "80% reduction in reconciliation time within month one.\n\nCRM error rate reduced from 12% to under 1% in 30 days (reference customer).",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: true, user_edited: false,
  },
  {
    id: "next_step", label: "Next Step",
    content: "Start a 14-day free trial at acme.io — no credit card required.\n\nOr book a 30-minute live walkthrough with a RevOps specialist.",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
];

export const MOCK_SALES_DECK_SECTIONS: AssetSection[] = [
  {
    id: "buyer_profile", label: "Buyer Profile",
    content: "Primary buyer: VP of Revenue Operations at Series B–D SaaS companies ($10M–$100M ARR).\n\nCares about: forecast accuracy, data reliability, team efficiency.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "common_pains", label: "Common Pains",
    content: "1. Manual CRM reconciliation consuming 4–6 hours/week\n2. Forecast errors discovered only after the fact, in QBRs\n3. Integration projects stuck in data engineering queue",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "discovery_questions", label: "Discovery Questions",
    content: "- How many hours per week does your team spend on data reconciliation today?\n- When was the last time a deal slipped because of a CRM data gap?\n- What would it mean for your forecast accuracy if your CRM was always clean?",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
  {
    id: "solution_narrative", label: "Solution Narrative",
    content: "Acme RevOps Platform connects your CRM, billing, and support tools and keeps them in sync — bidirectionally, in real time. No data warehouse. No ETL. No engineering dependency.",
    source_blocks: [], provenance: "user_provided", confidence: "verified", needs_validation: false, user_edited: false,
  },
  {
    id: "competitive_differentiation", label: "Competitive Angles",
    content: "vs. Workato/Zapier:\nGeneral automation tools. Acme is purpose-built for revenue data sync.\n\nvs. Census/Hightouch:\nRequire a data warehouse. Acme syncs directly between operational systems.",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: true, user_edited: false,
  },
  {
    id: "proof_points", label: "Proof Points",
    content: "- One customer reduced CRM error rate from 12% to under 1% in 30 days\n- 80% reduction in weekly reconciliation time within month one",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: true, user_edited: false,
  },
  {
    id: "objection_handling", label: "Objection Handling",
    content: '"We already have Zapier."\n→ Zapier automates one-directional triggers. Acme handles two-way conflict resolution for revenue data.\n\n"We need to involve engineering."\n→ No engineering required. Setup takes under 30 minutes.',
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
  {
    id: "decision_process_guide", label: "Decision Process",
    content: "1. RevOps Manager runs proof-of-concept\n2. VP RevOps validates business case\n3. IT/Security reviews (SOC 2 Type II available)\n4. Finance approves contract\n\nTimeline: 2–4 weeks SMB, 6–10 weeks Enterprise.",
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
  {
    id: "champion_enablement", label: "Champion Enablement",
    content: 'Internal pitch: "We\'re spending 5+ hours a week on manual data reconciliation. Acme eliminates this with real-time bidirectional sync. One customer reduced their CRM error rate from 12% to under 1% in 30 days."',
    source_blocks: [], provenance: "inferred", confidence: "inferred", needs_validation: false, user_edited: false,
  },
];

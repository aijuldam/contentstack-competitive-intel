// ─────────────────────────────────────────────────────────────────────────────
// EXP-002 — Sample intake prefill content
//
// Used when INTAKE_SAMPLE_PREFILL flag is enabled.
// Prefills the new project form with a realistic RevOps example so users
// can see what good inputs look like and overwrite with their own product.
//
// The example is intentionally specific — generic placeholders train users
// to write generic inputs.
// ─────────────────────────────────────────────────────────────────────────────

export interface SampleIntakeContent {
  project_name: string;
  product_description: string;
  buyer_and_user: string;
  problem_and_cost: string;
  differentiation_and_proof: string;
}

/**
 * Prefill content for the RevOps example.
 * Replace this with a different example if the audience skews away from RevOps.
 */
export const SAMPLE_INTAKE: SampleIntakeContent = {
  project_name: "Example: Acme RevOps Platform",

  product_description:
    "We help RevOps teams at mid-market B2B SaaS companies sync CRM, billing, and support data automatically — replacing 4–6 hours of manual reconciliation per week. We connect Salesforce, Stripe, and Zendesk bidirectionally with no data warehouse required.",

  buyer_and_user:
    "Buyer: VP of Revenue Operations at Series B–D SaaS companies (50–500 employees, $10M–$100M ARR). Day-to-day users: RevOps analysts and CRO admin teams. Secondary approver: CFO when annual contract exceeds $50k.",

  problem_and_cost:
    "Without us, teams spend Monday mornings doing manual exports across three systems. Forecast errors compound — pipeline accuracy is typically off by 15–20%. Deals slip because no one caught the CRM gap in time. Finance closes books 3 days late every quarter. RevOps can't move from data wrangling to analysis.",

  differentiation_and_proof:
    "Bidirectional sync across all three systems — competitors require manual field mapping or a data warehouse. Plug-and-play under a day. Customers typically reduce reconciliation time by 80%. One customer cut CRM error rate from 12% to under 1% in 30 days.",
};

/**
 * Returns the sample content, or empty strings if the flag is disabled.
 * Call from a Server Component — do not import FLAGS from a Client Component.
 */
export function getSampleIntakeContent(enabled: boolean): Partial<SampleIntakeContent> {
  if (!enabled) return {};
  return SAMPLE_INTAKE;
}

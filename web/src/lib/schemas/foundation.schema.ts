import { z } from "zod";
import {
  GroundedBlockSchema,
  GroundedItemSchema,
  ProvenanceEnum,
  ConfidenceEnum,
} from "./provenance";

// ─────────────────────────────────────────────────────────────────────────────
// Messaging Foundation
//
// The structured source of truth for the product story. Every generated asset
// (pitch deck, one-pager, sales enablement deck) is derived from an approved
// Messaging Foundation version. It encodes MEDDIC and Command of the Message as
// structure, not labels, and tags every claim with provenance and confidence.
// ─────────────────────────────────────────────────────────────────────────────

// Explicit MEDDIC sections (sales qualification).
export const MeddicSectionsSchema = z.object({
  metrics: GroundedBlockSchema,
  economic_buyer: GroundedBlockSchema,
  decision_criteria: GroundedBlockSchema,
  decision_process: GroundedBlockSchema,
  identify_pain: GroundedBlockSchema,
  champion: GroundedBlockSchema,
});
export type MeddicSections = z.infer<typeof MeddicSectionsSchema>;

// A single message pillar — a load-bearing theme the story rests on.
export const MessagePillarSchema = z.object({
  title: z.string(),
  description: z.string(),
  provenance: ProvenanceEnum,
  confidence: ConfidenceEnum,
});
export type MessagePillar = z.infer<typeof MessagePillarSchema>;

// An anticipated objection or risk area, with a grounded response.
export const ObjectionSchema = z.object({
  objection: z.string(),
  response: z.string(),
  provenance: ProvenanceEnum,
  confidence: ConfidenceEnum,
  needs_validation: z.boolean().default(false),
});
export type Objection = z.infer<typeof ObjectionSchema>;

export const MessagingFoundationSchema = z.object({
  // Core story sections
  product_summary: GroundedBlockSchema,
  icp_target_buyer: GroundedBlockSchema,
  buyer_user_distinction: GroundedBlockSchema,
  current_state: GroundedBlockSchema,
  pain_points: z.array(GroundedItemSchema).default([]),
  negative_consequences: GroundedBlockSchema,
  required_capabilities: GroundedBlockSchema,
  differentiated_value: GroundedBlockSchema,
  business_outcomes: GroundedBlockSchema,
  proof_points: z.array(GroundedItemSchema).default([]),
  objections_risk_areas: z.array(ObjectionSchema).default([]),
  positioning_summary: GroundedBlockSchema,
  message_pillars: z.array(MessagePillarSchema).default([]),

  // Explicit MEDDIC layer
  meddic: MeddicSectionsSchema,

  // Honesty layer: what the model assumed, and what is still missing.
  assumptions: z.array(z.string()).default([]),
  missing_inputs: z.array(z.string()).default([]),
});
export type MessagingFoundation = z.infer<typeof MessagingFoundationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Section labels for UI rendering. Keyed to the single-block sections.
// ─────────────────────────────────────────────────────────────────────────────
export const FOUNDATION_SECTION_LABELS: Record<string, string> = {
  product_summary: "Product Summary",
  icp_target_buyer: "ICP / Target Buyer",
  buyer_user_distinction: "Buyer vs. User",
  current_state: "Current State",
  negative_consequences: "Negative Consequences",
  required_capabilities: "Required Capabilities",
  differentiated_value: "Differentiated Value",
  business_outcomes: "Business Outcomes",
  positioning_summary: "Positioning Summary",
};

export const MEDDIC_SECTION_LABELS: Record<keyof MeddicSections, string> = {
  metrics: "Metrics",
  economic_buyer: "Economic Buyer",
  decision_criteria: "Decision Criteria",
  decision_process: "Decision Process",
  identify_pain: "Identify Pain",
  champion: "Champion",
};

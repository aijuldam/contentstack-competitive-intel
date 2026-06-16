// Activation event logger — tracks milestone progression to Supabase
// PostHog tracking will be added in Phase 2

export type ActivationEventType =
  | "project_created"
  | "narrative_generated"
  | "asset_opened";

export interface ActivationEvent {
  user_id: string;
  project_id: string;
  event_type: ActivationEventType;
  asset_type?: string;
}

// TODO: replace with Supabase client call
export async function logActivationEvent(event: ActivationEvent): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log("[activation]", event);
  }
  // supabase.from('activation_events').insert(event)
}

export function isActivationMilestoneReached(events: ActivationEvent[]): boolean {
  const types = new Set(events.map((e) => e.event_type));
  return (
    types.has("project_created") &&
    types.has("narrative_generated") &&
    types.has("asset_opened")
  );
}

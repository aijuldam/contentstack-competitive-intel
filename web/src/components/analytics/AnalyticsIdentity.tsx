"use client";

import { useEffect } from "react";
import { identify, group } from "@/lib/analytics/client";

interface Props {
  userId: string;
  workspaceId: string;
  plan: string;
  companyName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AnalyticsIdentity
//
// Identifies the current user and their workspace on every authenticated
// app session. Mount once in the authenticated app layout.
//
// Fires identify() + group() on mount so all subsequent client-side events
// are attributed to the correct user and workspace.
// ─────────────────────────────────────────────────────────────────────────────
export function AnalyticsIdentity({ userId, workspaceId, plan, companyName }: Props) {
  useEffect(() => {
    identify(userId, {
      plan,
      workspace_id: workspaceId,
      company_name: companyName,
    });
    group("workspace", workspaceId, {
      plan,
      company_name: companyName,
    });
  // Intentionally only on mount — userId won't change mid-session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

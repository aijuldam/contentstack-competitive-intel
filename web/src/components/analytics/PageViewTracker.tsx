"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/client";
import type { EventProperties } from "@/lib/analytics/properties";

interface Props {
  /** Fixed event name from E (see lib/analytics/events.ts) */
  event: string;
  properties?: EventProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
// PageViewTracker
//
// Fires a client-side analytics event on component mount.
// Use at the bottom of Server Component pages to emit a page view without
// converting the whole page to a client component.
//
// Example:
//   <PageViewTracker event={E.PRICING_PAGE_VIEWED} properties={{ plan }} />
// ─────────────────────────────────────────────────────────────────────────────
export function PageViewTracker({ event, properties }: Props) {
  useEffect(() => {
    track(event, properties);
  // Properties identity isn't stable across renders — we only want mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

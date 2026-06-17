"use client";

import Link from "next/link";
import { track } from "@/lib/analytics/client";
import { Button } from "@/components/ui/button";
import type { EventProperties } from "@/lib/analytics/properties";
import { cn } from "@/lib/utils/cn";

interface TrackedCtaProps {
  label: string;
  href: string;
  /** Fixed event name from E (see lib/analytics/events.ts) */
  event: string;
  properties?: EventProperties;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TrackedCta
//
// A link button that fires an analytics event on click before navigating.
// Use for acquisition CTAs (pricing page, upgrade prompts) where the click
// itself is a meaningful analytics signal.
// ─────────────────────────────────────────────────────────────────────────────
export function TrackedCta({
  label,
  href,
  event,
  properties,
  variant = "default",
  size = "default",
  className,
}: TrackedCtaProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => track(event, properties)}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

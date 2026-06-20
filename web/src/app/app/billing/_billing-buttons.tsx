"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startCheckoutAction, openPortalAction } from "./_actions";

function CheckoutSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" />
      )}
      {pending ? "Redirecting to Stripe…" : "Start for €5/month"}
    </Button>
  );
}

export function CheckoutButton() {
  return (
    <form action={startCheckoutAction}>
      <CheckoutSubmit />
    </form>
  );
}

function PortalSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" variant="outline" type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <ExternalLink className="h-3.5 w-3.5" />
      )}
      {pending ? "Opening portal…" : "Manage subscription"}
    </Button>
  );
}

export function ManageSubscriptionButton() {
  return (
    <form action={openPortalAction}>
      <PortalSubmit />
    </form>
  );
}

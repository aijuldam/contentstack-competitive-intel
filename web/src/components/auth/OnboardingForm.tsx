"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createWorkspace, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      {pending ? "Creating workspace…" : "Create workspace →"}
    </Button>
  );
}

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [state, formAction] = useFormState(createWorkspace, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Workspace name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={defaultName}
          placeholder="My company"
          autoFocus
          required
        />
        {state.fieldErrors?.name && (
          <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
        )}
        <p className="text-xs text-muted-foreground">
          This is the name shown in your sidebar. It can be your company name or team name.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}

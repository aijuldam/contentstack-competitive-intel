"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signUp, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      Create account
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signUp, initialState);

  if (state.success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl">
          ✓
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{state.success}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {/* First + Last name — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Alex"
              autoComplete="given-name"
              required
            />
            {state.fieldErrors?.first_name && (
              <p className="text-xs text-destructive">{state.fieldErrors.first_name[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Chen"
              autoComplete="family-name"
              required
            />
            {state.fieldErrors?.last_name && (
              <p className="text-xs text-destructive">{state.fieldErrors.last_name[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          {state.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company_name">Company name</Label>
          <Input
            id="company_name"
            name="company_name"
            type="text"
            placeholder="Acme Inc."
            autoComplete="organization"
            required
          />
          {state.fieldErrors?.company_name && (
            <p className="text-xs text-destructive">{state.fieldErrors.company_name[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
          />
          {state.fieldErrors?.password && (
            <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm_password">Confirm password</Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            required
          />
          {state.fieldErrors?.confirm_password && (
            <p className="text-xs text-destructive">{state.fieldErrors.confirm_password[0]}</p>
          )}
        </div>

        <SubmitButton />
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

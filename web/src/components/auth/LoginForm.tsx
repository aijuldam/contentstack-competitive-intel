"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, type AuthState } from "@/lib/auth/actions";
import { isWorkEmail } from "@/lib/utils/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      Sign in
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(signIn, initialState);
  const [emailDomainError, setEmailDomainError] = useState<string | null>(null);

  function handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val && !isWorkEmail(val)) {
      setEmailDomainError("Please use your work email address.");
    } else {
      setEmailDomainError(null);
    }
  }

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@yourcompany.com"
            autoComplete="email"
            onBlur={handleEmailBlur}
            required
          />
          {(emailDomainError ?? state.fieldErrors?.email?.[0]) && (
            <p className="text-xs text-destructive">
              {emailDomainError ?? state.fieldErrors?.email?.[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          {state.fieldErrors?.password && (
            <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <SubmitButton />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}

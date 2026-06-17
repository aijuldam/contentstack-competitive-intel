"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[app error]", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Unexpected error</h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Try again, or go back to a safe page.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/app/projects">Go to projects</Link>
        </Button>
      </div>
    </div>
  );
}

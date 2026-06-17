"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[app error]", error);
    }
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mb-2 text-lg font-semibold">Unexpected error</h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        An error occurred loading this page. Try again, or go back to your projects.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={reset}>Try again</Button>
        <Button size="sm" variant="outline" asChild>
          <Link href="/app/projects">Back to projects</Link>
        </Button>
      </div>
    </div>
  );
}

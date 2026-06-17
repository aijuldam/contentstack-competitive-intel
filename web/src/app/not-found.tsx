"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        This page doesn't exist or may have been moved.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/app/projects">Go to projects</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

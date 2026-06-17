"use client";

import { useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateFoundationAction } from "./_actions";

export function GenerateFoundationButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => generateFoundationAction(projectId))}
    >
      {isPending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-3.5 w-3.5" />
          Generate Foundation
        </>
      )}
    </Button>
  );
}

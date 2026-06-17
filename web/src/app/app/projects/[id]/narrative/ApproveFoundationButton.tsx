"use client";

import { useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveFoundationAction } from "./_actions";

interface Props {
  narrativeVersionId: string;
  projectId: string;
}

export function ApproveFoundationButton({ narrativeVersionId, projectId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(() => approveFoundationAction(narrativeVersionId, projectId))
      }
    >
      {isPending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Approving...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approve Foundation
        </>
      )}
    </Button>
  );
}

import type { Metadata } from "next";
import { History } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Versions" };

export default function VersionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold">Narrative versions</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Previous versions of the canonical narrative are kept here.
        </p>
      </div>

      <EmptyState
        icon={History}
        title="Version history coming in Phase 2"
        description="Once the canonical narrative has been edited and saved multiple times, previous versions will appear here."
      />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PitchDeckRenderer } from "@/components/renderers/PitchDeckRenderer";
import { renderPitchDeck } from "@/lib/renderers";
import { MOCK_PITCH_DECK_SECTIONS, MOCK_RENDER_CONTEXT } from "@/lib/renderers/mock-data";

export const metadata: Metadata = { title: "Pitch Deck Preview" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PitchDeckPreviewPage({ params }: PageProps) {
  const { id } = await params;
  const output = renderPitchDeck(MOCK_PITCH_DECK_SECTIONS, MOCK_RENDER_CONTEXT);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" asChild className="-ml-2">
            <Link href={`/app/projects/${id}/assets/pitch-deck`}>
              <ChevronLeft className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Pitch Deck Preview</span>
          <Badge variant="active">v{MOCK_RENDER_CONTEXT.versionNumber}</Badge>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/app/projects/${id}/exports`}>
            <ExternalLink className="h-3.5 w-3.5" />
            Export
          </Link>
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <PitchDeckRenderer output={output} className="h-full" />
      </div>
    </div>
  );
}

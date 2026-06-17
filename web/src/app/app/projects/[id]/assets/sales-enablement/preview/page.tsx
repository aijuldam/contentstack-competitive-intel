import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalesDeckRenderer } from "@/components/renderers/SalesDeckRenderer";
import { renderSalesDeck } from "@/lib/renderers";
import { MOCK_SALES_DECK_SECTIONS, MOCK_RENDER_CONTEXT } from "@/lib/renderers/mock-data";

export const metadata: Metadata = { title: "Sales Enablement Deck Preview" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SalesDeckPreviewPage({ params }: PageProps) {
  const { id } = await params;
  const output = renderSalesDeck(MOCK_SALES_DECK_SECTIONS, MOCK_RENDER_CONTEXT);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" asChild className="-ml-2">
            <Link href={`/app/projects/${id}/assets/sales-enablement`}>
              <ChevronLeft className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Sales Enablement Deck Preview</span>
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
        <SalesDeckRenderer output={output} className="h-full" />
      </div>
    </div>
  );
}

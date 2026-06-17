import Link from "next/link";
import { FileDown, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type AssetType = "pitch_deck" | "one_pager" | "sales_deck";

const SLUG: Record<AssetType, string> = {
  pitch_deck: "pitch-deck",
  one_pager: "one-pager",
  sales_deck: "sales-enablement",
};

interface ExportScaffoldProps {
  assetType: AssetType;
  projectId: string;
}

export function ExportScaffold({ assetType, projectId }: ExportScaffoldProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Button size="sm" variant="outline" asChild>
        <Link href={`/app/projects/${projectId}/assets/${SLUG[assetType]}/preview`}>
          <FileDown className="h-3.5 w-3.5" />
          Preview
        </Link>
      </Button>
      <Button size="sm" variant="outline" asChild>
        <Link href={`/app/projects/${projectId}/exports`}>
          <FileType2 className="h-3.5 w-3.5" />
          Export
        </Link>
      </Button>
    </div>
  );
}

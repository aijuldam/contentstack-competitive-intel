import { FileDown, FileType2, PresentationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type AssetType = "pitch_deck" | "one_pager" | "sales_deck";

interface ExportOption {
  label: string;
  format: string;
  Icon: typeof FileDown;
}

const EXPORT_OPTIONS: Record<AssetType, ExportOption[]> = {
  pitch_deck: [
    { label: "PPTX", format: "pptx", Icon: PresentationIcon },
    { label: "PDF", format: "pdf", Icon: FileType2 },
    { label: "HTML", format: "html", Icon: FileDown },
  ],
  one_pager: [
    { label: "PDF", format: "pdf", Icon: FileType2 },
    { label: "HTML", format: "html", Icon: FileDown },
  ],
  sales_deck: [
    { label: "PDF", format: "pdf", Icon: FileType2 },
    { label: "PPTX", format: "pptx", Icon: PresentationIcon },
    { label: "HTML", format: "html", Icon: FileDown },
  ],
};

interface ExportScaffoldProps {
  assetType: AssetType;
}

export function ExportScaffold({ assetType }: ExportScaffoldProps) {
  const options = EXPORT_OPTIONS[assetType];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Export:</span>
      {options.map((opt) => (
        <Button
          key={opt.format}
          size="sm"
          variant="outline"
          disabled
          title="Export coming soon"
          className="gap-1.5"
        >
          <opt.Icon className="h-3.5 w-3.5" />
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

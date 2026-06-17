import type { Metadata } from "next";
import Link from "next/link";
import {
  FileDown,
  FileType2,
  Presentation,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Exports" };

type ExportStatus = "queued" | "processing" | "completed" | "failed";
type ExportFormat = "html" | "pdf" | "pptx";
type AssetType = "pitch_deck" | "one_pager" | "sales_deck";

interface MockJob {
  id: string;
  assetType: AssetType;
  assetLabel: string;
  format: ExportFormat;
  status: ExportStatus;
  versionNumber: number;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  downloadUrl: string | null;
}

const MOCK_JOBS: MockJob[] = [
  {
    id: "exp-001",
    assetType: "pitch_deck",
    assetLabel: "Pitch Deck",
    format: "html",
    status: "completed",
    versionNumber: 2,
    createdAt: "Jun 14, 2026 · 3:42 pm",
    completedAt: "Jun 14, 2026 · 3:42 pm",
    errorMessage: null,
    downloadUrl: "#stub-download",
  },
  {
    id: "exp-002",
    assetType: "one_pager",
    assetLabel: "One-Pager",
    format: "pdf",
    status: "failed",
    versionNumber: 1,
    createdAt: "Jun 13, 2026 · 11:05 am",
    completedAt: null,
    errorMessage: "PDF export is not yet available. Check back soon.",
    downloadUrl: null,
  },
  {
    id: "exp-003",
    assetType: "sales_deck",
    assetLabel: "Sales Enablement Deck",
    format: "html",
    status: "queued",
    versionNumber: 1,
    createdAt: "Jun 15, 2026 · 9:00 am",
    completedAt: null,
    errorMessage: null,
    downloadUrl: null,
  },
];

const ASSET_SLUG: Record<AssetType, string> = {
  pitch_deck: "pitch-deck",
  one_pager: "one-pager",
  sales_deck: "sales-enablement",
};

const FORMAT_ICONS: Record<ExportFormat, typeof FileDown> = {
  html: FileDown,
  pdf: FileType2,
  pptx: Presentation,
};

function ExportStatusBadge({ status }: { status: ExportStatus }) {
  switch (status) {
    case "queued":
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Queued</Badge>;
    case "processing":
      return <Badge variant="default" className="gap-1"><Loader2 className="h-3 w-3 animate-spin" />Processing</Badge>;
    case "completed":
      return <Badge variant="verified" className="gap-1"><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
    case "failed":
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Failed</Badge>;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExportsPage({ params }: PageProps) {
  const { id } = await params;

  const byAsset = MOCK_JOBS.reduce<Record<string, MockJob[]>>((acc, job) => {
    if (!acc[job.assetType]) acc[job.assetType] = [];
    acc[job.assetType].push(job);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">Exports</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Export history for this project. HTML is available now; PDF and PPTX are coming soon.
        </p>
      </div>

      {/* Format availability strip */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {(["html", "pdf", "pptx"] as ExportFormat[]).map((fmt) => {
          const Icon = FORMAT_ICONS[fmt];
          const available = fmt === "html";
          return (
            <div
              key={fmt}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <Icon className={`h-4 w-4 ${available ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide">{fmt}</p>
                <p className="text-2xs text-muted-foreground">
                  {available ? "Available" : "Coming soon"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Jobs grouped by asset type */}
      {Object.entries(byAsset).map(([assetType, jobs]) => {
        const slug = ASSET_SLUG[assetType as AssetType];
        return (
          <section key={assetType} className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold">{jobs[0].assetLabel}</h3>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/app/projects/${id}/assets/${slug}`}>
                  Open workspace
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {jobs.map((job) => {
                  const Icon = FORMAT_ICONS[job.format];
                  return (
                    <div key={job.id} className="flex items-start gap-3 px-4 py-3.5">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium uppercase">{job.format}</span>
                          <ExportStatusBadge status={job.status} />
                          <span className="text-xs text-muted-foreground">v{job.versionNumber}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{job.createdAt}</p>
                        {job.errorMessage && (
                          <p className="mt-1 text-xs text-destructive">{job.errorMessage}</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {job.status === "completed" && job.downloadUrl ? (
                          <Button size="sm" variant="outline" asChild>
                            <a href={job.downloadUrl} download>
                              <FileDown className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </Button>
                        ) : job.status === "failed" ? (
                          <Button size="sm" variant="outline" disabled>
                            Retry
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        );
      })}
    </div>
  );
}

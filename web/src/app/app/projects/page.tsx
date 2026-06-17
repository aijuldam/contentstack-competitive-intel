import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { getProjectsByWorkspace } from "@/lib/db/queries/projects";
import { formatDistanceToNow } from "@/lib/utils/date";
import { canCreateProject } from "@/lib/billing/entitlements";
import { UpgradePrompt } from "@/components/billing/UpgradePrompt";
import type { Project } from "@/lib/db/types";

export const metadata: Metadata = { title: "Projects" };

const statusConfig: Record<
  Project["status"],
  { label: string; variant: "active" | "draft" | "secondary" }
> = {
  draft:    { label: "Draft",    variant: "draft"    },
  active:   { label: "Active",   variant: "active"   },
  archived: { label: "Archived", variant: "secondary" },
};

export default async function ProjectsPage() {
  const { workspace } = await requireAuthAndWorkspace();
  const supabase = await createClient();
  const projects = await getProjectsByWorkspace(supabase, workspace.id);
  const canCreate = canCreateProject(workspace);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Projects"
        description="Each project holds a canonical narrative and all derived assets."
        actions={
          canCreate ? (
            <Button size="sm" asChild>
              <Link href="/app/projects/new">
                <Plus className="h-3.5 w-3.5" />
                New project
              </Link>
            </Button>
          ) : null
        }
        className="mb-6"
      />

      {!canCreate && (
        <UpgradePrompt
          feature="Create a project to generate GTM assets"
          benefit="The full workflow — intake, Messaging Foundation, pitch deck, one-pager, and sales deck — is available on the Go-to-Market Taste plan at €5/month."
          className="mb-6"
        />
      )}

      {canCreate && projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <FolderOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="mb-1 text-sm font-medium">No projects yet</p>
          <p className="mb-4 text-xs text-muted-foreground">
            Create your first project to generate a canonical narrative and all your assets.
          </p>
          <Button size="sm" asChild>
            <Link href="/app/projects/new">
              <Plus className="h-3.5 w-3.5" />
              Create your first project
            </Link>
          </Button>
        </div>
      ) : canCreate && projects.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}/overview`}
              >
                <Card hover>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm">{project.name}</CardTitle>
                      <Badge variant={status.variant} className="shrink-0">
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(project.updated_at)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

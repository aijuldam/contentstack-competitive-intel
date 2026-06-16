import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { createClient } from "@/lib/db/server";
import { getProjectsByWorkspace } from "@/lib/db/queries/projects";
import { formatDistanceToNow } from "@/lib/utils/date";
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
  const supabase = createClient();
  const projects = await getProjectsByWorkspace(supabase, workspace.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Projects"
        description="Each project holds a canonical narrative and all derived assets."
        actions={
          <Button size="sm" asChild>
            <Link href="/app/projects/new">
              <Plus className="h-3.5 w-3.5" />
              New project
            </Link>
          </Button>
        }
        className="mb-6"
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first project to generate a canonical narrative and all your assets."
          action={{ label: "Create your first project", href: "/app/projects/new" }}
        />
      ) : (
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
      )}
    </div>
  );
}

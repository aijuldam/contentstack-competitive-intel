import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "Projects",
};

// TODO: replace with real data from Supabase
const MOCK_PROJECTS = [
  {
    id: "proj_01",
    name: "Acme RevOps Platform",
    category: "Revenue Operations",
    narrativeStatus: "complete" as const,
    assetsGenerated: 2,
    updatedAt: "2 hours ago",
  },
  {
    id: "proj_02",
    name: "Focal AI",
    category: "AI-assisted QA",
    narrativeStatus: "draft" as const,
    assetsGenerated: 0,
    updatedAt: "Yesterday",
  },
];

const statusBadgeMap = {
  complete: { label: "Narrative ready", variant: "active" as const },
  draft: { label: "In progress", variant: "draft" as const },
};

export default function ProjectsPage() {
  const isEmpty = false; // flip to true to preview empty state

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

      {isEmpty ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first project to generate a canonical narrative and all your assets."
          action={{ label: "Create project", href: "/app/projects/new" }}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_PROJECTS.map((project) => {
            const badge = statusBadgeMap[project.narrativeStatus];
            return (
              <Link key={project.id} href={`/app/projects/${project.id}/overview`}>
                <Card hover>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="label-xs mb-1">{project.category}</p>
                        <CardTitle>{project.name}</CardTitle>
                      </div>
                      <Badge variant={badge.variant} className="shrink-0">
                        {badge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.assetsGenerated} asset{project.assetsGenerated !== 1 ? "s" : ""} generated</span>
                      <span>Updated {project.updatedAt}</span>
                    </div>
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

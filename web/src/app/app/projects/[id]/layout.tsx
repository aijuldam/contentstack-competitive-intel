import { ProjectNav } from "@/components/app/ProjectNav";
import { createClient } from "@/lib/db/server";
import { getProjectById } from "@/lib/db/queries/projects";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params;
  const client = await createClient();
  const project = await getProjectById(client, id);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-background px-4 pt-5 sm:px-6">
        <p className="label-xs mb-1">Project</p>
        <h1 className="mb-3 text-base font-semibold text-foreground">
          {project?.name ?? "Untitled project"}
        </h1>
        <ProjectNav projectId={id} />
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

import { ProjectNav } from "@/components/app/ProjectNav";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params;
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-background px-4 pt-5 sm:px-6">
        <p className="label-xs mb-1">Project</p>
        <h1 className="mb-3 text-base font-semibold text-foreground">
          {/* TODO: replace with real project name */}
          Acme RevOps Platform
        </h1>
        <ProjectNav projectId={id} />
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

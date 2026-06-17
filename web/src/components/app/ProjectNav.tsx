"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface ProjectNavProps {
  projectId: string;
}

const tabs = [
  { label: "Overview", path: "overview" },
  { label: "Inputs", path: "inputs" },
  { label: "Narrative", path: "narrative" },
  { label: "Assets", path: "assets" },
  { label: "Exports", path: "exports" },
  { label: "Versions", path: "versions" },
];

export function ProjectNav({ projectId }: ProjectNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-0 border-b border-border overflow-x-auto">
      {tabs.map((tab) => {
        const href = `/app/projects/${projectId}/${tab.path}`;
        const isActive = pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "relative flex h-10 shrink-0 items-center px-4 text-sm transition-colors",
              isActive
                ? "text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

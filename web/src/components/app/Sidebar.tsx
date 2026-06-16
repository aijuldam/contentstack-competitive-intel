"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  CreditCard,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    label: "Projects",
    href: "/app/projects",
    icon: FolderOpen,
  },
  {
    label: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
    exact: true,
  },
];

const bottomItems = [
  { label: "Settings", href: "/app/settings", icon: Settings },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-56 shrink-0 flex-col border-r border-border bg-background",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/app">
          <Logo size="sm" />
        </Link>
      </div>

      {/* New project CTA */}
      <div className="p-3">
        <Button size="sm" className="w-full justify-start gap-2" asChild>
          <Link href="/app/projects/new">
            <Plus className="h-3.5 w-3.5" />
            New project
          </Link>
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              isActive(item.href, item.exact)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {isActive(item.href, item.exact) && (
              <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-border px-2 py-2">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              isActive(item.href)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* User stub */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xs font-semibold text-primary">
            U
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">User</p>
            <p className="truncate text-2xs text-muted-foreground">
              user@company.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

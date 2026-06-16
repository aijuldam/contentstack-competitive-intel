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
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { signOut } from "@/lib/auth/actions";
import type { Workspace } from "@/lib/db/types";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Projects", href: "/app/projects", icon: FolderOpen },
  { label: "Dashboard", href: "/app", icon: LayoutDashboard, exact: true },
];

const bottomItems = [
  { label: "Settings", href: "/app/settings", icon: Settings },
  { label: "Billing",  href: "/app/billing",  icon: CreditCard },
];

interface SidebarProps {
  className?: string;
  user: User;
  workspace: Workspace;
}

export function Sidebar({ className, user, workspace }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const userInitials = (user.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <aside
      className={cn(
        "flex h-full w-56 shrink-0 flex-col border-r border-border bg-background",
        className
      )}
    >
      {/* Logo + workspace name */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Link href="/app" className="flex min-w-0 items-center gap-2">
          <Logo size="sm" variant="mark" />
          <span className="truncate text-sm font-medium text-foreground">
            {workspace.name}
          </span>
        </Link>
      </div>

      {/* New project */}
      <div className="p-3">
        <Button size="sm" className="w-full justify-start gap-2" asChild>
          <Link href="/app/projects/new">
            <Plus className="h-3.5 w-3.5" />
            New project
          </Link>
        </Button>
      </div>

      {/* Primary nav */}
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

      {/* User + sign out */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xs font-semibold text-primary">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {(user.user_metadata?.full_name as string | undefined) ?? "Account"}
            </p>
            <p className="truncate text-2xs text-muted-foreground">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title="Sign out"
              className="flex items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

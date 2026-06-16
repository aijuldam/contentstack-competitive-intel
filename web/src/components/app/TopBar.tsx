"use client";

import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils/cn";

interface TopBarProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function TopBar({ onMenuToggle, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center border-b border-border bg-background px-4",
        className
      )}
    >
      <button
        className="mr-3 flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground md:hidden"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="md:hidden">
        <Logo size="sm" />
      </div>
    </header>
  );
}

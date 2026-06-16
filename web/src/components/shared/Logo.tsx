import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mark";
}

const sizes = {
  sm: { mark: "h-5 w-5", text: "text-sm" },
  md: { mark: "h-6 w-6", text: "text-base" },
  lg: { mark: "h-8 w-8", text: "text-xl" },
};

export function Logo({ className, size = "md", variant = "full" }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shrink-0",
          s.mark
        )}
        aria-hidden="true"
      >
        <span className="text-[10px] font-black tracking-tight">NK</span>
      </div>
      {variant === "full" && (
        <span className={cn("font-semibold tracking-tight text-foreground", s.text)}>
          NarrativeKit
        </span>
      )}
    </div>
  );
}

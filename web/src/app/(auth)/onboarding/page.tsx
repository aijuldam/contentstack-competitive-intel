import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { getUserWorkspace } from "@/lib/auth/helpers";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = { title: "Set up your workspace" };

export default async function OnboardingPage() {
  const user = await requireAuth();

  // Already has a workspace — send to app
  const workspace = await getUserWorkspace();
  if (workspace) redirect("/app/projects");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8 flex justify-center">
        <Logo size="md" />
      </div>
      <div className="rounded-lg border border-border bg-background p-8 shadow-card">
        <h1 className="mb-1 text-xl font-semibold tracking-tight">
          Welcome, {firstName}.
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Create a workspace to hold your projects and assets. You can rename it
          any time.
        </p>
        <OnboardingForm defaultName={`${firstName}'s workspace`} />
      </div>
    </div>
  );
}

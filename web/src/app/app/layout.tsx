import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { AppShell } from "@/components/app/AppShell";
import { AnalyticsIdentity } from "@/components/analytics/AnalyticsIdentity";
import { getPlanForWorkspace } from "@/lib/billing/plans";

// Server Component — validates auth and workspace before rendering the shell.
// Unauthenticated → redirects to /login (via requireAuth)
// No workspace → redirects to /onboarding (via requireAuthAndWorkspace)
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, workspace } = await requireAuthAndWorkspace();
  const plan = getPlanForWorkspace(workspace);

  return (
    <AppShell user={user} workspace={workspace}>
      <AnalyticsIdentity
        userId={user.id}
        workspaceId={workspace.id}
        plan={plan.key}
        companyName={workspace.name}
      />
      {children}
    </AppShell>
  );
}

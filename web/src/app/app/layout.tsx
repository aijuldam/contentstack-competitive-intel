import { requireAuthAndWorkspace } from "@/lib/auth/helpers";
import { AppShell } from "@/components/app/AppShell";

// Server Component — validates auth and workspace before rendering the shell.
// Unauthenticated → redirects to /login (via requireAuth)
// No workspace → redirects to /app/onboarding (via requireAuthAndWorkspace)
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, workspace } = await requireAuthAndWorkspace();

  return (
    <AppShell user={user} workspace={workspace}>
      {children}
    </AppShell>
  );
}

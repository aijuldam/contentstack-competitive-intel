import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireAuthAndWorkspace } from "@/lib/auth/helpers";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user, workspace } = await requireAuthAndWorkspace();

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayName && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={displayName} disabled />
              <p className="text-xs text-muted-foreground">
                Name is managed through your sign-in provider.
              </p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email ?? ""} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="workspace">Workspace</Label>
            <Input id="workspace" defaultValue={workspace.name} disabled />
            <p className="text-xs text-muted-foreground">
              Workspace name changes are not yet available.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Irreversible actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all projects.
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Delete account
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Account deletion is not yet self-serve. Contact us to remove your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

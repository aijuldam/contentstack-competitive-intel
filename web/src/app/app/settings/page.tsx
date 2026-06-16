import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your name and email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: wire to Supabase user */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue="Alex Chen" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="alex@company.com" disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
          <Button size="sm">Save changes</Button>
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
            <Button variant="destructive" size="sm">Delete account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

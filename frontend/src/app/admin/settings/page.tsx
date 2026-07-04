"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LANGUAGES, APP_NAME } from "@/lib/constants";
import { toast } from "sonner";

/** Platform settings page */
export default function SettingsPage() {
  function handleSave() {
    toast.success("Settings saved (demo)");
  }

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <PageHeader title="Settings" description="Configure platform settings" />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input id="appName" defaultValue={APP_NAME} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Disable public access temporarily</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Languages</CardTitle>
              <CardDescription>Enabled content languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.code} className="flex items-center justify-between">
                  <Label>{lang.label} ({lang.code})</Label>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Storage</CardTitle>
              <CardDescription>Media storage configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Storage Type</Label>
                <Input defaultValue="local" disabled />
                <p className="text-xs text-muted-foreground">S3-compatible storage coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO Defaults</CardTitle>
              <CardDescription>Default meta tags for pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Default Meta Title</Label>
                <Input id="metaTitle" defaultValue={`${APP_NAME} — Temple & Pilgrimage Platform`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDesc">Default Meta Description</Label>
                <Input id="metaDesc" defaultValue="India's comprehensive temple and pilgrimage guide." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </>
  );
}

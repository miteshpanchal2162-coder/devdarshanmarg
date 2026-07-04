import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/settings/settings-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Backup & Maintenance",
  description: "Manage backup and maintenance placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Backup & Maintenance | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function BackupMaintenancePage() {
  return <SettingsPageContent section="backup-maintenance" />;
}

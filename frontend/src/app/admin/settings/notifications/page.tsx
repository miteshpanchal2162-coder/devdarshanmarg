import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Notification Settings",
  description: "Manage notification placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Notification Settings | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function NotificationSettingsPage() {
  return <SettingsPageContent section="notifications" />;
}

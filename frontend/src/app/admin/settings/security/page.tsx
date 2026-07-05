import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Security Settings",
  description: "Manage security settings placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Security Settings | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function SecuritySettingsPage() {
  return <SettingsPageContent section="security" />;
}

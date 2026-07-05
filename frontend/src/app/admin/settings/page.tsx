import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "General Settings",
  description: "Manage general system settings in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "General Settings | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function GeneralSettingsPage() {
  return <SettingsPageContent section="general" />;
}

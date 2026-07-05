import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Localization",
  description: "Manage localization placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Localization | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function LocalizationSettingsPage() {
  return <SettingsPageContent section="localization" />;
}

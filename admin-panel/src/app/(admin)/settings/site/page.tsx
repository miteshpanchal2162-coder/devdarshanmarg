import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/settings/settings-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Site Settings",
  description: "Manage site settings placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Site Settings | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function SiteSettingsPage() {
  return <SettingsPageContent section="site" />;
}

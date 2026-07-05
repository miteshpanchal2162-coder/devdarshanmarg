import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Email Settings",
  description: "Manage email settings placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Email Settings | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EmailSettingsPage() {
  return <SettingsPageContent section="email" />;
}

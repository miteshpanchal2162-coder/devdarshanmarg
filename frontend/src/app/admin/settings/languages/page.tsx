import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Supported Languages",
  description: "Manage supported language placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Supported Languages | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function SupportedLanguagesPage() {
  return <SettingsPageContent section="languages" />;
}

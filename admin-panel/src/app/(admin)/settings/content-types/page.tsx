import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/settings/settings-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Content Types",
  description: "Manage content type placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Content Types | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function ContentTypesPage() {
  return <SettingsPageContent section="content-types" />;
}

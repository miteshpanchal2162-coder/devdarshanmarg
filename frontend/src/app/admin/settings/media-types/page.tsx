import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Media Types",
  description: "Manage media type placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Media Types | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function MediaTypesPage() {
  return <SettingsPageContent section="media-types" />;
}

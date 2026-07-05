import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "SEO Settings",
  description: "Manage SEO settings placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "SEO Settings | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function SeoSettingsPage() {
  return <SettingsPageContent section="seo" />;
}

import type { Metadata } from "next";
import { SettingsPageContent } from "@/components/admin/settings/settings-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "About System",
  description: "View DevDarshanMarg admin system information placeholders.",
  robots: { index: false, follow: false },
  openGraph: { title: "About System | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function AboutSystemPage() {
  return <SettingsPageContent section="about" />;
}

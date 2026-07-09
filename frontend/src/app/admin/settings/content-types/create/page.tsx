import type { Metadata } from "next";
import { ReferenceDataFormPageContent } from "@/components/admin/settings/reference-data-management";
import { contentStatusesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Content Status",
  description: "Create a content status in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Create Content Status | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CreateContentStatusPage() {
  return <ReferenceDataFormPageContent config={contentStatusesConfig} mode="create" />;
}

import type { Metadata } from "next";
import { ReferenceDataFormPageContent } from "@/components/admin/settings/reference-data-management";
import { contentStatusesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Content Status",
  description: "Edit a content status in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Edit Content Status | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EditContentStatusPage() {
  return <ReferenceDataFormPageContent config={contentStatusesConfig} mode="edit" />;
}

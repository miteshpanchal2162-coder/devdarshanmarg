import type { Metadata } from "next";
import { ReferenceDataDetailsPageContent } from "@/components/admin/settings/reference-data-management";
import { contentStatusesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Content Status Details",
  description: "View content status details in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Content Status Details | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function ContentStatusDetailsPage() {
  return <ReferenceDataDetailsPageContent config={contentStatusesConfig} />;
}

import type { Metadata } from "next";
import { ReferenceDataFormPageContent } from "@/components/admin/settings/reference-data-management";
import { mediaTypesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Media Type",
  description: "Create a media type in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Create Media Type | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CreateMediaTypePage() {
  return <ReferenceDataFormPageContent config={mediaTypesConfig} mode="create" />;
}

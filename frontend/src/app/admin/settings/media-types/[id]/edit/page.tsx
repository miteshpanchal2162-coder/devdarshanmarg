import type { Metadata } from "next";
import { ReferenceDataFormPageContent } from "@/components/admin/settings/reference-data-management";
import { mediaTypesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Media Type",
  description: "Edit a media type in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Edit Media Type | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function EditMediaTypePage() {
  return <ReferenceDataFormPageContent config={mediaTypesConfig} mode="edit" />;
}

import type { Metadata } from "next";
import { ReferenceDataFormPageContent } from "@/components/admin/settings/reference-data-management";
import { languagesConfig } from "@/components/admin/settings/reference-data-configs";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Language",
  description: "Create a supported language in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "Create Language | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function CreateLanguagePage() {
  return <ReferenceDataFormPageContent config={languagesConfig} mode="create" />;
}

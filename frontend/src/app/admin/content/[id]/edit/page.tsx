import type { Metadata } from "next";
import { ContentFormPageContent } from "@/components/admin/content/content-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit Content",
  description: "Edit DevDarshanMarg content through a UI-only enterprise content form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit Content | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditContentPage() {
  return <ContentFormPageContent mode="edit" />;
}

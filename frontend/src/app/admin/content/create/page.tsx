import type { Metadata } from "next";
import { ContentFormPageContent } from "@/components/admin/content/content-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Content",
  description: "Create DevDarshanMarg content through a UI-only enterprise content form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Content | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreateContentPage() {
  return <ContentFormPageContent mode="create" />;
}

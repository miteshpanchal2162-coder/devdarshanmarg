import type { Metadata } from "next";
import { ContentListPageContent } from "@/components/content/content-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Content Engine",
  description: "Manage DevDarshanMarg content records through an enterprise content management UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Content Engine | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function ContentPage() {
  return <ContentListPageContent />;
}

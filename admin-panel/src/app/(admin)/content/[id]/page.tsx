import type { Metadata } from "next";
import { ContentDetailsPageContent } from "@/components/content/content-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Content Details",
  description: "View DevDarshanMarg content details and placeholder operational sections.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Content Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function ContentDetailsPage() {
  return <ContentDetailsPageContent />;
}

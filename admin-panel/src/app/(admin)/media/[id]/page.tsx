import type { Metadata } from "next";
import { MediaDetailsPageContent } from "@/components/media/media-library";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Media Details",
  description: "View media details and operational placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Media Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function MediaDetailsPage() {
  return <MediaDetailsPageContent />;
}

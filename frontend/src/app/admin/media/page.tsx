import type { Metadata } from "next";
import { MediaLibraryPageContent } from "@/components/admin/media/media-library";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Media Library",
  description: "Manage enterprise media assets through the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Media Library | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function MediaLibraryPage() {
  return <MediaLibraryPageContent />;
}

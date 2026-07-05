import type { Metadata } from "next";
import { UploadMediaPageContent } from "@/components/admin/media/media-library";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Upload Media",
  description: "Upload media placeholders through the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Upload Media | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function UploadMediaPage() {
  return <UploadMediaPageContent />;
}

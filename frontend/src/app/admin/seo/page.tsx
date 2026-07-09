import type { Metadata } from "next";
import { SeoManagementPageContent } from "@/components/admin/seo/seo-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "SEO Management",
  description: "Manage SEO redirects and landing pages in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: { title: "SEO Management | DevDarshanMarg Admin", description: siteConfig.description },
};

export default function SeoPage() {
  return <SeoManagementPageContent />;
}

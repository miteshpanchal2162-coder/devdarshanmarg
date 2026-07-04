import type { Metadata } from "next";
import { TempleFormPageContent } from "@/components/temples/temple-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create Temple",
  description: "Create a temple record through a UI-only enterprise temple form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Temple | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreateTemplePage() {
  return <TempleFormPageContent mode="create" />;
}

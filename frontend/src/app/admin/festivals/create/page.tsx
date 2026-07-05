import type { Metadata } from "next";
import { FestivalFormPageContent } from "@/components/admin/festivals/festival-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create Festival",
  description: "Create a festival record through a UI-only enterprise festival form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Festival | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreateFestivalPage() {
  return <FestivalFormPageContent mode="create" />;
}

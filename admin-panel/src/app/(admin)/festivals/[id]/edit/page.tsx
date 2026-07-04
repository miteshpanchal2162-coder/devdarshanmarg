import type { Metadata } from "next";
import { FestivalFormPageContent } from "@/components/festivals/festival-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Edit Festival",
  description: "Edit a festival record through a UI-only enterprise festival form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit Festival | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditFestivalPage() {
  return <FestivalFormPageContent mode="edit" />;
}

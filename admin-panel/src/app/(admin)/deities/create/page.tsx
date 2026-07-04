import type { Metadata } from "next";
import { DeityFormPageContent } from "@/components/deities/deity-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Create Deity",
  description: "Create a deity record through a UI-only enterprise deity form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Deity | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreateDeityPage() {
  return <DeityFormPageContent mode="create" />;
}

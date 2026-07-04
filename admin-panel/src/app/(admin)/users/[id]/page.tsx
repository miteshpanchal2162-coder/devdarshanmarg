import type { Metadata } from "next";
import { UserDetailsPageContent } from "@/components/users/user-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "User Details",
  description: "View a DevDarshanMarg admin user profile and activity placeholders.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "User Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function UserDetailsPage() {
  return <UserDetailsPageContent />;
}

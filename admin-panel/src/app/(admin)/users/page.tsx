import type { Metadata } from "next";
import { UserListPageContent } from "@/components/users/user-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage DevDarshanMarg admin users with an enterprise user management interface.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Users | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function UsersPage() {
  return <UserListPageContent />;
}

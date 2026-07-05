import type { Metadata } from "next";
import { UserFormPageContent } from "@/components/admin/users/user-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Create User",
  description: "Create a DevDarshanMarg admin user through a UI-only enterprise form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create User | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function CreateUserPage() {
  return <UserFormPageContent mode="create" />;
}

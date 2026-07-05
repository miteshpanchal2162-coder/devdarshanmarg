import type { Metadata } from "next";
import { UserFormPageContent } from "@/components/admin/users/user-management";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit a DevDarshanMarg admin user through a UI-only enterprise form.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Edit User | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function EditUserPage() {
  return <UserFormPageContent mode="edit" />;
}

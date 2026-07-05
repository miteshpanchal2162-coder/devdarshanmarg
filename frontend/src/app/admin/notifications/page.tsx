import type { Metadata } from "next";
import { NotificationsPageContent } from "@/components/admin/notifications/notifications-center";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Manage notification drafts, schedules, and delivery placeholders in the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Notifications | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function NotificationsPage() {
  return <NotificationsPageContent />;
}

import type { Metadata } from "next";
import { NotificationDetailsPageContent } from "@/components/notifications/notifications-center";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Notification Details",
  description: "View notification overview, recipient, delivery, and history placeholders.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Notification Details | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function NotificationDetailsPage() {
  return <NotificationDetailsPageContent />;
}

import type { Metadata } from "next";
import { SendNotificationPageContent } from "@/components/notifications/notifications-center";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Send Notification",
  description: "Compose notification placeholders through the DevDarshanMarg admin UI.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Send Notification | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function SendNotificationPage() {
  return <SendNotificationPageContent />;
}

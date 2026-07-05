import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/admin/auth/auth-forms";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new DevDarshanMarg admin password through a UI-only reset flow.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Reset Password | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

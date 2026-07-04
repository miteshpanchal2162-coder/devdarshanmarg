import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request an OTP placeholder for DevDarshanMarg admin password recovery.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Forgot Password | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

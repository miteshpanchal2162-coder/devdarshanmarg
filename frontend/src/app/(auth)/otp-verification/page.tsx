import type { Metadata } from "next";
import { OtpVerificationForm } from "@/components/admin/auth/auth-forms";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "OTP Verification",
  description: "Verify a 6 digit OTP placeholder for DevDarshanMarg admin password recovery.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "OTP Verification | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function OtpVerificationPage() {
  return <OtpVerificationForm />;
}

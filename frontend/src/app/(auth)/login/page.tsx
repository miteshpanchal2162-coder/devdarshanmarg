import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/auth/auth-forms";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the DevDarshanMarg admin console.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Login | DevDarshanMarg Admin",
    description: siteConfig.description,
  },
};

export default function LoginPage() {
  return <LoginForm />;
}

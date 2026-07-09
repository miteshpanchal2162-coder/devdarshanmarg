import type { Metadata } from "next";
import { PublicShell } from "@/components/public/layout/public-shell";

export const metadata: Metadata = {
  title: "Explore",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}

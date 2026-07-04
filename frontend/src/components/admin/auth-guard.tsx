"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/lib/api";

/** Protect admin routes — redirect to login if no token */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token && !pathname.includes("/admin/login")) {
      router.replace("/admin/login");
    }
  }, [router, pathname]);

  return <>{children}</>;
}

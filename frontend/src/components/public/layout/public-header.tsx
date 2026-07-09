"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicNav, publicSiteConfig } from "@/constants/public-site";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link className="text-xl font-bold text-primary" href="/">
          {publicSiteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <Link
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted",
                pathname.startsWith(item.href) && "bg-primary/10 text-primary",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button render={<Link href="/search" />} size="icon-sm" variant="ghost">
            <Search />
          </Button>
          {user ? (
            <Button render={<Link href="/account" />} leftIcon={<UserRound />} size="sm" variant="outline">
              Account
            </Button>
          ) : (
            <Button render={<Link href="/sign-in" />} size="sm">
              Sign In
            </Button>
          )}
          <Button className="md:hidden" onClick={() => setOpen((value) => !value)} size="icon-sm" variant="ghost">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="border-t px-4 py-3 md:hidden">
          <div className="grid gap-1">
            {publicNav.map((item) => (
              <Link className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accountNav } from "@/constants/public-site";
import { useAuthProfile, useMeProfile } from "@/hooks/queries/use-me";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { getString } from "@/utils/record-helpers";

export function AccountShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) router.replace("/sign-in?next=" + encodeURIComponent(pathname));
  }, [accessToken, pathname, router]);

  if (!accessToken) {
    return <div className="px-4 py-10 text-sm text-muted-foreground">Redirecting to sign in...</div>;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Account</p>
        <nav className="grid gap-1">
          {accountNav.map((item) => (
            <Link
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted",
                pathname === item.href && "bg-primary/10 text-primary",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export function AccountProfileSummary() {
  const { data: authProfile, isLoading, isError, error, refetch } = useAuthProfile();
  const { data: meProfile } = useMeProfile();

  return (
    <AsyncQueryBoundary error={error} isError={isError} isLoading={isLoading} loadingLabel="Loading profile..." onRetry={() => refetch()}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Name: {getString(authProfile ?? {}, "fullName")}</p>
            <p>Email: {getString(authProfile ?? {}, "email")}</p>
            <p>Mobile: {getString(authProfile ?? {}, "mobile")}</p>
            <p>Role: {getString(authProfile ?? {}, "role")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Extended Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Bio: {getString(meProfile ?? {}, "bio", "—")}</p>
            <p>Address: {getString(meProfile ?? {}, "address", "—")}</p>
            <p>Postal code: {getString(meProfile ?? {}, "postalCode", "—")}</p>
          </CardContent>
        </Card>
      </div>
    </AsyncQueryBoundary>
  );
}

export function AccountListPage({
  title,
  useList,
  renderItem,
}: {
  title: string;
  useList: () => {
    data?: { items: Record<string, unknown>[] };
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
  };
  renderItem: (item: Record<string, unknown>) => React.ReactNode;
}) {
  const query = useList();

  return (
    <AccountShell title={title}>
      <AsyncQueryBoundary
        error={query.error}
        isError={query.isError}
        isLoading={query.isLoading}
        loadingLabel={`Loading ${title.toLowerCase()}...`}
        onRetry={() => query.refetch()}
      >
        <div className="space-y-3">
          {(query.data?.items ?? []).length === 0 ? (
            <p className="text-muted-foreground">No records found in your account.</p>
          ) : (
            query.data?.items.map((item) => <Card key={getString(item, "id")}><CardContent className="py-4">{renderItem(item)}</CardContent></Card>)
          )}
        </div>
      </AsyncQueryBoundary>
    </AccountShell>
  );
}

export function AccountLogoutButton() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <Button
      onClick={() => {
        clearSession();
        router.push("/");
      }}
      variant="outline"
    >
      Sign Out
    </Button>
  );
}

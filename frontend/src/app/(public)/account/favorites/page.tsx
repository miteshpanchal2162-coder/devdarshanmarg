"use client";

import { AccountListPage } from "@/components/public/account/account-shell";
import { useMeFavorites } from "@/hooks/queries/use-me";
import { getString } from "@/utils/record-helpers";

export default function AccountFavoritesPage() {
  return (
    <AccountListPage
      renderItem={(item) => (
        <div className="text-sm">
          <p className="font-medium">{getString(item, "entityType")}</p>
          <p className="text-muted-foreground">Entity ID: {getString(item, "entityId")}</p>
        </div>
      )}
      title="Favorites"
      useList={useMeFavorites}
    />
  );
}

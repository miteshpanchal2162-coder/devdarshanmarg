"use client";

import { AccountListPage } from "@/components/public/account/account-shell";
import { useMeRatings } from "@/hooks/queries/use-me";
import { getString } from "@/utils/record-helpers";

export default function AccountRatingsPage() {
  return (
    <AccountListPage
      renderItem={(item) => (
        <div className="text-sm">
          <p className="font-medium">{getString(item, "entityType")} · {getString(item, "rating")} stars</p>
          <p className="text-muted-foreground">Entity ID: {getString(item, "entityId")}</p>
        </div>
      )}
      title="Ratings"
      useList={useMeRatings}
    />
  );
}

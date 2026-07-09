"use client";

import { AccountListPage } from "@/components/public/account/account-shell";
import { useMeComments } from "@/hooks/queries/use-me";
import { getString } from "@/utils/record-helpers";

export default function AccountCommentsPage() {
  return (
    <AccountListPage
      renderItem={(item) => (
        <div className="text-sm">
          <p className="font-medium">{getString(item, "entityType")}</p>
          <p className="text-muted-foreground">{getString(item, "comment")}</p>
        </div>
      )}
      title="Comments"
      useList={useMeComments}
    />
  );
}

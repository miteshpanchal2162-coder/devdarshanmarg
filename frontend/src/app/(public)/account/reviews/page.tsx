"use client";

import { AccountListPage } from "@/components/public/account/account-shell";
import { useMeReviews } from "@/hooks/queries/use-me";
import { getString } from "@/utils/record-helpers";

export default function AccountReviewsPage() {
  return (
    <AccountListPage
      renderItem={(item) => (
        <div className="text-sm">
          <p className="font-medium">{getString(item, "title", "Review")}</p>
          <p className="text-muted-foreground">{getString(item, "review")}</p>
        </div>
      )}
      title="Reviews"
      useList={useMeReviews}
    />
  );
}

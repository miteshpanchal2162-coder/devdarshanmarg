"use client";

import { AccountLogoutButton, AccountProfileSummary, AccountShell } from "@/components/public/account/account-shell";

export default function AccountPage() {
  return (
    <AccountShell title="My Profile">
      <AccountProfileSummary />
      <div className="mt-6">
        <AccountLogoutButton />
      </div>
    </AccountShell>
  );
}

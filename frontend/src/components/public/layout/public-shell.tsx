import { PublicFooter } from "@/components/public/layout/public-footer";
import { PublicHeader } from "@/components/public/layout/public-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="shadow-premium w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileQuestion className="h-6 w-6" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          404
        </p>
        <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href={routes.login} className={`${buttonVariants()} mt-6 inline-flex`}>
          Return to login
        </Link>
      </div>
    </div>
  );
}

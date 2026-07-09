import Link from "next/link";
import { publicSiteConfig } from "@/constants/public-site";

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-primary">{publicSiteConfig.name}</p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{publicSiteConfig.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/temples">
            Temples
          </Link>
          <Link className="hover:text-primary" href="/festivals">
            Festivals
          </Link>
          <Link className="hover:text-primary" href="/articles">
            Articles
          </Link>
          <Link className="hover:text-primary" href="/search">
            Search
          </Link>
        </div>
      </div>
    </footer>
  );
}

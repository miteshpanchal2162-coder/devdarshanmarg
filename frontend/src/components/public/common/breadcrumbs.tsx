import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li className="flex items-center gap-1" key={`${item.label}-${index}`}>
            {index > 0 ? <ChevronRight className="size-3.5 opacity-60" /> : null}
            {item.href ? (
              <Link className="hover:text-primary" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

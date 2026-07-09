"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AsyncQueryBoundary } from "@/components/common/async-query-boundary";
import { SearchBox } from "@/components/ui/enterprise";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalSearch } from "@/hooks/queries/use-public";
import { getString } from "@/utils/record-helpers";

function SearchResults() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const { data, isLoading, isError, error, refetch } = useGlobalSearch(query, query.trim().length >= 2);

  useEffect(() => setQuery(initial), [initial]);

  const sections = [
    { title: "Temples", href: "/temples", items: data?.temples.items ?? [] },
    { title: "Festivals", href: "/festivals", items: data?.festivals.items ?? [] },
    { title: "Deities", href: "/deities", items: data?.deities.items ?? [] },
    { title: "Articles", href: "/articles", items: data?.content.items ?? [] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="mt-2 text-muted-foreground">Search temples, festivals, deities, and articles from PostgreSQL.</p>
      </header>

      <SearchBox
        aria-label="Global search"
        className="mb-8 max-w-xl"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search..."
        value={query}
      />

      <AsyncQueryBoundary
        error={error}
        isError={isError}
        isLoading={isLoading}
        loadingLabel="Searching..."
        onRetry={() => refetch()}
      >
        {query.trim().length < 2 ? (
          <p className="text-muted-foreground">Enter at least 2 characters to search.</p>
        ) : (
          <div className="space-y-10">
            {sections.map((section) =>
              section.items.length ? (
                <section key={section.title}>
                  <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <Card hover key={getString(item, "id")} variant="elevated">
                        <CardContent>
                          <Link className="font-medium hover:text-primary" href={`${section.href}/${getString(item, "slug")}`}>
                            {getString(item, "displayName", getString(item, "name", getString(item, "title")))}
                          </Link>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {getString(item, "shortDescription", getString(item, "description"))}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ) : null,
            )}
          </div>
        )}
      </AsyncQueryBoundary>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}

"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState, Loader } from "@/components/ui/enterprise";

type AsyncQueryBoundaryProps = {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingLabel?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function AsyncQueryBoundary({
  isLoading,
  isError,
  error,
  isEmpty = false,
  emptyTitle = "No data available",
  emptyDescription = "Nothing to display yet.",
  loadingLabel = "Loading...",
  onRetry,
  children,
}: AsyncQueryBoundaryProps) {
  if (isLoading) {
    return <Loader label={loadingLabel} size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        description={error?.message ?? "Something went wrong while loading data."}
        onRetry={onRetry}
        title="Unable to load data"
      />
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-8 text-center shadow-soft">
        <h3 className="text-base font-semibold">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
        {onRetry ? (
          <Button className="mt-5" onClick={onRetry} type="button">
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}

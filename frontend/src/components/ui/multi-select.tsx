"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type MultiSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type MultiSelectOptionGroup = {
  label: string;
  options: MultiSelectOption[];
};

export function MultiSelect({
  options,
  groups,
  value,
  onChange,
  placeholder = "Select options",
  maxSelection,
  disabled,
  emptyText = "No options found",
  className,
}: {
  options?: MultiSelectOption[];
  groups?: MultiSelectOptionGroup[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelection?: number;
  disabled?: boolean;
  emptyText?: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const groupedOptions = useMemo(
    () => groups ?? [{ label: "", options: options ?? [] }],
    [groups, options],
  );
  const allOptions = groupedOptions.flatMap((group) => group.options);
  const selectableValues = allOptions
    .filter((option) => !option.disabled)
    .map((option) => option.value);
  const selectedOptions = allOptions.filter((option) => value.includes(option.value));
  const filteredGroups = useMemo(
    () =>
      groupedOptions
        .map((group) => ({
          ...group,
          options: group.options.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
        .filter((group) => group.options.length > 0),
    [groupedOptions, query],
  );
  const allSelected = selectableValues.length > 0 && selectableValues.every((item) => value.includes(item));

  function toggle(nextValue: string) {
    if (!value.includes(nextValue) && maxSelection && value.length >= maxSelection) {
      return;
    }

    onChange(
      value.includes(nextValue)
        ? value.filter((item) => item !== nextValue)
        : [...value, nextValue],
    );
  }

  function selectAll() {
    const nextValues = maxSelection ? selectableValues.slice(0, maxSelection) : selectableValues;
    onChange(nextValues);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label={placeholder}
        className={cn(
          "flex min-h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-1 text-left text-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          className,
        )}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.length ? (
            selectedOptions.map((option) => (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  aria-label={`Remove ${option.label}`}
                  className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggle(option.value);
                  }}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search options"
            className="h-8 w-full rounded-md bg-muted/40 pl-8 pr-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            value={query}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 border-b border-border pb-2">
          <button
            className="text-caption font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={allSelected || disabled}
            onClick={selectAll}
            type="button"
          >
            Select all
          </button>
          <button
            className="text-caption font-medium text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={!value.length || disabled}
            onClick={clearAll}
            type="button"
          >
            Clear all
          </button>
        </div>
        {maxSelection ? (
          <p className="mt-2 text-caption text-muted-foreground">
            {value.length}/{maxSelection} selected
          </p>
        ) : null}
        <div className="mt-2 max-h-64 overflow-y-auto">
          {filteredGroups.length ? (
            filteredGroups.map((group) => (
              <div key={group.label || "options"}>
                {group.label ? (
                  <p className="px-2 py-1 text-caption font-medium text-muted-foreground">
                    {group.label}
                  </p>
                ) : null}
                {group.options.map((option) => {
                  const checked = value.includes(option.value);
                  const maxReached = Boolean(maxSelection && value.length >= maxSelection && !checked);

                  return (
                    <button
                      aria-checked={checked}
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={option.disabled || maxReached || disabled}
                      key={option.value}
                      onClick={() => toggle(option.value)}
                      role="menuitemcheckbox"
                      type="button"
                    >
                      {option.label}
                      {checked ? <Check className="h-4 w-4 text-primary" /> : null}
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

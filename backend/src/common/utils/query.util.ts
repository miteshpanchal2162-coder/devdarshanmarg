import { SortDirection } from "../enums/crud.enum";

export function buildSearchFilter(search: string | undefined, fields: string[]) {
  if (!search || !fields.length) return undefined;

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    })),
  };
}

export function buildOrderBy(sortBy?: string, sortOrder?: SortDirection) {
  if (!sortBy) return undefined;
  return { [sortBy]: sortOrder ?? SortDirection.DESC };
}

export function buildStatusFilter(status?: string) {
  return status ? { status } : undefined;
}

export function buildFieldFilters(filters?: Record<string, string | number | boolean>) {
  if (!filters) return undefined;

  return Object.entries(filters).reduce<Record<string, string | number | boolean>>(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
}

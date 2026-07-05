import { NotFoundException } from "@nestjs/common";
import { ContentStatus, Status } from "@prisma/client";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../../common/services/api-response.service";
import { createPaginationMeta, getPagination } from "../../../common/utils/pagination.util";
import { serializeValue } from "../../../common/utils/serialization.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
} from "../../../common/utils/query.util";

const INTERNAL_FIELDS = new Set([
  "createdBy",
  "updatedBy",
  "deletedAt",
  "searchKeywords",
  "searchPriority",
  "schemaGenerated",
  "templeCode",
  "festivalCode",
  "contentCode",
  "panchangCode",
  "uploadedById",
  "isSearchable",
]);

type PublicDelegate = {
  count(args?: { where?: Record<string, unknown> }): Promise<number>;
  findFirst(args: { where: Record<string, unknown> }): Promise<Record<string, unknown> | null>;
  findMany(args: {
    orderBy?: Record<string, unknown>;
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
  }): Promise<Record<string, unknown>[]>;
};

export type PublicReadOptions = {
  allowedFilterFields?: string[];
  allowedSortFields?: string[];
  searchableFields: string[];
};

export function sanitizePublicRecord<T extends Record<string, unknown>>(item: T): Record<string, unknown> {
  const serialized = serializeValue(item) as Record<string, unknown>;

  for (const field of INTERNAL_FIELDS) {
    delete serialized[field];
  }

  return serialized;
}

export function activeStatusWhere(): { deletedAt: null; status: Status } {
  return { deletedAt: null, status: Status.ACTIVE };
}

export function publishedAtWhere(now = new Date()) {
  return {
    publishedAt: {
      lte: now,
      not: null,
    },
  };
}

export function legacyPublishedWhere(now = new Date()) {
  return {
    status: ContentStatus.published,
    publishedAt: {
      lte: now,
      not: null,
    },
  };
}

export async function publicFindMany(
  delegate: PublicDelegate,
  query: BaseQueryDto,
  baseWhere: Record<string, unknown>,
  options: PublicReadOptions,
) {
  const { page, limit, skip, take } = getPagination(query.page, query.limit);
  const allowedFilters = filterPublicFields(query.filters, options.allowedFilterFields);
  const where = cleanWhere({
    ...baseWhere,
    ...buildSearchFilter(query.search, options.searchableFields),
    ...buildFieldFilters(allowedFilters),
  });

  const [items, total] = await Promise.all([
    delegate.findMany({
      where,
      orderBy: buildOrderBy(resolveSortBy(query.sortBy, options.allowedSortFields), query.sortOrder),
      skip,
      take,
    }),
    delegate.count({ where }),
  ]);

  return createPaginatedResponse(
    items.map((item) => sanitizePublicRecord(item)),
    createPaginationMeta(page, limit, total),
  );
}

export async function publicFindBySlug(
  delegate: PublicDelegate,
  slug: string,
  baseWhere: Record<string, unknown>,
  message: string,
) {
  const item = await delegate.findFirst({
    where: { ...baseWhere, slug },
  });

  if (!item) {
    throw new NotFoundException("Record not found");
  }

  return createApiResponse(message, sanitizePublicRecord(item));
}

export async function publicFindById(
  delegate: PublicDelegate,
  id: string,
  baseWhere: Record<string, unknown>,
  message: string,
) {
  const item = await delegate.findFirst({
    where: { ...baseWhere, id },
  });

  if (!item) {
    throw new NotFoundException("Record not found");
  }

  return createApiResponse(message, sanitizePublicRecord(item));
}

function cleanWhere(where: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(where).filter(([, value]) => value !== undefined));
}

function filterPublicFields(
  filters?: Record<string, string | number | boolean>,
  allowedFields?: string[],
) {
  if (!filters || !allowedFields?.length) return filters;
  const allowed = new Set(allowedFields);
  return Object.fromEntries(Object.entries(filters).filter(([key]) => allowed.has(key))) as Record<
    string,
    string | number | boolean
  >;
}

function resolveSortBy(sortBy: string | undefined, allowedFields?: string[]) {
  if (!sortBy || !allowedFields?.length) return sortBy;
  return allowedFields.includes(sortBy) ? sortBy : undefined;
}

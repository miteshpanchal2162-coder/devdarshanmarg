import { NotFoundException } from "@nestjs/common";
import { BaseQueryDto } from "../dto/base-query.dto";
import { handlePrismaError } from "../exceptions/prisma-error.handler";
import { PaginatedResponse } from "../interfaces/api-response.interface";
import { createPaginationMeta, getPagination } from "../utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
  buildStatusFilter,
} from "../utils/query.util";

type CrudDelegate<T> = {
  create(args: { data: any }): Promise<T>;
  count(args?: { where?: Record<string, unknown> }): Promise<number>;
  findFirst(args: { where: Record<string, unknown> }): Promise<T | null>;
  findMany(args: {
    orderBy?: Record<string, unknown>;
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
  }): Promise<T[]>;
  update(args: { data: any; where: { id: string } }): Promise<T>;
};

export abstract class BaseCrudService<T> {
  protected constructor(
    protected readonly delegate: CrudDelegate<T>,
    protected readonly searchableFields: string[] = [],
    protected readonly allowedSortFields: string[] = [],
    protected readonly allowedFilterFields: string[] = [],
  ) {}

  async create(data: unknown): Promise<T> {
    try {
      return await this.delegate.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(id: string, data: unknown): Promise<T> {
    try {
      return await this.delegate.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<T> {
    try {
      const record = await this.findOne(id);
      if (this.hasDeletedAt(record)) {
        return await this.delegate.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      }

      return await this.delegate.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async restore(id: string): Promise<T> {
    try {
      return await this.delegate.update({
        where: { id },
        data: { deletedAt: null, status: "ACTIVE" },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<T> {
    const record = await this.delegate.findFirst({
      where: { id, deletedAt: null },
    });

    if (!record) {
      throw new NotFoundException("Record not found");
    }

    return record;
  }

  async findMany(query: BaseQueryDto): Promise<PaginatedResponse<T>> {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.cleanWhere({
      ...buildSearchFilter(query.search, this.searchableFields),
      ...buildStatusFilter(query.status),
      ...buildFieldFilters(this.filterAllowedFields(query.filters)),
      deletedAt: null,
    });
    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        orderBy: buildOrderBy(this.getAllowedSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.delegate.count({ where }),
    ]);

    return {
      items,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  private hasDeletedAt(record: T): boolean {
    return typeof record === "object" && record !== null && "deletedAt" in record;
  }

  private cleanWhere(where: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }

  private filterAllowedFields(filters?: Record<string, string | number | boolean>) {
    if (!filters || !this.allowedFilterFields.length) return filters;
    const allowedFields = new Set(this.allowedFilterFields);
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowedFields.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private getAllowedSortBy(sortBy?: string) {
    if (!sortBy || !this.allowedSortFields.length) return sortBy;
    return this.allowedSortFields.includes(sortBy) ? sortBy : undefined;
  }
}

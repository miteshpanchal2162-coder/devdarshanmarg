import { ConflictException, NotFoundException } from "@nestjs/common";
import { Status } from "@prisma/client";
import { BaseQueryDto } from "../../common/dto/base-query.dto";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
  buildStatusFilter,
} from "../../common/utils/query.util";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { serializeValue } from "../../common/utils/serialization.util";

type VratChildOptions = {
  allowedFilterFields?: string[];
  allowedSortFields?: string[];
  hasSoftDelete?: boolean;
  hasSortOrder?: boolean;
  hasStatus?: boolean;
  messageName: string;
  searchableFields: string[];
  uniqueField?: string;
};

export abstract class VratChildCrudService<T extends Record<string, unknown>> extends BaseCrudService<T> {
  protected constructor(
    protected readonly childDelegate: any,
    private readonly options: VratChildOptions,
    private readonly relationValidation?: RelationValidationService,
  ) {
    super(childDelegate, options.searchableFields);
  }

  async findByVrat(vratId: string, query: BaseQueryDto) {
    await this.relationValidation?.validateForeignKeys({ vratId });
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.cleanRecord({
      vratId,
      ...(this.hasSoftDelete() ? { deletedAt: null } : {}),
      ...buildSearchFilter(query.search, this.options.searchableFields),
      ...(this.hasStatus() ? buildStatusFilter(query.status) : {}),
      ...buildFieldFilters(this.filterAllowedChildFields(query.filters)),
    });
    const [items, total] = await Promise.all([
      this.childDelegate.findMany({
        where,
        orderBy: buildOrderBy(this.getAllowedChildSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.childDelegate.count({ where }),
    ]);

    return createPaginatedResponse(
      items.map((item: T) => this.toResponse(item)),
      createPaginationMeta(page, limit, total),
    );
  }

  async findChildById(vratId: string, id: string) {
    await this.relationValidation?.validateForeignKeys({ vratId });
    const item = await this.findRecord(vratId, id);
    return createApiResponse(`${this.options.messageName} fetched successfully`, this.toResponse(item));
  }

  async createChild(vratId: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.relationValidation?.validateForeignKeys({ vratId });
    await this.ensureUnique(vratId, payload);
    const item = await super.create(
      this.cleanRecord({
        ...payload,
        vratId,
        ...(this.hasStatus() ? { status: payload.status ?? Status.ACTIVE } : {}),
        ...(this.hasSortOrder() ? { sortOrder: payload.sortOrder ?? 0 } : {}),
        ...(this.hasAuditFields() ? { createdBy: actorId, updatedBy: actorId } : {}),
      }),
    );

    return createApiResponse(`${this.options.messageName} created successfully`, this.toResponse(item));
  }

  async updateChild(vratId: string, id: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.findRecord(vratId, id);
    await this.relationValidation?.validateForeignKeys({ vratId });
    await this.ensureUnique(vratId, payload, id);
    const item = await super.update(
      id,
      this.cleanRecord({
        ...payload,
        ...(this.hasAuditFields() ? { updatedBy: actorId } : {}),
      }),
    );

    return createApiResponse(`${this.options.messageName} updated successfully`, this.toResponse(item));
  }

  async deleteChild(vratId: string, id: string, actorId: string) {
    await this.findRecord(vratId, id);
    if (this.hasAuditFields()) {
      await super.update(id, { updatedBy: actorId });
    }
    if (!this.hasSoftDelete() && !this.hasStatus()) {
      const item = await this.childDelegate.delete({ where: { id } });
      return createApiResponse(`${this.options.messageName} deleted successfully`, this.toResponse(item));
    }
    const item = await super.delete(id);
    return createApiResponse(`${this.options.messageName} deleted successfully`, this.toResponse(item));
  }

  async restoreChild(vratId: string, id: string, actorId: string) {
    if (!this.hasSoftDelete()) {
      throw new NotFoundException(`${this.options.messageName} restore is not supported`);
    }
    await this.findRecord(vratId, id, false);
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse(`${this.options.messageName} restored successfully`, this.toResponse(item));
  }

  async updateChildStatus(vratId: string, id: string, status: Status, actorId: string) {
    if (!this.hasStatus()) {
      throw new NotFoundException(`${this.options.messageName} status update is not supported`);
    }
    await this.findRecord(vratId, id);
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse(`${this.options.messageName} status updated successfully`, this.toResponse(item));
  }

  private async ensureUnique(vratId: string, data: Record<string, unknown>, excludeId?: string) {
    if (!this.options.uniqueField || !data[this.options.uniqueField]) return;

    const existing = await this.childDelegate.findFirst({
      where: {
        vratId,
        [this.options.uniqueField]: data[this.options.uniqueField],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException(`${this.options.messageName} already exists for this vrat`);
    }
  }

  private async findRecord(vratId: string, id: string, excludeDeleted = true): Promise<T> {
    const item = await this.childDelegate.findFirst({
      where: this.cleanRecord({
        id,
        vratId,
        ...(excludeDeleted && this.hasSoftDelete() ? { deletedAt: null } : {}),
      }),
    });

    if (!item) {
      throw new NotFoundException(`${this.options.messageName} not found`);
    }

    return item;
  }

  private cleanRecord(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }

  private filterAllowedChildFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return undefined;
    const allowedFields = new Set([
      ...(this.hasStatus() ? ["status"] : []),
      ...(this.hasSortOrder() ? ["sortOrder"] : []),
      "createdAt",
      "updatedAt",
      ...this.options.searchableFields,
      ...(this.options.uniqueField ? [this.options.uniqueField] : []),
      ...(this.options.allowedFilterFields ?? []),
    ]);

    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowedFields.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private getAllowedChildSortBy(sortBy?: string) {
    if (!sortBy) return undefined;
    const allowedFields = new Set([
      ...(this.hasSortOrder() ? ["sortOrder"] : []),
      "createdAt",
      "updatedAt",
      ...this.options.searchableFields,
      ...(this.options.uniqueField ? [this.options.uniqueField] : []),
      ...(this.options.allowedSortFields ?? []),
    ]);

    return allowedFields.has(sortBy) ? sortBy : undefined;
  }

  private hasAuditFields() {
    return this.hasSoftDelete() || this.hasStatus();
  }

  private hasSoftDelete() {
    return this.options.hasSoftDelete !== false;
  }

  private hasSortOrder() {
    return this.options.hasSortOrder !== false;
  }

  private hasStatus() {
    return this.options.hasStatus !== false;
  }

  private toResponse(item: T) {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return serializeValue(safeItem) as Omit<T, "deletedAt">;
  }
}

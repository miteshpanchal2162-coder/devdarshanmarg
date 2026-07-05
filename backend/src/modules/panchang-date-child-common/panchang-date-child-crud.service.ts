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

type PanchangDateChildOptions = {
  allowedFilterFields?: string[];
  allowedSortFields?: string[];
  hasAuditFields?: boolean;
  hasSoftDelete?: boolean;
  hasSortOrder?: boolean;
  hasStatus?: boolean;
  messageName: string;
  searchableFields: string[];
  uniqueField?: string;
};

export abstract class PanchangDateChildCrudService<T extends Record<string, unknown>> extends BaseCrudService<T> {
  protected constructor(
    protected readonly childDelegate: any,
    private readonly options: PanchangDateChildOptions,
    private readonly relationValidation?: RelationValidationService,
  ) {
    super(childDelegate, options.searchableFields);
  }

  async findByPanchangDate(panchangId: string, panchangDateId: string, query: BaseQueryDto) {
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.cleanRecord({
      panchangDateId,
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

  async findChildById(panchangId: string, panchangDateId: string, id: string) {
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.findRecord(panchangDateId, id);
    return createApiResponse(`${this.options.messageName} fetched successfully`, this.toResponse(item));
  }

  async createChild(panchangId: string, panchangDateId: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    await this.validateDateRelations(payload);
    await this.ensureUnique(panchangDateId, payload);
    const item = await super.create(
      this.cleanRecord({
        ...payload,
        panchangDateId,
        ...(this.hasStatus() ? { status: payload.status ?? Status.ACTIVE } : {}),
        ...(this.hasSortOrder() ? { sortOrder: payload.sortOrder ?? 0 } : {}),
        ...(this.hasAuditFields() ? { createdBy: actorId, updatedBy: actorId } : {}),
      }),
    );

    return createApiResponse(`${this.options.messageName} created successfully`, this.toResponse(item));
  }

  async updateChild(panchangId: string, panchangDateId: string, id: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    await this.findRecord(panchangDateId, id);
    await this.validateDateRelations(payload);
    await this.ensureUnique(panchangDateId, payload, id);
    const item = await super.update(
      id,
      this.cleanRecord({
        ...payload,
        ...(this.hasAuditFields() ? { updatedBy: actorId } : {}),
      }),
    );

    return createApiResponse(`${this.options.messageName} updated successfully`, this.toResponse(item));
  }

  async deleteChild(panchangId: string, panchangDateId: string, id: string, actorId: string) {
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    await this.findRecord(panchangDateId, id);
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

  async restoreChild(panchangId: string, panchangDateId: string, id: string, actorId: string) {
    if (!this.hasSoftDelete()) {
      throw new NotFoundException(`${this.options.messageName} restore is not supported`);
    }
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    await this.findRecord(panchangDateId, id, false);
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse(`${this.options.messageName} restored successfully`, this.toResponse(item));
  }

  async updateChildStatus(
    panchangId: string,
    panchangDateId: string,
    id: string,
    status: Status,
    actorId: string,
  ) {
    if (!this.hasStatus()) {
      throw new NotFoundException(`${this.options.messageName} status update is not supported`);
    }
    await this.relationValidation?.validatePanchangDateHierarchy(panchangId, panchangDateId);
    await this.findRecord(panchangDateId, id);
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse(`${this.options.messageName} status updated successfully`, this.toResponse(item));
  }

  protected async validateDateRelations(data: Record<string, unknown>) {
    await this.relationValidation?.validateForeignKeys({
      karanaId: this.asString(data.karanaId),
      nakshatraId: this.asString(data.nakshatraId),
      planetId: this.asString(data.planetId),
      rashiId: this.asString(data.rashiId) ?? this.asString(data.fromRashiId) ?? this.asString(data.toRashiId),
      tithiId: this.asString(data.tithiId),
      yogaId: this.asString(data.yogaId),
    });
    if (data.fromRashiId) {
      await this.relationValidation?.validateForeignKeys({ rashiId: this.asString(data.fromRashiId) });
    }
    if (data.toRashiId) {
      await this.relationValidation?.validateForeignKeys({ rashiId: this.asString(data.toRashiId) });
    }
  }

  private async ensureUnique(panchangDateId: string, data: Record<string, unknown>, excludeId?: string) {
    if (!this.options.uniqueField || !data[this.options.uniqueField]) return;

    const existing = await this.childDelegate.findFirst({
      where: {
        panchangDateId,
        [this.options.uniqueField]: data[this.options.uniqueField],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException(`${this.options.messageName} already exists for this panchang date`);
    }
  }

  private asString(value: unknown) {
    return typeof value === "string" ? value : undefined;
  }

  private async findRecord(panchangDateId: string, id: string, excludeDeleted = true): Promise<T> {
    const item = await this.childDelegate.findFirst({
      where: this.cleanRecord({
        id,
        panchangDateId,
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
    if (this.options.hasAuditFields !== undefined) {
      return this.options.hasAuditFields;
    }
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

import { ConflictException, NotFoundException } from "@nestjs/common";
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
} from "../../common/utils/query.util";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { serializeValue } from "../../common/utils/serialization.util";

type ContentGalleryChildOptions = {
  allowedFilterFields?: string[];
  allowedSortFields?: string[];
  hasSortOrder?: boolean;
  messageName: string;
  searchableFields: string[];
  uniqueField?: string;
};

export abstract class ContentGalleryChildCrudService<T extends Record<string, unknown>> extends BaseCrudService<T> {
  protected constructor(
    protected readonly childDelegate: any,
    private readonly options: ContentGalleryChildOptions,
    private readonly relationValidation?: RelationValidationService,
  ) {
    super(childDelegate, options.searchableFields);
  }

  async findByGallery(contentItemId: string, galleryId: string, query: BaseQueryDto) {
    await this.relationValidation?.validateContentGalleryHierarchy(contentItemId, galleryId);
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.cleanRecord({
      galleryId,
      ...buildSearchFilter(query.search, this.options.searchableFields),
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

  async findChildById(contentItemId: string, galleryId: string, id: string) {
    await this.relationValidation?.validateContentGalleryHierarchy(contentItemId, galleryId);
    const item = await this.findRecord(galleryId, id);
    return createApiResponse(`${this.options.messageName} fetched successfully`, this.toResponse(item));
  }

  async createChild(contentItemId: string, galleryId: string, data: object, _actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.relationValidation?.validateContentGalleryHierarchy(contentItemId, galleryId);
    await this.validateChildRelations(contentItemId, payload);
    await this.ensureUnique(galleryId, payload);
    const item = await super.create(
      this.cleanRecord({
        ...payload,
        galleryId,
        ...(this.hasSortOrder() ? { sortOrder: payload.sortOrder ?? 0 } : {}),
      }),
    );

    return createApiResponse(`${this.options.messageName} created successfully`, this.toResponse(item));
  }

  async updateChild(contentItemId: string, galleryId: string, id: string, data: object, _actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.findRecord(galleryId, id);
    await this.relationValidation?.validateContentGalleryHierarchy(contentItemId, galleryId);
    await this.validateChildRelations(contentItemId, payload);
    await this.ensureUnique(galleryId, payload, id);
    const item = await super.update(id, this.cleanRecord(payload));

    return createApiResponse(`${this.options.messageName} updated successfully`, this.toResponse(item));
  }

  async deleteChild(contentItemId: string, galleryId: string, id: string, _actorId: string) {
    await this.findRecord(galleryId, id);
    await this.relationValidation?.validateContentGalleryHierarchy(contentItemId, galleryId);
    const item = await this.childDelegate.delete({ where: { id } });
    return createApiResponse(`${this.options.messageName} deleted successfully`, this.toResponse(item));
  }

  protected async validateChildRelations(_contentItemId: string, _data: Record<string, unknown>) {
    return undefined;
  }

  private async ensureUnique(galleryId: string, data: Record<string, unknown>, excludeId?: string) {
    if (!this.options.uniqueField || !data[this.options.uniqueField]) return;

    const existing = await this.childDelegate.findFirst({
      where: {
        galleryId,
        [this.options.uniqueField]: data[this.options.uniqueField],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException(`${this.options.messageName} already exists for this gallery`);
    }
  }

  private async findRecord(galleryId: string, id: string): Promise<T> {
    const item = await this.childDelegate.findFirst({
      where: { id, galleryId },
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
      ...(this.hasSortOrder() ? ["sortOrder"] : []),
      "createdAt",
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
      ...this.options.searchableFields,
      ...(this.options.uniqueField ? [this.options.uniqueField] : []),
      ...(this.options.allowedSortFields ?? []),
    ]);

    return allowedFields.has(sortBy) ? sortBy : undefined;
  }

  private hasSortOrder() {
    return this.options.hasSortOrder !== false;
  }

  private toResponse(item: T) {
    return serializeValue(item) as T;
  }
}

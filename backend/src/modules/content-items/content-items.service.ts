import { ConflictException, Injectable } from "@nestjs/common";
import { ContentItem, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemQueryDto, CreateContentItemDto, UpdateContentItemDto } from "./dto/content-item.dto";

type ContentItemResponse = Omit<ContentItem, "deletedAt">;

@Injectable()
export class ContentItemsService extends BaseCrudService<ContentItem> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.contentItem,
      ["title", "contentCode", "slug", "shortDescription"],
      [
        "title",
        "contentCode",
        "slug",
        "status",
        "isFeatured",
        "isPopular",
        "publishedAt",
        "sortOrder",
        "createdAt",
        "updatedAt",
      ],
      ["status", "isFeatured", "isPopular"],
    );
  }

  async findAll(query: ContentItemQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Content item fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createContentItem(dto: CreateContentItemDto, actorId: string) {
    await this.validateRelations(dto);
    await this.ensureUnique(dto.contentCode, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isFeatured: dto.isFeatured ?? false,
      isPopular: dto.isPopular ?? false,
      ...(dto.publishedAt ? { publishedAt: new Date(dto.publishedAt) } : {}),
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Content item created successfully", this.toResponse(item));
  }

  async updateContentItem(id: string, dto: UpdateContentItemDto, actorId: string) {
    await this.validateRelations(dto);
    if (dto.contentCode || dto.slug) {
      await this.ensureUnique(dto.contentCode, dto.slug, id);
    }
    const item = await super.update(id, {
      ...dto,
      ...(dto.publishedAt !== undefined
        ? { publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null }
        : {}),
      updatedBy: actorId,
    });
    return createApiResponse("Content item updated successfully", this.toResponse(item));
  }

  async deleteContentItem(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Content item deleted successfully", this.toResponse(item));
  }

  async restoreContentItem(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Content item restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Content item status updated successfully", this.toResponse(item));
  }

  private async validateRelations(dto: CreateContentItemDto | UpdateContentItemDto) {
    await this.relationValidation.validateForeignKeys({
      contentCategoryId: dto.categoryId,
      contentItemTypeId: dto.contentTypeId,
    });
  }

  private async ensureUnique(contentCode?: string, slug?: string, excludeId?: string) {
    if (!contentCode && !slug) return;
    const existing = await this.prisma.contentItem.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(contentCode ? [{ contentCode }] : []),
          ...(slug ? [{ slug }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException("Content item code or slug already exists");
    }
  }

  private toResponse(item: ContentItem): ContentItemResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

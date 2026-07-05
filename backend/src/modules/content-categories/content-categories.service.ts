import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ContentCategory, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  ContentCategoryQueryDto,
  CreateContentCategoryDto,
  UpdateContentCategoryDto,
} from "./dto/content-category.dto";

type ContentCategoryResponse = Omit<ContentCategory, "deletedAt">;

@Injectable()
export class ContentCategoriesService extends BaseCrudService<ContentCategory> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.contentCategory,
      ["name", "slug", "description"],
      ["name", "slug", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status"],
    );
  }

  async findAll(query: ContentCategoryQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Content category fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createCategory(dto: CreateContentCategoryDto, actorId: string) {
    await this.validateParent(dto.parentId);
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Content category created successfully", this.toResponse(item));
  }

  async updateCategory(id: string, dto: UpdateContentCategoryDto, actorId: string) {
    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException("Content category cannot be its own parent");
      }
      await this.validateParent(dto.parentId);
    }
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Content category updated successfully", this.toResponse(item));
  }

  async deleteCategory(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Content category deleted successfully", this.toResponse(item));
  }

  async restoreCategory(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Content category restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Content category status updated successfully", this.toResponse(item));
  }

  private async validateParent(parentId?: string) {
    if (!parentId) return;
    await this.relationValidation.validateForeignKeys({ contentCategoryId: parentId });
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.contentCategory.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Content category slug already exists");
    }
  }

  private toResponse(item: ContentCategory): ContentCategoryResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

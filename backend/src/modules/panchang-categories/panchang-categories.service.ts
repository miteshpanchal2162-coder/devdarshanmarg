import { ConflictException, Injectable } from "@nestjs/common";
import { PanchangCategory, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  CreatePanchangCategoryDto,
  PanchangCategoryQueryDto,
  UpdatePanchangCategoryDto,
} from "./dto/panchang-category.dto";

type PanchangCategoryResponse = Omit<PanchangCategory, "deletedAt">;

@Injectable()
export class PanchangCategoriesService extends BaseCrudService<PanchangCategory> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.panchangCategory,
      ["name", "displayName", "slug", "alternateNames", "searchKeywords", "seoTitle"],
      ["name", "displayName", "slug", "isFeatured", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "isFeatured"],
    );
  }

  async findAll(query: PanchangCategoryQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Panchang category fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createCategory(dto: CreatePanchangCategoryDto, actorId: string) {
    await this.ensureUnique(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isFeatured: dto.isFeatured ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Panchang category created successfully", this.toResponse(item));
  }

  async updateCategory(id: string, dto: UpdatePanchangCategoryDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUnique(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Panchang category updated successfully", this.toResponse(item));
  }

  async deleteCategory(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Panchang category deleted successfully", this.toResponse(item));
  }

  async restoreCategory(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Panchang category restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Panchang category status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.panchangCategory.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Panchang category slug already exists");
    }
  }

  private toResponse(item: PanchangCategory): PanchangCategoryResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

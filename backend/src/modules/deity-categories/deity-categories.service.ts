import { ConflictException, Injectable } from "@nestjs/common";
import { DeityCategory, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  CreateDeityCategoryDto,
  DeityCategoryQueryDto,
  UpdateDeityCategoryDto,
} from "./dto/deity-category.dto";

type DeityCategoryResponse = Omit<DeityCategory, "deletedAt">;

@Injectable()
export class DeityCategoriesService extends BaseCrudService<DeityCategory> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.deityCategory,
      ["name", "displayName", "slug", "alternateNames", "searchKeywords", "seoTitle"],
      ["name", "displayName", "slug", "isFeatured", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "isFeatured"],
    );
  }

  async findAll(query: DeityCategoryQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Deity category fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createCategory(dto: CreateDeityCategoryDto, actorId: string) {
    await this.ensureUnique(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isFeatured: dto.isFeatured ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Deity category created successfully", this.toResponse(item));
  }

  async updateCategory(id: string, dto: UpdateDeityCategoryDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUnique(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Deity category updated successfully", this.toResponse(item));
  }

  async deleteCategory(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Deity category deleted successfully", this.toResponse(item));
  }

  async restoreCategory(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Deity category restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Deity category status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.deityCategory.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Deity category slug already exists");
    }
  }

  private toResponse(item: DeityCategory): DeityCategoryResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

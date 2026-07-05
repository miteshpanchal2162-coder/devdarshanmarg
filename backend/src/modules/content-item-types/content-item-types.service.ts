import { ConflictException, Injectable } from "@nestjs/common";
import { ContentItemType, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  ContentItemTypeQueryDto,
  CreateContentItemTypeDto,
  UpdateContentItemTypeDto,
} from "./dto/content-item-type.dto";

type ContentItemTypeResponse = Omit<ContentItemType, "deletedAt">;

@Injectable()
export class ContentItemTypesService extends BaseCrudService<ContentItemType> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.contentItemType,
      ["name", "slug", "description"],
      ["name", "slug", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status"],
    );
  }

  async findAll(query: ContentItemTypeQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Content item type fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createType(dto: CreateContentItemTypeDto, actorId: string) {
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Content item type created successfully", this.toResponse(item));
  }

  async updateType(id: string, dto: UpdateContentItemTypeDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Content item type updated successfully", this.toResponse(item));
  }

  async deleteType(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Content item type deleted successfully", this.toResponse(item));
  }

  async restoreType(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Content item type restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Content item type status updated successfully", this.toResponse(item));
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.contentItemType.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Content item type slug already exists");
    }
  }

  private toResponse(item: ContentItemType): ContentItemTypeResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

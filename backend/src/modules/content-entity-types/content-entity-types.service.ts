import { ConflictException, Injectable } from "@nestjs/common";
import { ContentEntityType, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  ContentEntityTypeQueryDto,
  CreateContentEntityTypeDto,
  UpdateContentEntityTypeDto,
} from "./dto/content-entity-type.dto";

type ContentEntityTypeResponse = Omit<ContentEntityType, "deletedAt">;

@Injectable()
export class ContentEntityTypesService extends BaseCrudService<ContentEntityType> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.contentEntityType,
      ["name", "slug", "description"],
      ["name", "slug", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status"],
    );
  }

  async findAll(query: ContentEntityTypeQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Content entity type fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createType(dto: CreateContentEntityTypeDto, actorId: string) {
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Content entity type created successfully", this.toResponse(item));
  }

  async updateType(id: string, dto: UpdateContentEntityTypeDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Content entity type updated successfully", this.toResponse(item));
  }

  async deleteType(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Content entity type deleted successfully", this.toResponse(item));
  }

  async restoreType(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Content entity type restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Content entity type status updated successfully", this.toResponse(item));
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.contentEntityType.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Content entity type slug already exists");
    }
  }

  private toResponse(item: ContentEntityType): ContentEntityTypeResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

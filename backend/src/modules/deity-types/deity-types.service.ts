import { ConflictException, Injectable } from "@nestjs/common";
import { DeityType, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateDeityTypeDto, DeityTypeQueryDto, UpdateDeityTypeDto } from "./dto/deity-type.dto";

type DeityTypeResponse = Omit<DeityType, "deletedAt">;

@Injectable()
export class DeityTypesService extends BaseCrudService<DeityType> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.deityType,
      ["name", "displayName", "slug", "alternateNames", "searchKeywords", "seoTitle"],
      ["name", "displayName", "slug", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status"],
    );
  }

  async findAll(query: DeityTypeQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Deity type fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createType(dto: CreateDeityTypeDto, actorId: string) {
    await this.ensureUnique(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Deity type created successfully", this.toResponse(item));
  }

  async updateType(id: string, dto: UpdateDeityTypeDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUnique(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Deity type updated successfully", this.toResponse(item));
  }

  async deleteType(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Deity type deleted successfully", this.toResponse(item));
  }

  async restoreType(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Deity type restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Deity type status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.deityType.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Deity type slug already exists");
    }
  }

  private toResponse(item: DeityType): DeityTypeResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

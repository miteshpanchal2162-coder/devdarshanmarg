import { ConflictException, Injectable } from "@nestjs/common";
import { Status, SupportedMediaType } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import {
  CreateSupportedMediaTypeDto,
  SupportedMediaTypeQueryDto,
  UpdateSupportedMediaTypeDto,
} from "./dto/supported-media-type.dto";

@Injectable()
export class SupportedMediaTypesService extends BaseCrudService<SupportedMediaType> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.supportedMediaType,
      ["name", "slug", "description", "mimeType", "allowedExtensions"],
      ["name", "slug", "mimeType", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "slug", "mimeType"],
    );
  }

  async findAll(query: SupportedMediaTypeQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Supported media type fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createMediaType(dto: CreateSupportedMediaTypeDto, actorId: string) {
    await this.ensureUnique(dto.slug);
    const item = await super.create({
      ...dto,
      maxFileSize: dto.maxFileSize !== undefined ? BigInt(dto.maxFileSize) : undefined,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Supported media type created successfully", this.toResponse(item));
  }

  async updateMediaType(id: string, dto: UpdateSupportedMediaTypeDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUnique(dto.slug, id);
    }
    const item = await super.update(id, {
      ...dto,
      ...(dto.maxFileSize !== undefined ? { maxFileSize: BigInt(dto.maxFileSize) } : {}),
      updatedBy: actorId,
    });
    return createApiResponse("Supported media type updated successfully", this.toResponse(item));
  }

  async deleteMediaType(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Supported media type deleted successfully", this.toResponse(item));
  }

  async restoreMediaType(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Supported media type restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Supported media type status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.supportedMediaType.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (existing) {
      throw new ConflictException("Supported media type slug already exists");
    }
  }

  private toResponse(item: SupportedMediaType) {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return serializeValue(safeItem) as Omit<SupportedMediaType, "deletedAt">;
  }
}

import { ConflictException, Injectable } from "@nestjs/common";
import { Status, SupportedContentStatus } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  CreateSupportedContentStatusDto,
  SupportedContentStatusQueryDto,
  UpdateSupportedContentStatusDto,
} from "./dto/supported-content-status.dto";

type SupportedContentStatusResponse = Omit<SupportedContentStatus, "deletedAt">;

@Injectable()
export class SupportedContentStatusesService extends BaseCrudService<SupportedContentStatus> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.supportedContentStatus,
      ["name", "slug", "description", "color"],
      ["name", "slug", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "slug"],
    );
  }

  async findAll(query: SupportedContentStatusQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Supported content status fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createContentStatus(dto: CreateSupportedContentStatusDto, actorId: string) {
    await this.ensureUnique(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Supported content status created successfully", this.toResponse(item));
  }

  async updateContentStatus(id: string, dto: UpdateSupportedContentStatusDto, actorId: string) {
    if (dto.slug) {
      await this.ensureUnique(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Supported content status updated successfully", this.toResponse(item));
  }

  async deleteContentStatus(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Supported content status deleted successfully", this.toResponse(item));
  }

  async restoreContentStatus(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Supported content status restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Supported content status status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.supportedContentStatus.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (existing) {
      throw new ConflictException("Supported content status slug already exists");
    }
  }

  private toResponse(item: SupportedContentStatus): SupportedContentStatusResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

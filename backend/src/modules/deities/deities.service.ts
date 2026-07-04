import { ConflictException, Injectable } from "@nestjs/common";
import { Deity, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateDeityDto, DeityQueryDto, UpdateDeityDto } from "./dto/deity.dto";

type DeityResponse = Omit<Deity, "deletedAt">;

@Injectable()
export class DeitiesService extends BaseCrudService<Deity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.deity,
      ["name", "displayName", "slug", "shortName", "alternateNames", "searchKeywords", "seoTitle"],
      [
        "name",
        "displayName",
        "slug",
        "shortName",
        "deityTypeId",
        "isFeatured",
        "isPopular",
        "sortOrder",
        "status",
        "createdAt",
        "updatedAt",
      ],
      ["status", "deityTypeId", "isFeatured", "isPopular"],
    );
  }

  async findAll(query: DeityQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Deity fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createDeity(dto: CreateDeityDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({ deityTypeId: dto.deityTypeId });
    await this.ensureUnique(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isPopular: dto.isPopular ?? false,
      isFeatured: dto.isFeatured ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Deity created successfully", this.toResponse(item));
  }

  async updateDeity(id: string, dto: UpdateDeityDto, actorId: string) {
    if (dto.deityTypeId) {
      await this.relationValidation.validateForeignKeys({ deityTypeId: dto.deityTypeId });
    }
    if (dto.slug) {
      await this.ensureUnique(dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Deity updated successfully", this.toResponse(item));
  }

  async deleteDeity(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Deity deleted successfully", this.toResponse(item));
  }

  async restoreDeity(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Deity restored successfully", this.toResponse(item));
  }

  async updateDeityStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Deity status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.deity.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Deity slug already exists");
    }
  }

  private toResponse(item: Deity): DeityResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

import { ConflictException, Injectable } from "@nestjs/common";
import { Status, Temple } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import {
  CreateTempleDto,
  TempleQueryDto,
  UpdateTempleDto,
} from "./dto/temple.dto";

@Injectable()
export class TemplesService extends BaseCrudService<Temple> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.temple,
      ["name", "displayName", "canonicalName", "slug", "templeCode", "shortDescription", "description", "searchKeywords"],
      [
        "name",
        "displayName",
        "slug",
        "templeCode",
        "featured",
        "popular",
        "verified",
        "viewCount",
        "ratingAverage",
        "ratingCount",
        "publishedAt",
        "status",
        "sortOrder",
        "createdAt",
        "updatedAt",
      ],
      [
        "countryId",
        "stateId",
        "cityId",
        "areaId",
        "status",
        "featured",
        "popular",
        "verified",
        "parkingAvailable",
        "wheelchairAccessible",
        "photographyAllowed",
        "mobileAllowed",
        "prasadamAvailable",
        "accommodationAvailable",
        "isSearchable",
      ],
    );
  }

  async findAll(query: TempleQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Temple fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createTemple(dto: CreateTempleDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({
      areaId: dto.areaId,
      cityId: dto.cityId,
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.relationValidation.validateTempleLocationHierarchy({
      areaId: dto.areaId,
      cityId: dto.cityId,
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.ensureTempleUnique(dto.slug, dto.templeCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Temple created successfully", this.toResponse(item));
  }

  async updateTemple(id: string, dto: UpdateTempleDto, actorId: string) {
    const existing = await super.findOne(id);
    const countryId = dto.countryId ?? existing.countryId;
    const stateId = dto.stateId ?? existing.stateId;
    const cityId = dto.cityId ?? existing.cityId;
    const areaId = dto.areaId ?? existing.areaId;
    await this.relationValidation.validateForeignKeys({
      areaId: dto.areaId,
      cityId: dto.cityId,
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.relationValidation.validateTempleLocationHierarchy({
      areaId,
      cityId,
      countryId,
      stateId,
    });
    await this.ensureTempleUnique(dto.slug, dto.templeCode, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Temple updated successfully", this.toResponse(item));
  }

  async deleteTemple(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Temple deleted successfully", this.toResponse(item));
  }

  async restoreTemple(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Temple restored successfully", this.toResponse(item));
  }

  async updateTempleStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Temple status updated successfully", this.toResponse(item));
  }

  private async ensureTempleUnique(slug?: string, templeCode?: string, excludeId?: string) {
    if (!slug && !templeCode) return;
    const existing = await this.prisma.temple.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(slug ? [{ slug }] : []),
          ...(templeCode ? [{ templeCode }] : []),
        ],
      },
    });
    if (existing) throw new ConflictException("Temple slug or code already exists");
  }

  private toResponse<T extends Record<string, unknown>>(item: T) {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return serializeValue(safeItem) as Omit<T, "deletedAt">;
  }
}

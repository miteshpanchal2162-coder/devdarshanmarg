import { ConflictException, Injectable } from "@nestjs/common";
import { Area, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { AreaQueryDto, CreateAreaDto, UpdateAreaDto } from "./dto/area.dto";

@Injectable()
export class AreasService extends BaseCrudService<Area> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(prisma.area, ["name", "slug", "areaType", "postalCode", "landmark"]);
  }

  async findAll(query: AreaQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findByCity(cityId: string, query: AreaQueryDto) {
    const result = await super.findMany({
      ...query,
      filters: { ...(query.filters ?? {}), cityId },
    });
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Area fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createArea(dto: CreateAreaDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({
      cityId: dto.cityId,
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.relationValidation.validateStateHierarchy(dto.countryId, dto.stateId);
    await this.relationValidation.validateCityHierarchy(dto.stateId, dto.cityId, dto.countryId);
    await this.ensureUnique(dto.cityId, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Area created successfully", this.toResponse(item));
  }

  async updateArea(id: string, dto: UpdateAreaDto, actorId: string) {
    const existing = await super.findOne(id);
    const countryId = dto.countryId ?? existing.countryId;
    const stateId = dto.stateId ?? existing.stateId;
    const cityId = dto.cityId ?? existing.cityId;
    await this.relationValidation.validateForeignKeys({
      cityId: dto.cityId,
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.relationValidation.validateStateHierarchy(countryId, stateId);
    await this.relationValidation.validateCityHierarchy(stateId, cityId, countryId);
    await this.ensureUnique(cityId, dto.slug ?? existing.slug, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Area updated successfully", this.toResponse(item));
  }

  async deleteArea(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Area deleted successfully", this.toResponse(item));
  }

  async restoreArea(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Area restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Area status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(cityId?: string, slug?: string, excludeId?: string) {
    if (!cityId || !slug) return;
    const existing = await this.prisma.area.findFirst({
      where: {
        cityId,
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) throw new ConflictException("Area slug already exists for this city");
  }

  private toResponse(item: Area) {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

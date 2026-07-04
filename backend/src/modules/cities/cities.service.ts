import { ConflictException, Injectable } from "@nestjs/common";
import { City, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CityQueryDto, CreateCityDto, UpdateCityDto } from "./dto/city.dto";

@Injectable()
export class CitiesService extends BaseCrudService<City> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(prisma.city, ["name", "officialName", "slug", "cityType", "timezone"]);
  }

  async findAll(query: CityQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findByState(stateId: string, query: CityQueryDto) {
    const result = await super.findMany({
      ...query,
      filters: { ...(query.filters ?? {}), stateId },
    });
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("City fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createCity(dto: CreateCityDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.relationValidation.validateStateHierarchy(dto.countryId, dto.stateId);
    await this.ensureUnique(dto.stateId, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isCapital: dto.isCapital ?? false,
      isMetro: dto.isMetro ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("City created successfully", this.toResponse(item));
  }

  async updateCity(id: string, dto: UpdateCityDto, actorId: string) {
    const existing = await super.findOne(id);
    const countryId = dto.countryId ?? existing.countryId;
    const stateId = dto.stateId ?? existing.stateId;
    await this.relationValidation.validateForeignKeys({
      countryId: dto.countryId,
      stateId: dto.stateId,
    });
    await this.relationValidation.validateStateHierarchy(countryId, stateId);
    await this.ensureUnique(stateId, dto.slug ?? existing.slug, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("City updated successfully", this.toResponse(item));
  }

  async deleteCity(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("City deleted successfully", this.toResponse(item));
  }

  async restoreCity(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("City restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("City status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(stateId?: string, slug?: string, excludeId?: string) {
    if (!stateId || !slug) return;
    const existing = await this.prisma.city.findFirst({
      where: {
        stateId,
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) throw new ConflictException("City slug already exists for this state");
  }

  private toResponse(item: City) {
    const { deletedAt: _deletedAt, population, ...safeItem } = item;
    return {
      ...safeItem,
      population: typeof population === "bigint" ? population.toString() : population,
    };
  }
}

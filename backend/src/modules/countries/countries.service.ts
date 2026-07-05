import { ConflictException, Injectable } from "@nestjs/common";
import { Country, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import { CountryQueryDto, CreateCountryDto, UpdateCountryDto } from "./dto/country.dto";

@Injectable()
export class CountriesService extends BaseCrudService<Country> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(prisma.country, ["name", "officialName", "displayName", "slug", "iso2", "iso3"]);
  }

  async findAll(query: CountryQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findByContinent(continentId: string, query: CountryQueryDto) {
    const filters = { ...(query.filters ?? {}), continentId };
    const result = await super.findMany({ ...query, filters });
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Country fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createCountry(dto: CreateCountryDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({ continentId: dto.continentId });
    await this.ensureUnique(dto.slug, dto.iso2, dto.iso3);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isDefault: dto.isDefault ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Country created successfully", this.toResponse(item));
  }

  async updateCountry(id: string, dto: UpdateCountryDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({ continentId: dto.continentId });
    await this.ensureUnique(dto.slug, dto.iso2, dto.iso3, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Country updated successfully", this.toResponse(item));
  }

  async deleteCountry(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Country deleted successfully", this.toResponse(item));
  }

  async restoreCountry(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Country restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Country status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug?: string, iso2?: string, iso3?: string, excludeId?: string) {
    if (!slug && !iso2 && !iso3) return;
    const existing = await this.prisma.country.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(slug ? [{ slug }] : []),
          ...(iso2 ? [{ iso2 }] : []),
          ...(iso3 ? [{ iso3 }] : []),
        ],
      },
    });
    if (existing) throw new ConflictException("Country slug, ISO2, or ISO3 already exists");
  }

  private toResponse(item: Country) {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return serializeValue(safeItem) as Omit<Country, "deletedAt">;
  }
}

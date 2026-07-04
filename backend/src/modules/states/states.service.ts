import { ConflictException, Injectable } from "@nestjs/common";
import { State, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateStateDto, StateQueryDto, UpdateStateDto } from "./dto/state.dto";

@Injectable()
export class StatesService extends BaseCrudService<State> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(prisma.state, ["name", "officialName", "slug", "code", "capital"]);
  }

  async findAll(query: StateQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findByCountry(countryId: string, query: StateQueryDto) {
    const result = await super.findMany({
      ...query,
      filters: { ...(query.filters ?? {}), countryId },
    });
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("State fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createState(dto: CreateStateDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({ countryId: dto.countryId });
    await this.ensureUnique(dto.countryId, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("State created successfully", this.toResponse(item));
  }

  async updateState(id: string, dto: UpdateStateDto, actorId: string) {
    const existing = await super.findOne(id);
    await this.relationValidation.validateForeignKeys({ countryId: dto.countryId });
    await this.ensureUnique(dto.countryId ?? existing.countryId, dto.slug ?? existing.slug, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("State updated successfully", this.toResponse(item));
  }

  async deleteState(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("State deleted successfully", this.toResponse(item));
  }

  async restoreState(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("State restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("State status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(countryId?: string, slug?: string, excludeId?: string) {
    if (!countryId || !slug) return;
    const existing = await this.prisma.state.findFirst({
      where: {
        countryId,
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) throw new ConflictException("State slug already exists for this country");
  }

  private toResponse(item: State) {
    const { deletedAt: _deletedAt, population, ...safeItem } = item;
    return {
      ...safeItem,
      population: typeof population === "bigint" ? population.toString() : population,
    };
  }
}

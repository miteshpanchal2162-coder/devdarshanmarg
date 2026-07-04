import { ConflictException, Injectable } from "@nestjs/common";
import { Planet, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreatePlanetDto, PlanetQueryDto, UpdatePlanetDto } from "./dto/planet.dto";

type PlanetResponse = Omit<Planet, "deletedAt">;

@Injectable()
export class PlanetsService extends BaseCrudService<Planet> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.planet,
      ["name", "planetCode", "slug", "description", "planetType"],
      ["name", "planetCode", "slug", "planetType", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "planetType"],
    );
  }

  async findAll(query: PlanetQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Planet fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createPlanet(dto: CreatePlanetDto, actorId: string) {
    await this.ensureUnique(dto.planetCode, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Planet created successfully", this.toResponse(item));
  }

  async updatePlanet(id: string, dto: UpdatePlanetDto, actorId: string) {
    if (dto.planetCode || dto.slug) {
      await this.ensureUnique(dto.planetCode, dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Planet updated successfully", this.toResponse(item));
  }

  async deletePlanet(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Planet deleted successfully", this.toResponse(item));
  }

  async restorePlanet(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Planet restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Planet status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(planetCode?: string, slug?: string, excludeId?: string) {
    if (!planetCode && !slug) return;
    const existing = await this.prisma.planet.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(planetCode ? [{ planetCode }] : []),
          ...(slug ? [{ slug }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException("Planet code or slug already exists");
    }
  }

  private toResponse(item: Planet): PlanetResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

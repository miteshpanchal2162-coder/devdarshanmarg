import { ConflictException, Injectable } from "@nestjs/common";
import { Continent, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateContinentDto, ContinentQueryDto, UpdateContinentDto } from "./dto/continent.dto";

type ContinentResponse = Omit<Continent, "deletedAt">;

@Injectable()
export class ContinentsService extends BaseCrudService<Continent> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.continent, ["name", "officialName", "slug", "code"]);
  }

  async findAll(query: ContinentQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Continent fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createContinent(dto: CreateContinentDto, actorId: string) {
    await this.ensureUnique(dto.slug, dto.code);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Continent created successfully", this.toResponse(item));
  }

  async updateContinent(id: string, dto: UpdateContinentDto, actorId: string) {
    await this.ensureUnique(dto.slug, dto.code, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Continent updated successfully", this.toResponse(item));
  }

  async deleteContinent(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Continent deleted successfully", this.toResponse(item));
  }

  async restoreContinent(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Continent restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Continent status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug?: string, code?: string, excludeId?: string) {
    if (!slug && !code) return;
    const existing = await this.prisma.continent.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(slug ? [{ slug }] : []),
          ...(code ? [{ code }] : []),
        ],
      },
    });
    if (existing) throw new ConflictException("Continent slug or code already exists");
  }

  private toResponse(item: Continent): ContinentResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

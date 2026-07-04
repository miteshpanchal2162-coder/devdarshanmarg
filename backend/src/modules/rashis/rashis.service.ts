import { ConflictException, Injectable } from "@nestjs/common";
import { Rashi, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateRashiDto, RashiQueryDto, UpdateRashiDto } from "./dto/rashi.dto";

type RashiResponse = Omit<Rashi, "deletedAt">;

@Injectable()
export class RashisService extends BaseCrudService<Rashi> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.rashi,
      ["name", "rashiCode", "slug", "symbol", "element", "rulingPlanet", "description"],
      ["name", "rashiCode", "slug", "element", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "element"],
    );
  }

  async findAll(query: RashiQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Rashi fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createRashi(dto: CreateRashiDto, actorId: string) {
    await this.ensureUnique(dto.rashiCode, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Rashi created successfully", this.toResponse(item));
  }

  async updateRashi(id: string, dto: UpdateRashiDto, actorId: string) {
    if (dto.rashiCode || dto.slug) {
      await this.ensureUnique(dto.rashiCode, dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Rashi updated successfully", this.toResponse(item));
  }

  async deleteRashi(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Rashi deleted successfully", this.toResponse(item));
  }

  async restoreRashi(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Rashi restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Rashi status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(rashiCode?: string, slug?: string, excludeId?: string) {
    if (!rashiCode && !slug) return;
    const existing = await this.prisma.rashi.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(rashiCode ? [{ rashiCode }] : []),
          ...(slug ? [{ slug }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException("Rashi code or slug already exists");
    }
  }

  private toResponse(item: Rashi): RashiResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

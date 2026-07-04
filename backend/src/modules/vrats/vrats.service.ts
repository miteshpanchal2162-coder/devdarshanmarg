import { ConflictException, Injectable } from "@nestjs/common";
import { Status, Vrat } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateVratDto, UpdateVratDto, VratQueryDto } from "./dto/vrat.dto";

type VratResponse = Omit<Vrat, "deletedAt">;

@Injectable()
export class VratsService extends BaseCrudService<Vrat> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.vrat,
      ["name", "vratCode", "slug", "description", "vratType", "difficultyLevel"],
      ["name", "vratCode", "slug", "vratType", "difficultyLevel", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "vratType", "difficultyLevel"],
    );
  }

  async findAll(query: VratQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Vrat fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createVrat(dto: CreateVratDto, actorId: string) {
    await this.ensureUnique(dto.vratCode, dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Vrat created successfully", this.toResponse(item));
  }

  async updateVrat(id: string, dto: UpdateVratDto, actorId: string) {
    if (dto.vratCode || dto.slug) {
      await this.ensureUnique(dto.vratCode, dto.slug, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Vrat updated successfully", this.toResponse(item));
  }

  async deleteVrat(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Vrat deleted successfully", this.toResponse(item));
  }

  async restoreVrat(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Vrat restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Vrat status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(vratCode?: string, slug?: string, excludeId?: string) {
    if (!vratCode && !slug) return;
    const existing = await this.prisma.vrat.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(vratCode ? [{ vratCode }] : []),
          ...(slug ? [{ slug }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException("Vrat code or slug already exists");
    }
  }

  private toResponse(item: Vrat): VratResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

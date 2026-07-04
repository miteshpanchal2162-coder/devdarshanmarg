import { ConflictException, Injectable } from "@nestjs/common";
import { Karana, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateKaranaDto, KaranaQueryDto, UpdateKaranaDto } from "./dto/karana.dto";

type KaranaResponse = Omit<Karana, "deletedAt">;

@Injectable()
export class KaranasService extends BaseCrudService<Karana> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.karana,
      ["name", "karanaCode", "description"],
      ["name", "karanaCode", "auspicious", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "auspicious"],
    );
  }

  async findAll(query: KaranaQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Karana fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createKarana(dto: CreateKaranaDto, actorId: string) {
    await this.ensureUnique(dto.karanaCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Karana created successfully", this.toResponse(item));
  }

  async updateKarana(id: string, dto: UpdateKaranaDto, actorId: string) {
    if (dto.karanaCode) {
      await this.ensureUnique(dto.karanaCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Karana updated successfully", this.toResponse(item));
  }

  async deleteKarana(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Karana deleted successfully", this.toResponse(item));
  }

  async restoreKarana(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Karana restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Karana status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(karanaCode: string, excludeId?: string) {
    const existing = await this.prisma.karana.findFirst({
      where: {
        karanaCode,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Karana code already exists");
    }
  }

  private toResponse(item: Karana): KaranaResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

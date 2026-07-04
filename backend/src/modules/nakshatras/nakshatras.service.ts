import { ConflictException, Injectable } from "@nestjs/common";
import { Nakshatra, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateNakshatraDto, NakshatraQueryDto, UpdateNakshatraDto } from "./dto/nakshatra.dto";

type NakshatraResponse = Omit<Nakshatra, "deletedAt">;

@Injectable()
export class NakshatrasService extends BaseCrudService<Nakshatra> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.nakshatra,
      ["name", "nakshatraCode", "deity", "symbol", "rulingPlanet", "description"],
      ["name", "nakshatraCode", "deity", "rulingPlanet", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "rulingPlanet"],
    );
  }

  async findAll(query: NakshatraQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Nakshatra fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createNakshatra(dto: CreateNakshatraDto, actorId: string) {
    await this.ensureUnique(dto.nakshatraCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Nakshatra created successfully", this.toResponse(item));
  }

  async updateNakshatra(id: string, dto: UpdateNakshatraDto, actorId: string) {
    if (dto.nakshatraCode) {
      await this.ensureUnique(dto.nakshatraCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Nakshatra updated successfully", this.toResponse(item));
  }

  async deleteNakshatra(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Nakshatra deleted successfully", this.toResponse(item));
  }

  async restoreNakshatra(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Nakshatra restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Nakshatra status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(nakshatraCode: string, excludeId?: string) {
    const existing = await this.prisma.nakshatra.findFirst({
      where: {
        nakshatraCode,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Nakshatra code already exists");
    }
  }

  private toResponse(item: Nakshatra): NakshatraResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

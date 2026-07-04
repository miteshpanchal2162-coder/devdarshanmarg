import { ConflictException, Injectable } from "@nestjs/common";
import { Status, Tithi } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateTithiDto, TithiQueryDto, UpdateTithiDto } from "./dto/tithi.dto";

type TithiResponse = Omit<Tithi, "deletedAt">;

@Injectable()
export class TithisService extends BaseCrudService<Tithi> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.tithi,
      ["name", "tithiCode", "paksha", "description"],
      ["name", "tithiCode", "paksha", "tithiNumber", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "paksha"],
    );
  }

  async findAll(query: TithiQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Tithi fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createTithi(dto: CreateTithiDto, actorId: string) {
    await this.ensureUnique(dto.tithiCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Tithi created successfully", this.toResponse(item));
  }

  async updateTithi(id: string, dto: UpdateTithiDto, actorId: string) {
    if (dto.tithiCode) {
      await this.ensureUnique(dto.tithiCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Tithi updated successfully", this.toResponse(item));
  }

  async deleteTithi(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Tithi deleted successfully", this.toResponse(item));
  }

  async restoreTithi(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Tithi restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Tithi status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(tithiCode: string, excludeId?: string) {
    const existing = await this.prisma.tithi.findFirst({
      where: {
        tithiCode,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Tithi code already exists");
    }
  }

  private toResponse(item: Tithi): TithiResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

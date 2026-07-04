import { ConflictException, Injectable } from "@nestjs/common";
import { Muhurat, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateMuhuratDto, MuhuratQueryDto, UpdateMuhuratDto } from "./dto/muhurat.dto";

type MuhuratResponse = Omit<Muhurat, "deletedAt">;

@Injectable()
export class MuhuratsService extends BaseCrudService<Muhurat> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.muhurat,
      ["name", "muhuratCode", "category", "description"],
      ["name", "muhuratCode", "category", "auspicious", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "category", "auspicious"],
    );
  }

  async findAll(query: MuhuratQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Muhurat fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createMuhurat(dto: CreateMuhuratDto, actorId: string) {
    await this.ensureUnique(dto.muhuratCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      auspicious: dto.auspicious ?? true,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Muhurat created successfully", this.toResponse(item));
  }

  async updateMuhurat(id: string, dto: UpdateMuhuratDto, actorId: string) {
    if (dto.muhuratCode) {
      await this.ensureUnique(dto.muhuratCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Muhurat updated successfully", this.toResponse(item));
  }

  async deleteMuhurat(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Muhurat deleted successfully", this.toResponse(item));
  }

  async restoreMuhurat(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Muhurat restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Muhurat status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(muhuratCode: string, excludeId?: string) {
    const existing = await this.prisma.muhurat.findFirst({
      where: {
        muhuratCode,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Muhurat code already exists");
    }
  }

  private toResponse(item: Muhurat): MuhuratResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

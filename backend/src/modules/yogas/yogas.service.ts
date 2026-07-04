import { ConflictException, Injectable } from "@nestjs/common";
import { Status, Yoga } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateYogaDto, UpdateYogaDto, YogaQueryDto } from "./dto/yoga.dto";

type YogaResponse = Omit<Yoga, "deletedAt">;

@Injectable()
export class YogasService extends BaseCrudService<Yoga> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.yoga,
      ["name", "yogaCode", "description"],
      ["name", "yogaCode", "auspicious", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "auspicious"],
    );
  }

  async findAll(query: YogaQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Yoga fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createYoga(dto: CreateYogaDto, actorId: string) {
    await this.ensureUnique(dto.yogaCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Yoga created successfully", this.toResponse(item));
  }

  async updateYoga(id: string, dto: UpdateYogaDto, actorId: string) {
    if (dto.yogaCode) {
      await this.ensureUnique(dto.yogaCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Yoga updated successfully", this.toResponse(item));
  }

  async deleteYoga(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Yoga deleted successfully", this.toResponse(item));
  }

  async restoreYoga(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Yoga restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Yoga status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(yogaCode: string, excludeId?: string) {
    const existing = await this.prisma.yoga.findFirst({
      where: {
        yogaCode,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Yoga code already exists");
    }
  }

  private toResponse(item: Yoga): YogaResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

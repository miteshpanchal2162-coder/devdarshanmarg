import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Status, TempleStatistics } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import { CreateTempleStatisticsDto, UpdateTempleStatisticsDto } from "./dto/temple-statistics.dto";

@Injectable()
export class TempleStatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByTemple(templeId: string) {
    await this.relationValidation.validateForeignKeys({ templeId });
    const item = await this.prisma.templeStatistics.findUnique({
      where: { templeId },
    });

    if (!item) {
      throw new NotFoundException("Temple statistics not found");
    }

    return createApiResponse("Temple statistics fetched successfully", this.toResponse(item));
  }

  async createStatistics(templeId: string, dto: CreateTempleStatisticsDto) {
    await this.relationValidation.validateForeignKeys({ templeId });
    const existing = await this.prisma.templeStatistics.findUnique({
      where: { templeId },
    });

    if (existing) {
      throw new ConflictException("Temple statistics already exists for this temple");
    }

    const item = await this.prisma.templeStatistics.create({
      data: {
        ...dto,
        templeId,
        status: dto.status ?? Status.ACTIVE,
      },
    });

    return createApiResponse("Temple statistics created successfully", this.toResponse(item));
  }

  async updateStatistics(templeId: string, dto: UpdateTempleStatisticsDto) {
    const existing = await this.ensureRecord(templeId);
    const item = await this.prisma.templeStatistics.update({
      where: { id: existing.id },
      data: dto,
    });

    return createApiResponse("Temple statistics updated successfully", this.toResponse(item));
  }

  async archiveStatistics(templeId: string) {
    const existing = await this.ensureRecord(templeId);
    const item = await this.prisma.templeStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ARCHIVED },
    });

    return createApiResponse("Temple statistics archived successfully", this.toResponse(item));
  }

  async restoreStatistics(templeId: string) {
    const existing = await this.ensureRecord(templeId);
    const item = await this.prisma.templeStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ACTIVE },
    });

    return createApiResponse("Temple statistics restored successfully", this.toResponse(item));
  }

  async updateStatus(templeId: string, status: Status) {
    const existing = await this.ensureRecord(templeId);
    const item = await this.prisma.templeStatistics.update({
      where: { id: existing.id },
      data: { status },
    });

    return createApiResponse("Temple statistics status updated successfully", this.toResponse(item));
  }

  private async ensureRecord(templeId: string) {
    const item = await this.prisma.templeStatistics.findUnique({
      where: { templeId },
    });

    if (!item) {
      throw new NotFoundException("Temple statistics not found");
    }

    return item;
  }

  private toResponse(item: TempleStatistics) {
    return serializeValue(item) as TempleStatistics;
  }
}

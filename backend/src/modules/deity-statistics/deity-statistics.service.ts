import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DeityStatistics, Status } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { serializeValue } from "../../common/utils/serialization.util";
import { CreateDeityStatisticsDto, UpdateDeityStatisticsDto } from "./dto/deity-statistics.dto";

@Injectable()
export class DeityStatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByDeity(deityId: string) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const item = await this.prisma.deityStatistics.findUnique({
      where: { deityId },
    });

    if (!item) {
      throw new NotFoundException("Deity statistics not found");
    }

    return createApiResponse("Deity statistics fetched successfully", this.toResponse(item));
  }

  async createStatistics(deityId: string, dto: CreateDeityStatisticsDto) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const existing = await this.prisma.deityStatistics.findUnique({
      where: { deityId },
    });

    if (existing) {
      throw new ConflictException("Deity statistics already exists for this deity");
    }

    const item = await this.prisma.deityStatistics.create({
      data: {
        ...dto,
        deityId,
        status: dto.status ?? Status.ACTIVE,
      },
    });

    return createApiResponse("Deity statistics created successfully", this.toResponse(item));
  }

  async updateStatistics(deityId: string, dto: UpdateDeityStatisticsDto) {
    const existing = await this.ensureRecord(deityId);
    const item = await this.prisma.deityStatistics.update({
      where: { id: existing.id },
      data: dto,
    });

    return createApiResponse("Deity statistics updated successfully", this.toResponse(item));
  }

  async archiveStatistics(deityId: string) {
    const existing = await this.ensureRecord(deityId);
    const item = await this.prisma.deityStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ARCHIVED },
    });

    return createApiResponse("Deity statistics archived successfully", this.toResponse(item));
  }

  async restoreStatistics(deityId: string) {
    const existing = await this.ensureRecord(deityId);
    const item = await this.prisma.deityStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ACTIVE },
    });

    return createApiResponse("Deity statistics restored successfully", this.toResponse(item));
  }

  async updateStatus(deityId: string, status: Status) {
    const existing = await this.ensureRecord(deityId);
    const item = await this.prisma.deityStatistics.update({
      where: { id: existing.id },
      data: { status },
    });

    return createApiResponse("Deity statistics status updated successfully", this.toResponse(item));
  }

  private async ensureRecord(deityId: string) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const item = await this.prisma.deityStatistics.findUnique({
      where: { deityId },
    });

    if (!item) {
      throw new NotFoundException("Deity statistics not found");
    }

    return item;
  }

  private toResponse(item: DeityStatistics) {
    return serializeValue(item) as DeityStatistics;
  }
}

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { FestivalStatistics, Status } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateFestivalStatisticsDto, UpdateFestivalStatisticsDto } from "./dto/festival-statistics.dto";

@Injectable()
export class FestivalStatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByFestival(festivalId: string) {
    await this.relationValidation.validateForeignKeys({ festivalId });
    const item = await this.prisma.festivalStatistics.findUnique({
      where: { festivalId },
    });

    if (!item) {
      throw new NotFoundException("Festival statistics not found");
    }

    return createApiResponse("Festival statistics fetched successfully", this.toResponse(item));
  }

  async createStatistics(festivalId: string, dto: CreateFestivalStatisticsDto) {
    await this.relationValidation.validateForeignKeys({ festivalId });
    const existing = await this.prisma.festivalStatistics.findUnique({
      where: { festivalId },
    });

    if (existing) {
      throw new ConflictException("Festival statistics already exists for this festival");
    }

    const item = await this.prisma.festivalStatistics.create({
      data: {
        ...dto,
        festivalId,
        status: dto.status ?? Status.ACTIVE,
      },
    });

    return createApiResponse("Festival statistics created successfully", this.toResponse(item));
  }

  async updateStatistics(festivalId: string, dto: UpdateFestivalStatisticsDto) {
    const existing = await this.ensureRecord(festivalId);
    const item = await this.prisma.festivalStatistics.update({
      where: { id: existing.id },
      data: dto,
    });

    return createApiResponse("Festival statistics updated successfully", this.toResponse(item));
  }

  async archiveStatistics(festivalId: string) {
    const existing = await this.ensureRecord(festivalId);
    const item = await this.prisma.festivalStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ARCHIVED },
    });

    return createApiResponse("Festival statistics archived successfully", this.toResponse(item));
  }

  async restoreStatistics(festivalId: string) {
    const existing = await this.ensureRecord(festivalId);
    const item = await this.prisma.festivalStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ACTIVE },
    });

    return createApiResponse("Festival statistics restored successfully", this.toResponse(item));
  }

  async updateStatus(festivalId: string, status: Status) {
    const existing = await this.ensureRecord(festivalId);
    const item = await this.prisma.festivalStatistics.update({
      where: { id: existing.id },
      data: { status },
    });

    return createApiResponse("Festival statistics status updated successfully", this.toResponse(item));
  }

  private async ensureRecord(festivalId: string) {
    const item = await this.prisma.festivalStatistics.findUnique({
      where: { festivalId },
    });

    if (!item) {
      throw new NotFoundException("Festival statistics not found");
    }

    return item;
  }

  private toResponse(item: FestivalStatistics) {
    return JSON.parse(
      JSON.stringify(item, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  }
}

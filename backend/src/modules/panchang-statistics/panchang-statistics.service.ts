import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PanchangStatistics, Status } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreatePanchangStatisticsDto, UpdatePanchangStatisticsDto } from "./dto/panchang-statistics.dto";

@Injectable()
export class PanchangStatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchang(panchangId: string) {
    await this.relationValidation.validateForeignKeys({ panchangId });
    const item = await this.prisma.panchangStatistics.findUnique({
      where: { panchangId },
    });

    if (!item) {
      throw new NotFoundException("Panchang statistics not found");
    }

    return createApiResponse("Panchang statistics fetched successfully", this.toResponse(item));
  }

  async createStatistics(panchangId: string, dto: CreatePanchangStatisticsDto) {
    await this.relationValidation.validateForeignKeys({ panchangId });
    const existing = await this.prisma.panchangStatistics.findUnique({
      where: { panchangId },
    });

    if (existing) {
      throw new ConflictException("Panchang statistics already exists for this panchang");
    }

    const item = await this.prisma.panchangStatistics.create({
      data: {
        ...dto,
        panchangId,
        status: dto.status ?? Status.ACTIVE,
      },
    });

    return createApiResponse("Panchang statistics created successfully", this.toResponse(item));
  }

  async updateStatistics(panchangId: string, dto: UpdatePanchangStatisticsDto) {
    const existing = await this.ensureRecord(panchangId);
    const item = await this.prisma.panchangStatistics.update({
      where: { id: existing.id },
      data: dto,
    });

    return createApiResponse("Panchang statistics updated successfully", this.toResponse(item));
  }

  async archiveStatistics(panchangId: string) {
    const existing = await this.ensureRecord(panchangId);
    const item = await this.prisma.panchangStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ARCHIVED },
    });

    return createApiResponse("Panchang statistics archived successfully", this.toResponse(item));
  }

  async restoreStatistics(panchangId: string) {
    const existing = await this.ensureRecord(panchangId);
    const item = await this.prisma.panchangStatistics.update({
      where: { id: existing.id },
      data: { status: Status.ACTIVE },
    });

    return createApiResponse("Panchang statistics restored successfully", this.toResponse(item));
  }

  async updateStatus(panchangId: string, status: Status) {
    const existing = await this.ensureRecord(panchangId);
    const item = await this.prisma.panchangStatistics.update({
      where: { id: existing.id },
      data: { status },
    });

    return createApiResponse("Panchang statistics status updated successfully", this.toResponse(item));
  }

  private async ensureRecord(panchangId: string) {
    await this.relationValidation.validateForeignKeys({ panchangId });
    const item = await this.prisma.panchangStatistics.findUnique({
      where: { panchangId },
    });

    if (!item) {
      throw new NotFoundException("Panchang statistics not found");
    }

    return item;
  }

  private toResponse(item: PanchangStatistics) {
    return JSON.parse(
      JSON.stringify(item, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  }
}

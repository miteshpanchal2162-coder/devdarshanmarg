import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PanchangDayElement } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreatePanchangDayElementDto, UpdatePanchangDayElementDto } from "./dto/panchang-day-element.dto";

@Injectable()
export class PanchangDayElementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchangDate(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.panchangDayElement.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Panchang day element not found");
    }

    return createApiResponse("Panchang day element fetched successfully", this.toResponse(item));
  }

  async createDayElement(panchangId: string, panchangDateId: string, dto: CreatePanchangDayElementDto) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    await this.validateForeignKeys(dto);
    const existing = await this.prisma.panchangDayElement.findUnique({
      where: { panchangDateId },
    });

    if (existing) {
      throw new ConflictException("Panchang day element already exists for this panchang date");
    }

    const item = await this.prisma.panchangDayElement.create({
      data: {
        panchangDateId,
        tithiId: dto.tithiId,
        nakshatraId: dto.nakshatraId,
        yogaId: dto.yogaId,
        karanaId: dto.karanaId,
        ...this.toDatePayload(dto),
      },
    });

    return createApiResponse("Panchang day element created successfully", this.toResponse(item));
  }

  async updateDayElement(panchangId: string, panchangDateId: string, dto: UpdatePanchangDayElementDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    await this.validateForeignKeys(dto);
    const item = await this.prisma.panchangDayElement.update({
      where: { id: existing.id },
      data: {
        ...(dto.tithiId ? { tithiId: dto.tithiId } : {}),
        ...(dto.nakshatraId ? { nakshatraId: dto.nakshatraId } : {}),
        ...(dto.yogaId ? { yogaId: dto.yogaId } : {}),
        ...(dto.karanaId ? { karanaId: dto.karanaId } : {}),
        ...this.toDatePayload(dto),
      },
    });

    return createApiResponse("Panchang day element updated successfully", this.toResponse(item));
  }

  async deleteDayElement(panchangId: string, panchangDateId: string) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.panchangDayElement.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Panchang day element deleted successfully", this.toResponse(item));
  }

  private async validateForeignKeys(dto: CreatePanchangDayElementDto | UpdatePanchangDayElementDto) {
    await this.relationValidation.validateForeignKeys({
      karanaId: dto.karanaId,
      nakshatraId: dto.nakshatraId,
      tithiId: dto.tithiId,
      yogaId: dto.yogaId,
    });
  }

  private async ensureRecord(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.panchangDayElement.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Panchang day element not found");
    }

    return item;
  }

  private toDatePayload(dto: CreatePanchangDayElementDto | UpdatePanchangDayElementDto) {
    const payload: Record<string, Date | null | undefined> = {};
    for (const field of [
      "tithiStart",
      "tithiEnd",
      "nakshatraStart",
      "nakshatraEnd",
      "yogaStart",
      "yogaEnd",
      "karanaStart",
      "karanaEnd",
    ] as const) {
      if (field in dto) {
        const value = dto[field];
        payload[field] = value ? new Date(value) : value === null ? null : undefined;
      }
    }
    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
  }

  private toResponse(item: PanchangDayElement) {
    return item;
  }
}

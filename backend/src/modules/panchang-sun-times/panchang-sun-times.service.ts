import { Injectable, NotFoundException } from "@nestjs/common";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreatePanchangSunTimeDto, UpdatePanchangSunTimeDto } from "./dto/panchang-sun-time.dto";

@Injectable()
export class PanchangSunTimesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchangDate(panchangId: string, panchangDateId: string) {
    const item = await this.ensureRecord(panchangId, panchangDateId);
    return createApiResponse("Panchang sun times fetched successfully", this.toResponse(item));
  }

  async createSunTimes(panchangId: string, panchangDateId: string, dto: CreatePanchangSunTimeDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.panchangDate.update({
      where: { id: existing.id },
      data: this.toDatePayload(dto),
    });
    return createApiResponse("Panchang sun times updated successfully", this.toResponse(item));
  }

  async updateSunTimes(panchangId: string, panchangDateId: string, dto: UpdatePanchangSunTimeDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.panchangDate.update({
      where: { id: existing.id },
      data: this.toDatePayload(dto),
    });
    return createApiResponse("Panchang sun times updated successfully", this.toResponse(item));
  }

  async clearSunTimes(panchangId: string, panchangDateId: string) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.panchangDate.update({
      where: { id: existing.id },
      data: {
        sunrise: null,
        sunset: null,
        moonrise: null,
        moonset: null,
      },
    });
    return createApiResponse("Panchang sun times cleared successfully", this.toResponse(item));
  }

  private async ensureRecord(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.panchangDate.findFirst({
      where: { id: panchangDateId, panchangId },
    });
    if (!item) {
      throw new NotFoundException("Panchang date not found");
    }
    return item;
  }

  private toDatePayload(dto: CreatePanchangSunTimeDto | UpdatePanchangSunTimeDto) {
    return Object.fromEntries(
      Object.entries(dto)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, value ? new Date(value as string) : null]),
    );
  }

  private toResponse(item: {
    id: string;
    panchangId: string;
    sunrise: Date | null;
    sunset: Date | null;
    moonrise: Date | null;
    moonset: Date | null;
    updatedAt: Date;
  }) {
    return {
      id: item.id,
      panchangId: item.panchangId,
      sunrise: item.sunrise,
      sunset: item.sunset,
      moonrise: item.moonrise,
      moonset: item.moonset,
      updatedAt: item.updatedAt,
    };
  }
}

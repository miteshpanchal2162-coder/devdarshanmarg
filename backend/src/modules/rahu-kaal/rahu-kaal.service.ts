import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { RahuKaal } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateRahuKaalDto, UpdateRahuKaalDto } from "./dto/rahu-kaal.dto";

@Injectable()
export class RahuKaalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchangDate(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.rahuKaal.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Rahu kaal not found");
    }

    return createApiResponse("Rahu kaal fetched successfully", this.toResponse(item));
  }

  async createRahuKaal(panchangId: string, panchangDateId: string, dto: CreateRahuKaalDto) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const existing = await this.prisma.rahuKaal.findUnique({
      where: { panchangDateId },
    });

    if (existing) {
      throw new ConflictException("Rahu kaal already exists for this panchang date");
    }

    const item = await this.prisma.rahuKaal.create({
      data: {
        panchangDateId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });

    return createApiResponse("Rahu kaal created successfully", this.toResponse(item));
  }

  async updateRahuKaal(panchangId: string, panchangDateId: string, dto: UpdateRahuKaalDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.rahuKaal.update({
      where: { id: existing.id },
      data: {
        ...(dto.startTime ? { startTime: new Date(dto.startTime) } : {}),
        ...(dto.endTime ? { endTime: new Date(dto.endTime) } : {}),
      },
    });

    return createApiResponse("Rahu kaal updated successfully", this.toResponse(item));
  }

  async deleteRahuKaal(panchangId: string, panchangDateId: string) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.rahuKaal.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Rahu kaal deleted successfully", this.toResponse(item));
  }

  private async ensureRecord(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.rahuKaal.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Rahu kaal not found");
    }

    return item;
  }

  private toResponse(item: RahuKaal) {
    return item;
  }
}

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { YamagandaKaal } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateYamagandaKaalDto, UpdateYamagandaKaalDto } from "./dto/yamaganda-kaal.dto";

@Injectable()
export class YamagandaKaalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchangDate(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.yamagandaKaal.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Yamaganda kaal not found");
    }

    return createApiResponse("Yamaganda kaal fetched successfully", this.toResponse(item));
  }

  async createYamagandaKaal(panchangId: string, panchangDateId: string, dto: CreateYamagandaKaalDto) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const existing = await this.prisma.yamagandaKaal.findUnique({
      where: { panchangDateId },
    });

    if (existing) {
      throw new ConflictException("Yamaganda kaal already exists for this panchang date");
    }

    const item = await this.prisma.yamagandaKaal.create({
      data: {
        panchangDateId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });

    return createApiResponse("Yamaganda kaal created successfully", this.toResponse(item));
  }

  async updateYamagandaKaal(panchangId: string, panchangDateId: string, dto: UpdateYamagandaKaalDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.yamagandaKaal.update({
      where: { id: existing.id },
      data: {
        ...(dto.startTime ? { startTime: new Date(dto.startTime) } : {}),
        ...(dto.endTime ? { endTime: new Date(dto.endTime) } : {}),
      },
    });

    return createApiResponse("Yamaganda kaal updated successfully", this.toResponse(item));
  }

  async deleteYamagandaKaal(panchangId: string, panchangDateId: string) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.yamagandaKaal.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Yamaganda kaal deleted successfully", this.toResponse(item));
  }

  private async ensureRecord(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.yamagandaKaal.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Yamaganda kaal not found");
    }

    return item;
  }

  private toResponse(item: YamagandaKaal) {
    return item;
  }
}

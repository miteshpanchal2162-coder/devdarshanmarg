import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { GulikaKaal } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateGulikaKaalDto, UpdateGulikaKaalDto } from "./dto/gulika-kaal.dto";

@Injectable()
export class GulikaKaalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchangDate(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.gulikaKaal.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Gulika kaal not found");
    }

    return createApiResponse("Gulika kaal fetched successfully", this.toResponse(item));
  }

  async createGulikaKaal(panchangId: string, panchangDateId: string, dto: CreateGulikaKaalDto) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const existing = await this.prisma.gulikaKaal.findUnique({
      where: { panchangDateId },
    });

    if (existing) {
      throw new ConflictException("Gulika kaal already exists for this panchang date");
    }

    const item = await this.prisma.gulikaKaal.create({
      data: {
        panchangDateId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });

    return createApiResponse("Gulika kaal created successfully", this.toResponse(item));
  }

  async updateGulikaKaal(panchangId: string, panchangDateId: string, dto: UpdateGulikaKaalDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.gulikaKaal.update({
      where: { id: existing.id },
      data: {
        ...(dto.startTime ? { startTime: new Date(dto.startTime) } : {}),
        ...(dto.endTime ? { endTime: new Date(dto.endTime) } : {}),
      },
    });

    return createApiResponse("Gulika kaal updated successfully", this.toResponse(item));
  }

  async deleteGulikaKaal(panchangId: string, panchangDateId: string) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.gulikaKaal.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Gulika kaal deleted successfully", this.toResponse(item));
  }

  private async ensureRecord(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.gulikaKaal.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Gulika kaal not found");
    }

    return item;
  }

  private toResponse(item: GulikaKaal) {
    return item;
  }
}

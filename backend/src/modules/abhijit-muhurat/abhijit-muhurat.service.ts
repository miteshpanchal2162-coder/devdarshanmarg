import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { AbhijitMuhurat } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateAbhijitMuhuratDto, UpdateAbhijitMuhuratDto } from "./dto/abhijit-muhurat.dto";

@Injectable()
export class AbhijitMuhuratService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByPanchangDate(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.abhijitMuhurat.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Abhijit muhurat not found");
    }

    return createApiResponse("Abhijit muhurat fetched successfully", this.toResponse(item));
  }

  async createAbhijitMuhurat(panchangId: string, panchangDateId: string, dto: CreateAbhijitMuhuratDto) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const existing = await this.prisma.abhijitMuhurat.findUnique({
      where: { panchangDateId },
    });

    if (existing) {
      throw new ConflictException("Abhijit muhurat already exists for this panchang date");
    }

    const item = await this.prisma.abhijitMuhurat.create({
      data: {
        panchangDateId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        isAvailable: dto.isAvailable ?? true,
      },
    });

    return createApiResponse("Abhijit muhurat created successfully", this.toResponse(item));
  }

  async updateAbhijitMuhurat(panchangId: string, panchangDateId: string, dto: UpdateAbhijitMuhuratDto) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.abhijitMuhurat.update({
      where: { id: existing.id },
      data: {
        ...(dto.startTime ? { startTime: new Date(dto.startTime) } : {}),
        ...(dto.endTime ? { endTime: new Date(dto.endTime) } : {}),
        ...(dto.isAvailable !== undefined ? { isAvailable: dto.isAvailable } : {}),
      },
    });

    return createApiResponse("Abhijit muhurat updated successfully", this.toResponse(item));
  }

  async deleteAbhijitMuhurat(panchangId: string, panchangDateId: string) {
    const existing = await this.ensureRecord(panchangId, panchangDateId);
    const item = await this.prisma.abhijitMuhurat.delete({
      where: { id: existing.id },
    });

    return createApiResponse("Abhijit muhurat deleted successfully", this.toResponse(item));
  }

  private async ensureRecord(panchangId: string, panchangDateId: string) {
    await this.relationValidation.validatePanchangDateHierarchy(panchangId, panchangDateId);
    const item = await this.prisma.abhijitMuhurat.findUnique({
      where: { panchangDateId },
    });

    if (!item) {
      throw new NotFoundException("Abhijit muhurat not found");
    }

    return item;
  }

  private toResponse(item: AbhijitMuhurat) {
    return item;
  }
}

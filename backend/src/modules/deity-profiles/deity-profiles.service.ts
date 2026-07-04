import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DeityProfile, Status } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateDeityProfileDto, UpdateDeityProfileDto } from "./dto/deity-profile.dto";

@Injectable()
export class DeityProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByDeity(deityId: string) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const item = await this.prisma.deityProfile.findFirst({
      where: { deityId, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException("Deity profile not found");
    }

    return createApiResponse("Deity profile fetched successfully", this.toResponse(item));
  }

  async createProfile(deityId: string, dto: CreateDeityProfileDto, actorId: string) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const existing = await this.prisma.deityProfile.findUnique({
      where: { deityId },
    });

    if (existing) {
      throw new ConflictException("Deity profile already exists for this deity");
    }

    const item = await this.prisma.deityProfile.create({
      data: {
        ...dto,
        deityId,
        status: dto.status ?? Status.ACTIVE,
        sortOrder: dto.sortOrder ?? 0,
        isFeatured: dto.isFeatured ?? false,
        isPopular: dto.isPopular ?? false,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });

    return createApiResponse("Deity profile created successfully", this.toResponse(item));
  }

  async updateProfile(deityId: string, dto: UpdateDeityProfileDto, actorId: string) {
    const existing = await this.ensureRecord(deityId);
    const item = await this.prisma.deityProfile.update({
      where: { id: existing.id },
      data: { ...dto, updatedBy: actorId },
    });

    return createApiResponse("Deity profile updated successfully", this.toResponse(item));
  }

  async deleteProfile(deityId: string, actorId: string) {
    const existing = await this.ensureRecord(deityId);
    await this.prisma.deityProfile.update({
      where: { id: existing.id },
      data: { updatedBy: actorId },
    });
    const item = await this.prisma.deityProfile.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() },
    });

    return createApiResponse("Deity profile deleted successfully", this.toResponse(item));
  }

  async restoreProfile(deityId: string, actorId: string) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const existing = await this.prisma.deityProfile.findUnique({
      where: { deityId },
    });

    if (!existing) {
      throw new NotFoundException("Deity profile not found");
    }

    const item = await this.prisma.deityProfile.update({
      where: { id: existing.id },
      data: { deletedAt: null, updatedBy: actorId },
    });

    return createApiResponse("Deity profile restored successfully", this.toResponse(item));
  }

  async updateStatus(deityId: string, status: Status, actorId: string) {
    const existing = await this.ensureRecord(deityId);
    const item = await this.prisma.deityProfile.update({
      where: { id: existing.id },
      data: { status, updatedBy: actorId },
    });

    return createApiResponse("Deity profile status updated successfully", this.toResponse(item));
  }

  private async ensureRecord(deityId: string) {
    await this.relationValidation.validateForeignKeys({ deityId });
    const item = await this.prisma.deityProfile.findFirst({
      where: { deityId, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException("Deity profile not found");
    }

    return item;
  }

  private toResponse(item: DeityProfile) {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}

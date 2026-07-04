import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DeityRelation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";
import { CreateDeityRelationDto, UpdateDeityRelationDto } from "./dto/deity-relation.dto";

@Injectable()
export class DeityRelationsService extends DeityChildCrudService<DeityRelation> {
  constructor(
    private readonly prisma: PrismaService,
    relationValidation: RelationValidationService,
  ) {
    super(
      prisma.deityRelation,
      {
        allowedFilterFields: ["relatedDeityId", "relationType", "isPrimary"],
        allowedSortFields: ["relatedDeityId", "relationType", "isPrimary", "relationCode"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Deity relation",
        searchableFields: ["relationCode", "relationType", "description"],
      },
      relationValidation,
    );
  }

  async createChild(deityId: string, data: object, actorId: string) {
    const payload = data as CreateDeityRelationDto;
    this.ensureNotSelfRelation(deityId, payload.relatedDeityId);
    await this.ensureMappingUnique(deityId, payload);
    return super.createChild(deityId, data, actorId);
  }

  async updateChild(deityId: string, id: string, data: object, actorId: string) {
    const payload = data as UpdateDeityRelationDto;
    const existing = await this.prisma.deityRelation.findFirst({
      where: { id, deityId },
    });

    if (!existing) {
      throw new NotFoundException("Deity relation not found");
    }

    const relatedDeityId = payload.relatedDeityId ?? existing.relatedDeityId;
    const relationType = payload.relationType ?? existing.relationType;
    this.ensureNotSelfRelation(deityId, relatedDeityId);
    await this.ensureMappingUnique(deityId, { relatedDeityId, relationType }, id);
    return super.updateChild(deityId, id, data, actorId);
  }

  private ensureNotSelfRelation(deityId: string, relatedDeityId: string) {
    if (deityId === relatedDeityId) {
      throw new BadRequestException("Deity cannot be related to itself");
    }
  }

  private async ensureMappingUnique(
    deityId: string,
    data: { relatedDeityId?: string; relationType?: string },
    excludeId?: string,
  ) {
    if (!data.relatedDeityId || !data.relationType) {
      return;
    }

    const existing = await this.prisma.deityRelation.findFirst({
      where: {
        deityId,
        relatedDeityId: data.relatedDeityId,
        relationType: data.relationType,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("Deity relation already exists for this deity");
    }
  }
}

import { Injectable } from "@nestjs/common";
import { PanchangPlanetPosition } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangDateChildCrudService } from "../panchang-date-child-common/panchang-date-child-crud.service";

@Injectable()
export class PanchangPlanetPositionsService extends PanchangDateChildCrudService<PanchangPlanetPosition> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangPlanetPosition,
      {
        allowedFilterFields: ["planetId", "rashiId", "isRetrograde"],
        allowedSortFields: ["planetId", "rashiId", "degree", "longitude"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Panchang planet position",
        searchableFields: [],
        uniqueField: "planetId",
      },
      relationValidation,
    );
  }

  async createChild(panchangId: string, panchangDateId: string, data: object, actorId: string) {
    return super.createChild(
      panchangId,
      panchangDateId,
      this.normalizePayload(data as Record<string, unknown>),
      actorId,
    );
  }

  async updateChild(panchangId: string, panchangDateId: string, id: string, data: object, actorId: string) {
    return super.updateChild(
      panchangId,
      panchangDateId,
      id,
      this.normalizePayload(data as Record<string, unknown>),
      actorId,
    );
  }

  private normalizePayload(data: Record<string, unknown>) {
    const payload = { ...data };
    for (const field of ["degree", "longitude"] as const) {
      if (payload[field] !== undefined && payload[field] !== null) {
        payload[field] = Number(payload[field]);
      }
    }
    return payload;
  }
}

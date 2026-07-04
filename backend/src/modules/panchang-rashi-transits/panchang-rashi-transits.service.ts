import { Injectable } from "@nestjs/common";
import { PanchangRashiTransit } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangDateChildCrudService } from "../panchang-date-child-common/panchang-date-child-crud.service";

@Injectable()
export class PanchangRashiTransitsService extends PanchangDateChildCrudService<PanchangRashiTransit> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangRashiTransit,
      {
        allowedFilterFields: ["planetId", "fromRashiId", "toRashiId"],
        allowedSortFields: ["planetId", "fromRashiId", "toRashiId", "transitTime"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Panchang rashi transit",
        searchableFields: [],
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
    if (typeof payload.transitTime === "string") {
      payload.transitTime = new Date(payload.transitTime);
    }
    return payload;
  }
}

import { Injectable } from "@nestjs/common";
import { Ekadashi } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangDateChildCrudService } from "../panchang-date-child-common/panchang-date-child-crud.service";

@Injectable()
export class EkadashiService extends PanchangDateChildCrudService<Ekadashi> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.ekadashi,
      {
        allowedFilterFields: ["isMajor"],
        allowedSortFields: ["name", "startTime", "endTime", "isMajor"],
        hasSoftDelete: false,
        hasAuditFields: false,
        hasSortOrder: false,
        messageName: "Ekadashi",
        searchableFields: ["name", "description"],
        uniqueField: "name",
      },
      relationValidation,
    );
  }

  async createChild(panchangId: string, panchangDateId: string, data: object, actorId: string) {
    return super.createChild(panchangId, panchangDateId, this.normalizePayload(data as Record<string, unknown>), actorId);
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
    for (const field of ["startTime", "endTime"] as const) {
      if (typeof payload[field] === "string") {
        payload[field] = new Date(payload[field] as string);
      }
    }
    return payload;
  }
}

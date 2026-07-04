import { Injectable } from "@nestjs/common";
import { PanchangDate } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangDatesService extends PanchangChildCrudService<PanchangDate> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangDate,
      {
        allowedFilterFields: ["calendarDate", "weekday", "paksha", "masa", "ritu", "ayana"],
        allowedSortFields: ["calendarDate", "weekday", "paksha", "masa", "ritu"],
        hasSoftDelete: false,
        hasSortOrder: false,
        messageName: "Panchang date",
        searchableFields: ["hinduYear", "vikramSamvat", "shakSamvat", "weekday", "paksha", "masa", "ritu", "ayana"],
        uniqueField: "calendarDate",
      },
      relationValidation,
    );
  }

  protected normalizePayload(data: Record<string, unknown>) {
    const payload = { ...data };
    if (typeof payload.calendarDate === "string") {
      payload.calendarDate = new Date(payload.calendarDate);
    }
    for (const field of ["sunrise", "sunset", "moonrise", "moonset"] as const) {
      if (typeof payload[field] === "string") {
        payload[field] = new Date(payload[field] as string);
      }
    }
    return payload;
  }

  async createChild(panchangId: string, data: object, actorId: string) {
    return super.createChild(panchangId, this.normalizePayload(data as Record<string, unknown>), actorId);
  }

  async updateChild(panchangId: string, id: string, data: object, actorId: string) {
    return super.updateChild(panchangId, id, this.normalizePayload(data as Record<string, unknown>), actorId);
  }
}

import { Injectable } from "@nestjs/common";
import { VratDate } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { VratChildCrudService } from "../vrat-child-common/vrat-child-crud.service";

@Injectable()
export class VratDatesService extends VratChildCrudService<VratDate> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.vratDate,
      {
        allowedFilterFields: ["isMajor", "panchangDateId"],
        allowedSortFields: ["startTime", "endTime", "isMajor", "panchangDateId"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Vrat date",
        searchableFields: ["remarks"],
        uniqueField: "panchangDateId",
      },
      relationValidationService,
    );
  }

  async createChild(vratId: string, data: object, actorId: string) {
    const payload = this.normalizePayload(data as Record<string, unknown>);
    await this.relationValidationService.validateForeignKeys({
      vratId,
      panchangDateId: payload.panchangDateId as string,
    });
    return super.createChild(vratId, payload, actorId);
  }

  async updateChild(vratId: string, id: string, data: object, actorId: string) {
    const payload = this.normalizePayload(data as Record<string, unknown>);
    if (payload.panchangDateId) {
      await this.relationValidationService.validateForeignKeys({
        panchangDateId: payload.panchangDateId as string,
      });
    }
    return super.updateChild(vratId, id, payload, actorId);
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

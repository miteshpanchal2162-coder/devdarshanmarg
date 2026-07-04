import { ConflictException, Injectable } from "@nestjs/common";
import { Choghadiya } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangDateChildCrudService } from "../panchang-date-child-common/panchang-date-child-crud.service";

@Injectable()
export class ChoghadiyasService extends PanchangDateChildCrudService<Choghadiya> {
  constructor(
    private readonly prisma: PrismaService,
    relationValidation: RelationValidationService,
  ) {
    super(
      prisma.choghadiya,
      {
        allowedFilterFields: ["periodType", "choghadiyaType", "isAuspicious"],
        allowedSortFields: ["periodType", "choghadiyaType", "startTime", "endTime"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Choghadiya",
        searchableFields: ["periodType", "choghadiyaType"],
      },
      relationValidation,
    );
  }

  async createChild(panchangId: string, panchangDateId: string, data: object, actorId: string) {
    const payload = this.normalizePayload(data as Record<string, unknown>);
    await this.ensureDuplicateMapping(panchangDateId, payload);
    return super.createChild(panchangId, panchangDateId, payload, actorId);
  }

  async updateChild(panchangId: string, panchangDateId: string, id: string, data: object, actorId: string) {
    const payload = this.normalizePayload(data as Record<string, unknown>);
    await this.ensureDuplicateMapping(panchangDateId, payload, id);
    return super.updateChild(panchangId, panchangDateId, id, payload, actorId);
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

  private async ensureDuplicateMapping(
    panchangDateId: string,
    data: Record<string, unknown>,
    excludeId?: string,
  ) {
    if (!data.periodType || !data.choghadiyaType || !data.startTime) return;

    const existing = await this.prisma.choghadiya.findFirst({
      where: {
        panchangDateId,
        periodType: data.periodType as string,
        choghadiyaType: data.choghadiyaType as string,
        startTime: data.startTime as Date,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("Choghadiya already exists for this panchang date");
    }
  }
}

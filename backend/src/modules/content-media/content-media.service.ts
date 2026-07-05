import { Injectable } from "@nestjs/common";
import { ContentMedia } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentMediaService extends ContentItemChildCrudService<ContentMedia> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentMedia,
      {
        allowedFilterFields: ["mediaTypeId", "languageId", "isPrimary"],
        allowedSortFields: ["mediaTypeId", "languageId", "mediaCode", "title", "duration", "sortOrder"],
        messageName: "Content media",
        searchableFields: ["mediaCode", "title", "altText", "caption", "credit", "mimeType"],
        uniqueField: "mediaCode",
      },
      relationValidationService,
    );
  }

  async createChild(contentItemId: string, data: object, actorId: string) {
    return super.createChild(contentItemId, this.preparePayload(data as Record<string, unknown>), actorId);
  }

  async updateChild(contentItemId: string, id: string, data: object, actorId: string) {
    return super.updateChild(contentItemId, id, this.preparePayload(data as Record<string, unknown>), actorId);
  }

  protected async validateChildRelations(data: Record<string, unknown>) {
    await this.relationValidationService.validateForeignKeys({
      languageId: this.asString(data.languageId),
      mediaTypeId: this.asString(data.mediaTypeId),
    });
    return undefined;
  }

  private preparePayload(data: Record<string, unknown>) {
    const payload = { ...data };

    if (payload.fileSize !== undefined && payload.fileSize !== null) {
      payload.fileSize = BigInt(payload.fileSize as number);
    }
    if (typeof payload.takenAt === "string") {
      payload.takenAt = new Date(payload.takenAt);
    }
    if (payload.latitude !== undefined && payload.latitude !== null) {
      payload.latitude = new Prisma.Decimal(payload.latitude as number);
    }
    if (payload.longitude !== undefined && payload.longitude !== null) {
      payload.longitude = new Prisma.Decimal(payload.longitude as number);
    }

    return payload;
  }

  private asString(value: unknown) {
    return typeof value === "string" ? value : undefined;
  }
}

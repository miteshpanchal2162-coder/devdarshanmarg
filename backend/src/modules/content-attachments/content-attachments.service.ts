import { Injectable } from "@nestjs/common";
import { ContentAttachment } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentAttachmentsService extends ContentItemChildCrudService<ContentAttachment> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentAttachment,
      {
        allowedFilterFields: ["languageId", "isDownloadable", "fileType"],
        allowedSortFields: ["languageId", "attachmentCode", "title", "fileName", "sortOrder"],
        messageName: "Content attachment",
        searchableFields: ["attachmentCode", "title", "fileName", "fileType", "version", "checksum"],
        uniqueField: "attachmentCode",
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
    });
    return undefined;
  }

  private preparePayload(data: Record<string, unknown>) {
    const payload = { ...data };

    if (payload.fileSize !== undefined && payload.fileSize !== null) {
      payload.fileSize = BigInt(payload.fileSize as number);
    }

    return payload;
  }

  private asString(value: unknown) {
    return typeof value === "string" ? value : undefined;
  }
}

import { Injectable } from "@nestjs/common";
import { ContentPublishLog } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentPublishLogsService extends ContentItemChildCrudService<ContentPublishLog> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentPublishLog,
      {
        allowedFilterFields: ["userId", "action"],
        allowedSortFields: ["userId", "action", "createdAt"],
        hasAuditFields: false,
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Content publish log",
        searchableFields: ["action", "remarks"],
      },
      relationValidationService,
    );
  }

  async createChild(contentItemId: string, data: object, actorId: string) {
    const payload = { ...(data as Record<string, unknown>) };
    if (!payload.userId && actorId) {
      payload.userId = actorId;
    }
    return super.createChild(contentItemId, payload, actorId);
  }

  protected async validateChildRelations(data: Record<string, unknown>) {
    const userId = typeof data.userId === "string" ? data.userId : undefined;
    if (userId) {
      await this.relationValidationService.validateForeignKeys({ userId });
    }
    return undefined;
  }
}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ContentRelatedItem } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentRelatedItemsService extends ContentItemChildCrudService<ContentRelatedItem> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentRelatedItem,
      {
        allowedFilterFields: ["relatedContentId", "relationType"],
        allowedSortFields: ["relatedContentId", "relationType", "sortOrder", "createdAt"],
        hasAuditFields: false,
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Content related item",
        searchableFields: ["relationType"],
        uniqueField: "relatedContentId",
      },
      relationValidationService,
    );
  }

  async createChild(contentItemId: string, data: object, actorId: string) {
    this.ensureNotSelfReference(contentItemId, data as Record<string, unknown>);
    return super.createChild(contentItemId, data, actorId);
  }

  async updateChild(contentItemId: string, id: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    const existing = await this.prisma.contentRelatedItem.findFirst({
      where: { id, contentId: contentItemId },
    });

    if (!existing) {
      throw new NotFoundException("Content related item not found");
    }

    this.ensureNotSelfReference(
      contentItemId,
      { relatedContentId: payload.relatedContentId ?? existing.relatedContentId },
    );

    return super.updateChild(contentItemId, id, data, actorId);
  }

  protected async validateChildRelations(data: Record<string, unknown>) {
    const relatedContentId =
      typeof data.relatedContentId === "string" ? data.relatedContentId : undefined;
    if (relatedContentId) {
      await this.relationValidationService.validateForeignKeys({ relatedContentItemId: relatedContentId });
    }
    return undefined;
  }

  private ensureNotSelfReference(contentItemId: string, data: Record<string, unknown>) {
    if (data.relatedContentId === contentItemId) {
      throw new BadRequestException("Content item cannot be related to itself");
    }
  }
}

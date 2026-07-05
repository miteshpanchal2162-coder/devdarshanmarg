import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ContentEntityMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentEntityMapsService extends ContentItemChildCrudService<ContentEntityMap> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentEntityMap,
      {
        allowedFilterFields: ["entityTypeId", "entityId", "isPrimary", "isFeatured"],
        allowedSortFields: ["entityTypeId", "entityId", "displayTitle", "sortOrder"],
        messageName: "Content entity map",
        searchableFields: ["displayTitle", "displayDescription"],
      },
      relationValidationService,
    );
  }

  async createChild(contentItemId: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    await this.ensureUniqueMapping(contentItemId, payload);
    return super.createChild(contentItemId, data, actorId);
  }

  async updateChild(contentItemId: string, id: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    const existing = await this.prisma.contentEntityMap.findFirst({
      where: { id, contentId: contentItemId, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException("Content entity map not found");
    }

    await this.ensureUniqueMapping(
      contentItemId,
      {
        entityTypeId: payload.entityTypeId ?? existing.entityTypeId,
        entityId: payload.entityId ?? existing.entityId,
      },
      id,
    );

    return super.updateChild(contentItemId, id, data, actorId);
  }

  protected async validateChildRelations(data: Record<string, unknown>) {
    const entityTypeId = typeof data.entityTypeId === "string" ? data.entityTypeId : undefined;
    if (entityTypeId) {
      await this.relationValidationService.validateForeignKeys({ contentEntityTypeId: entityTypeId });
    }
    return undefined;
  }

  private async ensureUniqueMapping(
    contentItemId: string,
    data: Record<string, unknown>,
    excludeId?: string,
  ) {
    const entityTypeId = data.entityTypeId;
    const entityId = data.entityId;

    if (typeof entityTypeId !== "string" || typeof entityId !== "string") {
      return;
    }

    const existing = await this.prisma.contentEntityMap.findFirst({
      where: {
        contentId: contentItemId,
        entityTypeId,
        entityId,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException("Content entity map already exists for this content item");
    }
  }
}

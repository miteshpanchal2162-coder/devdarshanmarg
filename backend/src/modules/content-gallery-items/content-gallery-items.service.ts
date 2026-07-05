import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentGalleryItem } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentGalleryChildCrudService } from "../content-gallery-child-common/content-gallery-child-crud.service";

@Injectable()
export class ContentGalleryItemsService extends ContentGalleryChildCrudService<ContentGalleryItem> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentGalleryItem,
      {
        allowedFilterFields: ["mediaId"],
        allowedSortFields: ["mediaId", "sortOrder", "createdAt"],
        messageName: "Content gallery item",
        searchableFields: [],
        uniqueField: "mediaId",
      },
      relationValidationService,
    );
  }

  async updateChild(contentItemId: string, galleryId: string, id: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    const existing = await this.prisma.contentGalleryItem.findFirst({
      where: { id, galleryId },
    });

    if (!existing) {
      throw new NotFoundException("Content gallery item not found");
    }

    const mediaId = payload.mediaId ?? existing.mediaId;
    if (typeof mediaId === "string") {
      await this.relationValidationService.validateContentMediaHierarchy(contentItemId, mediaId);
    }

    return super.updateChild(contentItemId, galleryId, id, data, actorId);
  }

  protected async validateChildRelations(contentItemId: string, data: Record<string, unknown>) {
    const mediaId = typeof data.mediaId === "string" ? data.mediaId : undefined;
    if (mediaId) {
      await this.relationValidationService.validateContentMediaHierarchy(contentItemId, mediaId);
    }
    return undefined;
  }
}

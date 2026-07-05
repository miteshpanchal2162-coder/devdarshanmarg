import { Injectable } from "@nestjs/common";
import { ContentGallery } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentGalleriesService extends ContentItemChildCrudService<ContentGallery> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentGallery,
      {
        allowedFilterFields: ["coverMediaId", "isFeatured"],
        allowedSortFields: ["galleryCode", "title", "sortOrder"],
        messageName: "Content gallery",
        searchableFields: ["galleryCode", "title", "description"],
        uniqueField: "galleryCode",
      },
      relationValidationService,
    );
  }

  protected async validateCoverMedia(contentItemId: string, data: Record<string, unknown>) {
    const coverMediaId = typeof data.coverMediaId === "string" ? data.coverMediaId : undefined;
    if (coverMediaId) {
      await this.relationValidationService.validateContentMediaHierarchy(contentItemId, coverMediaId);
    }
  }

  async createChild(contentItemId: string, data: object, actorId: string) {
    await this.validateCoverMedia(contentItemId, data as Record<string, unknown>);
    return super.createChild(contentItemId, data, actorId);
  }

  async updateChild(contentItemId: string, id: string, data: object, actorId: string) {
    await this.validateCoverMedia(contentItemId, data as Record<string, unknown>);
    return super.updateChild(contentItemId, id, data, actorId);
  }
}

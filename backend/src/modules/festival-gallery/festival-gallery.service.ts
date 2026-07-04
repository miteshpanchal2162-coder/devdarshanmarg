import { Injectable } from "@nestjs/common";
import { FestivalGallery } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalGalleryService extends FestivalChildCrudService<FestivalGallery> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalGallery,
      {
        allowedFilterFields: ["mediaTypeId", "languageId", "isHero", "isFeatured"],
        allowedSortFields: ["mediaTypeId", "languageId", "title", "photographer"],
        messageName: "Festival gallery item",
        searchableFields: ["title", "galleryCode", "caption", "altText", "photographer"],
        uniqueField: "galleryCode",
      },
      relationValidation,
    );
  }
}
